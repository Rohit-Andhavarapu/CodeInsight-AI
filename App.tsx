
import React, { useState, useCallback } from 'react';
import { AppMode, CodeReviewResponse, InterviewQuestion } from './types';
import { geminiService } from './services/geminiService';
import CodeEditor from './components/Editor';
import ReviewDisplay from './components/ReviewDisplay';
import InterviewDisplay from './components/InterviewDisplay';

const App: React.FC = () => {
  const [code, setCode] = useState<string>('// Paste your code here...\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}');
  const [language, setLanguage] = useState('javascript');
  const [mode, setMode] = useState<AppMode>(AppMode.REVIEW);
  const [isLoading, setIsLoading] = useState(false);
  const [review, setReview] = useState<CodeReviewResponse | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      if (mode === AppMode.REVIEW) {
        const result = await geminiService.reviewCode(code, language);
        setReview(result);
      } else {
        const result = await geminiService.generateInterviewQuestions(code, language);
        setQuestions(result);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined) setCode(value);
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
            CI
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden sm:block">
            CodeInsight AI
          </h1>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-full border border-slate-700">
          <button
            onClick={() => setMode(AppMode.REVIEW)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              mode === AppMode.REVIEW ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Review Mode
          </button>
          <button
            onClick={() => setMode(AppMode.INTERVIEW)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              mode === AppMode.INTERVIEW ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interview Mode
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Side: Editor */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Paste Your Code</h2>
                <p className="text-slate-400 text-sm mt-1">Select language and click "Analyze Code"</p>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <CodeEditor code={code} onChange={handleEditorChange} language={language} />

            <button
              onClick={handleAnalyze}
              disabled={isLoading || !code.trim()}
              className={`w-full py-4 rounded-xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                isLoading 
                  ? 'bg-slate-700 cursor-not-allowed text-slate-500' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing with Gemini...
                </>
              ) : (
                <>
                  {mode === AppMode.REVIEW ? '🔍 Analyze Code' : '💡 Generate Interview Questions'}
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
          </div>

          {/* Right Side: Results */}
          <div className="lg:col-span-6 min-h-[500px]">
            {!review && questions.length === 0 && !isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-slate-800 rounded-3xl opacity-50">
                <div className="text-6xl mb-6">✨</div>
                <h3 className="text-xl font-bold text-slate-300">Ready for insight?</h3>
                <p className="text-slate-500 max-w-xs mt-2">
                  Paste your assignment or project code and let AI take a deep dive into your work.
                </p>
              </div>
            ) : isLoading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-indigo-500">AI</div>
                </div>
                <div className="text-slate-400 animate-pulse text-center">
                  <p className="font-bold">Gemini is reading your code...</p>
                  <p className="text-xs">Finding bugs, checking complexity, and simplifying concepts.</p>
                </div>
              </div>
            ) : (
              <div className="h-full">
                {mode === AppMode.REVIEW && review && <ReviewDisplay review={review} />}
                {mode === AppMode.INTERVIEW && questions.length > 0 && <InterviewDisplay questions={questions} />}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
