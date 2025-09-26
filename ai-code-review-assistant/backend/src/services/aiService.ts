import OpenAI from 'openai';
import { HfInference } from '@huggingface/inference';
import { logger } from '../config/logger';
import { 
  AIAnalysisRequest, 
  AIAnalysisResponse, 
  CodeIssue, 
  CodeSuggestion, 
  CodeMetrics 
} from '../types';

export class AIService {
  private openai: OpenAI;
  private hf: HfInference;

  constructor() {
    const openaiKey = process.env.OPENAI_API_KEY;
    const hfKey = process.env.HUGGINGFACE_API_KEY;

    if (!openaiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.openai = new OpenAI({
      apiKey: openaiKey,
    });

    this.hf = new HfInference(hfKey);
  }

  async analyzeCode(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const startTime = Date.now();
    
    try {
      logger.info(`Starting AI analysis for ${request.filename}`);

      // Run multiple analysis tasks in parallel
      const [
        issues,
        suggestions,
        metrics,
        summary
      ] = await Promise.all([
        this.detectIssues(request),
        this.generateSuggestions(request),
        this.calculateMetrics(request),
        this.generateSummary(request)
      ]);

      const processingTime = Date.now() - startTime;

      logger.info(`AI analysis completed for ${request.filename} in ${processingTime}ms`);

      return {
        issues,
        suggestions,
        metrics,
        summary,
        processingTime
      };
    } catch (error) {
      logger.error('AI analysis failed:', error);
      throw error;
    }
  }

  private async detectIssues(request: AIAnalysisRequest): Promise<CodeIssue[]> {
    try {
      const prompt = this.buildIssueDetectionPrompt(request);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert code reviewer. Analyze the provided code and identify potential issues, bugs, security vulnerabilities, and performance problems. Return your analysis in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return this.parseIssuesResponse(content);
    } catch (error) {
      logger.error('Issue detection failed:', error);
      return [];
    }
  }

  private async generateSuggestions(request: AIAnalysisRequest): Promise<CodeSuggestion[]> {
    try {
      const prompt = this.buildSuggestionPrompt(request);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert code reviewer. Analyze the code and provide improvement suggestions, refactoring opportunities, and optimizations. Return your suggestions in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 2000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return this.parseSuggestionsResponse(content);
    } catch (error) {
      logger.error('Suggestion generation failed:', error);
      return [];
    }
  }

  private async calculateMetrics(request: AIAnalysisRequest): Promise<CodeMetrics> {
    try {
      // Calculate basic metrics
      const lines = request.code.split('\n');
      const linesOfCode = lines.filter(line => 
        line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('/*')
      ).length;

      // Use OpenAI to calculate complexity
      const complexityPrompt = `
        Analyze this ${request.language} code and calculate:
        1. Cyclomatic complexity (0-100 scale)
        2. Maintainability index (0-100 scale, higher is better)
        3. Estimate percentage of duplicated lines

        Code:
        \`\`\`${request.language}
        ${request.code}
        \`\`\`

        Return only a JSON object with: complexity, maintainabilityIndex, duplicatedLines
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: complexityPrompt
          }
        ],
        temperature: 0.1,
        max_tokens: 200
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const aiMetrics = JSON.parse(content);

      return {
        complexity: aiMetrics.complexity || 10,
        maintainabilityIndex: aiMetrics.maintainabilityIndex || 70,
        linesOfCode,
        duplicatedLines: aiMetrics.duplicatedLines || 0,
        testCoverage: undefined // Would need integration with coverage tools
      };
    } catch (error) {
      logger.error('Metrics calculation failed:', error);
      // Return default metrics if AI fails
      const linesOfCode = request.code.split('\n').length;
      return {
        complexity: 10,
        maintainabilityIndex: 70,
        linesOfCode,
        duplicatedLines: 0
      };
    }
  }

  private async generateSummary(request: AIAnalysisRequest): Promise<string> {
    try {
      const prompt = `
        Analyze this ${request.language} code and provide a concise summary of:
        1. Overall code quality
        2. Main concerns or issues found
        3. Strengths of the code
        4. Key recommendations

        Keep it under 200 words and make it actionable.

        Code:
        \`\`\`${request.language}
        ${request.code}
        \`\`\`
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 300
      });

      return response.choices[0]?.message?.content || 'Analysis summary could not be generated.';
    } catch (error) {
      logger.error('Summary generation failed:', error);
      return 'Analysis summary could not be generated due to an error.';
    }
  }

  async generateAutoFix(code: string, issue: CodeIssue, language: string): Promise<string | null> {
    try {
      const prompt = `
        Fix this ${language} code issue:
        
        Issue: ${issue.title} - ${issue.description}
        Line ${issue.line}: ${issue.suggestion || 'See description'}
        
        Original code:
        \`\`\`${language}
        ${code}
        \`\`\`
        
        Provide only the corrected code without explanations. Maintain the same structure and format.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a code fixing assistant. Return only the corrected code without any explanations or markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      });

      return response.choices[0]?.message?.content || null;
    } catch (error) {
      logger.error('Auto-fix generation failed:', error);
      return null;
    }
  }

  async explainCode(code: string, language: string, mode: 'simple' | 'detailed' = 'detailed'): Promise<string> {
    try {
      const prompt = mode === 'simple' 
        ? `Explain this ${language} code in simple terms that a beginner could understand:\n\n\`\`\`${language}\n${code}\n\`\`\``
        : `Provide a detailed technical explanation of this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 500
      });

      return response.choices[0]?.message?.content || 'Could not generate explanation.';
    } catch (error) {
      logger.error('Code explanation failed:', error);
      return 'Could not generate explanation due to an error.';
    }
  }

  private buildIssueDetectionPrompt(request: AIAnalysisRequest): string {
    return `
      Analyze this ${request.language} code for issues. File: ${request.filename}
      
      Look for:
      1. Bugs and logical errors
      2. Security vulnerabilities
      3. Performance issues
      4. Code style violations
      5. Maintainability concerns
      
      Code:
      \`\`\`${request.language}
      ${request.code}
      \`\`\`
      
      Return a JSON array of issues with this structure:
      [
        {
          "type": "bug|security|performance|style|maintainability",
          "severity": "critical|high|medium|low|info",
          "title": "Brief title",
          "description": "Detailed description",
          "line": line_number,
          "column": column_number,
          "rule": "rule_name_if_applicable",
          "fixable": boolean,
          "suggestion": "How to fix",
          "confidence": 0.0-1.0
        }
      ]
    `;
  }

  private buildSuggestionPrompt(request: AIAnalysisRequest): string {
    return `
      Analyze this ${request.language} code and suggest improvements. File: ${request.filename}
      
      Focus on:
      1. Code refactoring opportunities
      2. Performance optimizations
      3. Better design patterns
      4. Code readability improvements
      5. Modern language features
      
      Code:
      \`\`\`${request.language}
      ${request.code}
      \`\`\`
      
      Return a JSON array of suggestions with this structure:
      [
        {
          "type": "improvement|refactor|optimization|security",
          "title": "Brief title",
          "description": "Detailed description",
          "line": line_number,
          "originalCode": "current code snippet",
          "suggestedCode": "improved code snippet",
          "reasoning": "Why this is better",
          "impact": "low|medium|high"
        }
      ]
    `;
  }

  private parseIssuesResponse(content: string): CodeIssue[] {
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const issues = JSON.parse(jsonMatch[0]);
      return issues.map((issue: any, index: number) => ({
        id: `issue-${Date.now()}-${index}`,
        type: issue.type || 'bug',
        severity: issue.severity || 'medium',
        title: issue.title || 'Unknown issue',
        description: issue.description || '',
        line: issue.line || 1,
        column: issue.column,
        endLine: issue.endLine,
        endColumn: issue.endColumn,
        rule: issue.rule,
        fixable: issue.fixable || false,
        suggestion: issue.suggestion,
        confidence: issue.confidence || 0.8
      }));
    } catch (error) {
      logger.error('Failed to parse issues response:', error);
      return [];
    }
  }

  private parseSuggestionsResponse(content: string): CodeSuggestion[] {
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const suggestions = JSON.parse(jsonMatch[0]);
      return suggestions.map((suggestion: any, index: number) => ({
        id: `suggestion-${Date.now()}-${index}`,
        type: suggestion.type || 'improvement',
        title: suggestion.title || 'Code improvement',
        description: suggestion.description || '',
        line: suggestion.line || 1,
        originalCode: suggestion.originalCode || '',
        suggestedCode: suggestion.suggestedCode || '',
        reasoning: suggestion.reasoning || '',
        impact: suggestion.impact || 'medium'
      }));
    } catch (error) {
      logger.error('Failed to parse suggestions response:', error);
      return [];
    }
  }
}

export const aiService = new AIService();