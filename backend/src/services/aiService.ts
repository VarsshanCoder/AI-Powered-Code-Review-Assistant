import OpenAI from 'openai';
import { HfInference } from '@huggingface/inference';
import { logger } from '../utils/logger';

interface CodeAnalysis {
  quality: number;
  maintainability: number;
  complexity: number;
  security: SecurityIssue[];
  performance: PerformanceIssue[];
  suggestions: Suggestion[];
}

interface SecurityIssue {
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  line: number;
  suggestion: string;
}

interface PerformanceIssue {
  type: string;
  description: string;
  line: number;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestion: string;
}

interface Suggestion {
  type: 'REFACTOR' | 'OPTIMIZE' | 'FIX' | 'STYLE';
  description: string;
  line: number;
  originalCode: string;
  suggestedCode: string;
  confidence: number;
}

class AIService {
  private openai: OpenAI;
  private hf: HfInference;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }

  async analyzeCode(code: string, language: string, filePath: string): Promise<CodeAnalysis> {
    try {
      const [qualityAnalysis, securityAnalysis, performanceAnalysis] = await Promise.all([
        this.analyzeCodeQuality(code, language),
        this.detectSecurityIssues(code, language),
        this.analyzePerformance(code, language)
      ]);

      return {
        quality: qualityAnalysis.score,
        maintainability: qualityAnalysis.maintainability,
        complexity: qualityAnalysis.complexity,
        security: securityAnalysis,
        performance: performanceAnalysis,
        suggestions: qualityAnalysis.suggestions
      };
    } catch (error) {
      logger.error('AI analysis failed:', error);
      throw new Error('Failed to analyze code');
    }
  }

  private async analyzeCodeQuality(code: string, language: string) {
    const prompt = `Analyze this ${language} code for quality, maintainability, and complexity. Provide a score (0-100) and specific suggestions:

\`\`\`${language}
${code}
\`\`\`

Return JSON with: score, maintainability, complexity, suggestions[]`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  private async detectSecurityIssues(code: string, language: string): Promise<SecurityIssue[]> {
    const securityPatterns = {
      javascript: [
        { pattern: /eval\s*\(/, type: 'Code Injection', severity: 'HIGH' as const },
        { pattern: /innerHTML\s*=/, type: 'XSS Risk', severity: 'MEDIUM' as const },
        { pattern: /document\.write\s*\(/, type: 'XSS Risk', severity: 'MEDIUM' as const }
      ],
      python: [
        { pattern: /exec\s*\(/, type: 'Code Injection', severity: 'HIGH' as const },
        { pattern: /os\.system\s*\(/, type: 'Command Injection', severity: 'HIGH' as const },
        { pattern: /pickle\.loads?\s*\(/, type: 'Deserialization Risk', severity: 'HIGH' as const }
      ],
      java: [
        { pattern: /Runtime\.getRuntime\(\)\.exec/, type: 'Command Injection', severity: 'HIGH' as const },
        { pattern: /Class\.forName/, type: 'Reflection Risk', severity: 'MEDIUM' as const }
      ]
    };

    const issues: SecurityIssue[] = [];
    const patterns = securityPatterns[language as keyof typeof securityPatterns] || [];
    const lines = code.split('\n');

    patterns.forEach(({ pattern, type, severity }) => {
      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          issues.push({
            type,
            severity,
            description: `Potential ${type.toLowerCase()} vulnerability detected`,
            line: index + 1,
            suggestion: `Consider using safer alternatives for ${type.toLowerCase()}`
          });
        }
      });
    });

    return issues;
  }

  private async analyzePerformance(code: string, language: string): Promise<PerformanceIssue[]> {
    const performancePatterns = {
      javascript: [
        { pattern: /for\s*\([^)]*\)\s*{[^}]*for\s*\([^)]*\)/, type: 'Nested Loops', impact: 'HIGH' as const },
        { pattern: /\.innerHTML\s*\+=/, type: 'DOM Manipulation', impact: 'MEDIUM' as const }
      ],
      python: [
        { pattern: /for\s+\w+\s+in\s+range\([^)]+\):[^}]*for\s+\w+\s+in\s+range/, type: 'Nested Loops', impact: 'HIGH' as const },
        { pattern: /\+\s*=.*\[.*\]/, type: 'List Concatenation', impact: 'MEDIUM' as const }
      ]
    };

    const issues: PerformanceIssue[] = [];
    const patterns = performancePatterns[language as keyof typeof performancePatterns] || [];
    const lines = code.split('\n');

    patterns.forEach(({ pattern, type, impact }) => {
      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          issues.push({
            type,
            description: `${type} detected - may impact performance`,
            line: index + 1,
            impact,
            suggestion: `Consider optimizing ${type.toLowerCase()} for better performance`
          });
        }
      });
    });

    return issues;
  }

  async generateAutoFix(code: string, issue: string, language: string): Promise<string> {
    const prompt = `Fix this ${language} code issue: ${issue}

Original code:
\`\`\`${language}
${code}
\`\`\`

Provide only the corrected code without explanation.`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    return response.choices[0].message.content || code;
  }

  async explainIssue(issue: string, complexity: 'beginner' | 'intermediate' | 'expert' = 'intermediate'): Promise<string> {
    const prompts = {
      beginner: `Explain this code issue in very simple terms that a beginner programmer would understand: ${issue}`,
      intermediate: `Explain this code issue and why it matters: ${issue}`,
      expert: `Provide a technical explanation of this code issue: ${issue}`
    };

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompts[complexity] }],
      temperature: 0.3,
    });

    return response.choices[0].message.content || 'Unable to explain issue';
  }

  async getCodeEmbedding(code: string): Promise<number[]> {
    try {
      const embedding = await this.hf.featureExtraction({
        model: 'microsoft/codebert-base',
        inputs: code
      });

      return Array.isArray(embedding) ? embedding.flat(Infinity) as number[] : [];
    } catch (error) {
      logger.error('Failed to generate code embedding:', error);
      return [];
    }
  }
}

export const aiService = new AIService();