
import { GoogleGenAI, Type } from "@google/genai";
import { CodeReviewResponse, InterviewQuestion } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async reviewCode(code: string, language: string): Promise<CodeReviewResponse> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Perform a deep code review of the following ${language} code. 
      Focus on bugs, performance, complexity, and readability. 
      Also provide a simple "Explain like I'm 12" summary.
      
      CODE:
      ${code}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bugs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  line: { type: Type.NUMBER },
                  severity: { type: Type.STRING, enum: ['Critical', 'Warning', 'Suggestion'] }
                },
                required: ['description', 'severity']
              }
            },
            optimizations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  suggestion: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  improvedCode: { type: Type.STRING }
                },
                required: ['suggestion', 'reason']
              }
            },
            complexity: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                space: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ['time', 'space', 'explanation']
            },
            readability: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['score', 'feedback']
            },
            eli12: { type: Type.STRING }
          },
          required: ['bugs', 'optimizations', 'complexity', 'readability', 'eli12']
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      throw new Error("Failed to parse AI response. Try again.");
    }
  }

  async generateInterviewQuestions(code: string, language: string): Promise<InterviewQuestion[]> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Based on this ${language} code, generate 3 technical interview questions that test the programmer's understanding of the concepts used (e.g., algorithms, data structures, edge cases).
      
      CODE:
      ${code}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
              category: { type: Type.STRING },
              hints: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['question', 'difficulty', 'category', 'hints']
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || '[]');
    } catch (e) {
      throw new Error("Failed to generate interview questions.");
    }
  }
}

export const geminiService = new GeminiService();
