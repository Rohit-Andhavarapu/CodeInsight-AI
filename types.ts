
export interface Bug {
  description: string;
  line?: number;
  severity: 'Critical' | 'Warning' | 'Suggestion';
}

export interface Optimization {
  suggestion: string;
  reason: string;
  improvedCode?: string;
}

export interface Complexity {
  time: string;
  space: string;
  explanation: string;
}

export interface Readability {
  score: number;
  feedback: string[];
}

export interface CodeReviewResponse {
  bugs: Bug[];
  optimizations: Optimization[];
  complexity: Complexity;
  readability: Readability;
  eli12: string;
}

export interface InterviewQuestion {
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  hints: string[];
}

export enum AppMode {
  REVIEW = 'REVIEW',
  INTERVIEW = 'INTERVIEW'
}
