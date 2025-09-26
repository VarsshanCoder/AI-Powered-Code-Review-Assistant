import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { aiService } from '../services/aiService';
import { githubService } from '../services/githubService';
import { logger } from '../utils/logger';
import { io } from '../index';

const prisma = new PrismaClient();

export class ReviewController {
  async createReview(req: Request, res: Response) {
    try {
      const { repositoryId, branch, commitSha, prNumber, title, description } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      const repository = await prisma.repository.findUnique({
        where: { id: repositoryId }
      });

      if (!repository) {
        return res.status(404).json({ error: 'Repository not found' });
      }

      const review = await prisma.review.create({
        data: {
          title,
          description,
          branch,
          commitSha,
          prNumber,
          repositoryId,
          userId,
          status: 'IN_PROGRESS'
        }
      });

      // Start AI analysis in background
      this.analyzeCodeInBackground(review.id, repository, commitSha, prNumber);

      res.status(201).json(review);
    } catch (error) {
      logger.error('Failed to create review:', error);
      res.status(500).json({ error: 'Failed to create review' });
    }
  }

  async getReview(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const review = await prisma.review.findUnique({
        where: { id },
        include: {
          repository: true,
          user: true,
          findings: true,
          comments: {
            include: { user: true }
          }
        }
      });

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json(review);
    } catch (error) {
      logger.error('Failed to get review:', error);
      res.status(500).json({ error: 'Failed to get review' });
    }
  }

  async getReviews(req: Request, res: Response) {
    try {
      const { repositoryId, status, page = 1, limit = 20 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (repositoryId) where.repositoryId = repositoryId;
      if (status) where.status = status;

      const reviews = await prisma.review.findMany({
        where,
        include: {
          repository: true,
          user: true,
          _count: { select: { findings: true, comments: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      });

      const total = await prisma.review.count({ where });

      res.json({
        reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      logger.error('Failed to get reviews:', error);
      res.status(500).json({ error: 'Failed to get reviews' });
    }
  }

  async addComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { content, filePath, line } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          filePath,
          line,
          reviewId: id,
          userId
        },
        include: { user: true }
      });

      // Emit real-time update
      io.to(`review-${id}`).emit('new-comment', comment);

      res.status(201).json(comment);
    } catch (error) {
      logger.error('Failed to add comment:', error);
      res.status(500).json({ error: 'Failed to add comment' });
    }
  }

  async applyAutoFix(req: Request, res: Response) {
    try {
      const { findingId } = req.params;

      const finding = await prisma.finding.findUnique({
        where: { id: findingId },
        include: { review: { include: { repository: true } } }
      });

      if (!finding || !finding.autoFixable) {
        return res.status(400).json({ error: 'Finding not auto-fixable' });
      }

      // Get original code and generate fix
      const repository = finding.review.repository;
      const [owner, repo] = repository.fullName.split('/');
      
      // This would integrate with git provider to apply the fix
      // For now, just mark as fixed
      await prisma.finding.update({
        where: { id: findingId },
        data: { fixed: true }
      });

      res.json({ success: true });
    } catch (error) {
      logger.error('Failed to apply auto-fix:', error);
      res.status(500).json({ error: 'Failed to apply auto-fix' });
    }
  }

  private async analyzeCodeInBackground(reviewId: string, repository: any, commitSha: string, prNumber?: number) {
    try {
      logger.info(`Starting AI analysis for review ${reviewId}`);

      const [owner, repo] = repository.fullName.split('/');
      let filesToAnalyze: any[] = [];

      if (prNumber) {
        // Analyze PR files
        filesToAnalyze = await githubService.getPullRequestFiles('', owner, repo, prNumber);
      } else {
        // Analyze commit files
        filesToAnalyze = await githubService.getCommitDiff('', owner, repo, commitSha);
      }

      const findings: any[] = [];
      let totalScore = 0;
      let fileCount = 0;

      for (const file of filesToAnalyze) {
        if (file.status === 'removed') continue;

        try {
          const content = await githubService.getFileContent('', owner, repo, file.filename, commitSha);
          const language = this.detectLanguage(file.filename);
          
          if (!language) continue;

          const analysis = await aiService.analyzeCode(content, language, file.filename);
          
          totalScore += analysis.quality;
          fileCount++;

          // Convert AI analysis to findings
          analysis.security.forEach(issue => {
            findings.push({
              type: 'SECURITY',
              severity: issue.severity,
              title: issue.type,
              description: issue.description,
              filePath: file.filename,
              startLine: issue.line,
              endLine: issue.line,
              suggestion: issue.suggestion,
              reviewId
            });
          });

          analysis.performance.forEach(issue => {
            findings.push({
              type: 'PERFORMANCE',
              severity: issue.impact,
              title: issue.type,
              description: issue.description,
              filePath: file.filename,
              startLine: issue.line,
              endLine: issue.line,
              suggestion: issue.suggestion,
              reviewId
            });
          });

          analysis.suggestions.forEach(suggestion => {
            findings.push({
              type: 'QUALITY',
              severity: suggestion.confidence > 0.8 ? 'HIGH' : 'MEDIUM',
              title: suggestion.type,
              description: suggestion.description,
              filePath: file.filename,
              startLine: suggestion.line,
              endLine: suggestion.line,
              suggestion: suggestion.suggestedCode,
              autoFixable: suggestion.type === 'FIX',
              reviewId
            });
          });

        } catch (error) {
          logger.error(`Failed to analyze file ${file.filename}:`, error);
        }
      }

      // Save findings to database
      if (findings.length > 0) {
        await prisma.finding.createMany({ data: findings });
      }

      // Update review with score and status
      const finalScore = fileCount > 0 ? totalScore / fileCount : 0;
      await prisma.review.update({
        where: { id: reviewId },
        data: {
          score: finalScore,
          status: 'COMPLETED'
        }
      });

      // Emit real-time update
      io.to(`review-${reviewId}`).emit('analysis-complete', {
        reviewId,
        score: finalScore,
        findingsCount: findings.length
      });

      logger.info(`Completed AI analysis for review ${reviewId}`);
    } catch (error) {
      logger.error(`Failed to analyze review ${reviewId}:`, error);
      
      await prisma.review.update({
        where: { id: reviewId },
        data: { status: 'FAILED' }
      });
    }
  }

  private detectLanguage(filename: string): string | null {
    const extensions: { [key: string]: string } = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.py': 'python',
      '.java': 'java',
      '.cpp': 'cpp',
      '.c': 'c',
      '.go': 'go',
      '.rs': 'rust',
      '.php': 'php',
      '.rb': 'ruby'
    };

    const ext = filename.substring(filename.lastIndexOf('.'));
    return extensions[ext] || null;
  }
}

export const reviewController = new ReviewController();