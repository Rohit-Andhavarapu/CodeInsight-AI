
import React, { useState } from 'react';
import { InterviewQuestion } from '../types';

interface InterviewDisplayProps {
  questions: InterviewQuestion[];
}

const InterviewDisplay: React.FC<InterviewDisplayProps> = ({ questions }) => {
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});

  const toggleHint = (index: number) => {
    setRevealedHints(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="bg-indigo-600/20 p-4 rounded-xl border border-indigo-500/30 mb-8">
        <h2 className="text-xl font-bold text-indigo-300 mb-2">🧠 Interview Simulation Mode</h2>
        <p className="text-slate-400 text-sm">
          We've analyzed your code and generated these technical interview questions. 
          Try to answer them out loud or write down your response before checking the hints!
        </p>
      </div>

      {questions.map((q, i) => (
        <div key={i} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 transition-all hover:border-indigo-500/50">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
              q.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
              q.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {q.difficulty}
            </span>
            <span className="text-xs text-slate-500 font-medium">Category: {q.category}</span>
          </div>
          
          <h3 className="text-lg font-semibold text-slate-100 mb-6 leading-relaxed">
            {q.question}
          </h3>

          <div className="pt-4 border-t border-slate-700">
            <button 
              onClick={() => toggleHint(i)}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center gap-2"
            >
              {revealedHints[i] ? 'Hide Hints 🙈' : 'Need a hint? 💡'}
            </button>
            
            {revealedHints[i] && (
              <div className="mt-4 space-y-2 animate-in slide-in-from-top-2">
                {q.hints.map((hint, hi) => (
                  <p key={hi} className="text-sm text-slate-400 bg-slate-900/50 p-2 rounded border border-slate-800 italic">
                    • {hint}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InterviewDisplay;
