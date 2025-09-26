"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = void 0;
const openai_1 = __importDefault(require("openai"));
const inference_1 = require("@huggingface/inference");
const logger_1 = require("../utils/logger");
class AIService {
    constructor() {
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.hf = new inference_1.HfInference(process.env.HUGGINGFACE_API_KEY);
    }
    async analyzeCode(code, language, filePath) {
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
        }
        catch (error) {
            logger_1.logger.error('AI analysis failed:', error);
            throw new Error('Failed to analyze code');
        }
    }
    async analyzeCodeQuality(code, language) {
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
    async detectSecurityIssues(code, language) {
        const securityPatterns = {
            javascript: [
                { pattern: /eval\s*\(/, type: 'Code Injection', severity: 'HIGH' },
                { pattern: /innerHTML\s*=/, type: 'XSS Risk', severity: 'MEDIUM' },
                { pattern: /document\.write\s*\(/, type: 'XSS Risk', severity: 'MEDIUM' }
            ],
            python: [
                { pattern: /exec\s*\(/, type: 'Code Injection', severity: 'HIGH' },
                { pattern: /os\.system\s*\(/, type: 'Command Injection', severity: 'HIGH' },
                { pattern: /pickle\.loads?\s*\(/, type: 'Deserialization Risk', severity: 'HIGH' }
            ],
            java: [
                { pattern: /Runtime\.getRuntime\(\)\.exec/, type: 'Command Injection', severity: 'HIGH' },
                { pattern: /Class\.forName/, type: 'Reflection Risk', severity: 'MEDIUM' }
            ]
        };
        const issues = [];
        const patterns = securityPatterns[language] || [];
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
    async analyzePerformance(code, language) {
        const performancePatterns = {
            javascript: [
                { pattern: /for\s*\([^)]*\)\s*{[^}]*for\s*\([^)]*\)/, type: 'Nested Loops', impact: 'HIGH' },
                { pattern: /\.innerHTML\s*\+=/, type: 'DOM Manipulation', impact: 'MEDIUM' }
            ],
            python: [
                { pattern: /for\s+\w+\s+in\s+range\([^)]+\):[^}]*for\s+\w+\s+in\s+range/, type: 'Nested Loops', impact: 'HIGH' },
                { pattern: /\+\s*=.*\[.*\]/, type: 'List Concatenation', impact: 'MEDIUM' }
            ]
        };
        const issues = [];
        const patterns = performancePatterns[language] || [];
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
    async generateAutoFix(code, issue, language) {
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
    async explainIssue(issue, complexity = 'intermediate') {
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
    async getCodeEmbedding(code) {
        try {
            const embedding = await this.hf.featureExtraction({
                model: 'microsoft/codebert-base',
                inputs: code
            });
            return Array.isArray(embedding) ? embedding.flat(Infinity) : [];
        }
        catch (error) {
            logger_1.logger.error('Failed to generate code embedding:', error);
            return [];
        }
    }
}
exports.aiService = new AIService();
//# sourceMappingURL=aiService.js.map