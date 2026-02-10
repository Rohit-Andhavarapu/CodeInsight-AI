
import React from 'react';
import { CodeReviewResponse, Bug, Optimization } from '../types';

interface ReviewDisplayProps {
  review: CodeReviewResponse;
}

const SeverityBadge: React.FC<{ severity: Bug['severity'] }> = ({ severity }) => {
  const colors = {
    Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    Warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Suggestion: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${colors[severity]}`}>
      {severity}
    </span>
  );
};

const ReviewDisplay: React.FC<ReviewDisplayProps> = ({ review }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Readability & ELI12 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-100">Readability Score</h3>
            <div className="text-3xl font-black text-emerald-400">{review.readability.score}%</div>
          </div>
          <ul className="space-y-2">
            {review.readability.feedback.map((f, i) => (
              <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span> {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-indigo-900/20 p-6 rounded-2xl border border-indigo-500/30">
          <h3 className="text-xl font-bold text-indigo-300 mb-2">👶 Explain Like I'm 12</h3>
          <p className="text-slate-300 italic leading-relaxed">"{review.eli12}"</p>
        </div>
      </div>

      {/* Bugs Section */}
      <section>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-red-400">🚨</span> Potential Bugs & Issues
        </h3>
        <div className="space-y-3">
          {review.bugs.length === 0 ? (
            <p className="text-emerald-400 bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
              No critical bugs found! Great job.
            </p>
          ) : (
            review.bugs.map((bug, i) => (
              <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <SeverityBadge severity={bug.severity} />
                    {bug.line && <span className="text-xs text-slate-500">Line {bug.line}</span>}
                  </div>
                  <p className="text-slate-200">{bug.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Complexity Section */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-purple-400">⚙️</span> Complexity Analysis
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-700">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Time Complexity</span>
            <div className="text-2xl font-mono text-purple-400">{review.complexity.time}</div>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-700">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Space Complexity</span>
            <div className="text-2xl font-mono text-purple-400">{review.complexity.space}</div>
          </div>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">{review.complexity.explanation}</p>
      </section>

      {/* Optimization Tips */}
      <section>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-amber-400">⚡</span> Optimization Suggestions
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {review.optimizations.map((opt, i) => (
            <div key={i} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
              <h4 className="font-bold text-amber-300 mb-1">{opt.suggestion}</h4>
              <p className="text-slate-400 text-sm mb-3">{opt.reason}</p>
              {opt.improvedCode && (
                <div className="mt-3 p-3 bg-slate-950 rounded border border-slate-700">
                  <pre className="text-xs text-emerald-400 overflow-x-auto code-font">
                    {opt.improvedCode}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ReviewDisplay;
