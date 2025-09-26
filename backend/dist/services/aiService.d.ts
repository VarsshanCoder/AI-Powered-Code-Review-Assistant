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
declare class AIService {
    private openai;
    private hf;
    constructor();
    analyzeCode(code: string, language: string, filePath: string): Promise<CodeAnalysis>;
    private analyzeCodeQuality;
    private detectSecurityIssues;
    private analyzePerformance;
    generateAutoFix(code: string, issue: string, language: string): Promise<string>;
    explainIssue(issue: string, complexity?: 'beginner' | 'intermediate' | 'expert'): Promise<string>;
    getCodeEmbedding(code: string): Promise<number[]>;
}
export declare const aiService: AIService;
export {};
//# sourceMappingURL=aiService.d.ts.map