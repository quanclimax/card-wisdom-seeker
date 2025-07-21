import React from "react";
import ReactMarkdown from "react-markdown";

interface TarotModalProps {
  open: boolean;
  loading: boolean;
  cards: { name: string; image?: string }[];
  aiResult?: string;
  onClose: () => void;
}

const TarotModal: React.FC<TarotModalProps> = ({ open, loading, cards, aiResult, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative bg-gradient-to-br from-[#1a1333] to-[#2d1e4f] rounded-2xl shadow-2xl border border-primary/40 p-6 w-full max-w-6xl h-[90vh] max-h-[800px] animate-fade-in overflow-hidden">
        {/* Close button */}
        {!loading && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-primary-foreground bg-primary/80 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:scale-110 transition z-10"
            aria-label="Đóng"
          >
            ✕
          </button>
        )}
        
        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-8 animate-pulse">
            <div className="relative flex items-center justify-center mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary/60 to-accent/60 blur-xl animate-glow" />
              <svg className="absolute w-28 h-28 animate-spin-slow text-primary/80" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="60 40" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-primary-foreground text-center drop-shadow-glow animate-flicker max-w-md">
              Hãy tập trung năng lượng<br />
              và suy nghĩ về câu hỏi của bạn
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Cards Section */}
            <div className="flex-shrink-0 mb-6">
              <h3 className="text-2xl font-bold text-primary-foreground text-center mb-6">
                Các Lá Bài Đã Rút
              </h3>
              <div className="flex justify-center gap-6 flex-wrap">
                {cards.map((card, idx) => (
                  <div
                    key={card.name}
                    className="flex flex-col items-center gap-3 animate-float"
                    style={{ animationDelay: `${idx * 0.2}s` }}
                  >
                    <div className="w-32 h-48 rounded-xl bg-background/80 shadow-xl border-2 border-primary/40 overflow-hidden">
                      {card.image ? (
                        <img 
                          src={card.image} 
                          alt={card.name} 
                          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-sm text-primary-foreground text-center p-4">{card.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-primary-foreground text-sm mb-1">{card.name}</h4>
                      <p className="text-xs text-primary-foreground/70">Lá bài {idx + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Result Section */}
            {aiResult && (
              <div className="flex-1 overflow-hidden">
                <h3 className="text-2xl font-bold text-primary-foreground mb-4">
                  Lời Giải Nghĩa từ AI
                </h3>
                <div className="bg-muted/40 rounded-xl p-6 h-full overflow-y-auto text-foreground text-base leading-relaxed animate-fade-in border border-primary/20 prose prose-invert max-w-none">
                  <ReactMarkdown>{aiResult}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Animations CSS */}
      <style>{`
        @keyframes glow {
          0%, 100% { filter: blur(16px) brightness(1.1); }
          50% { filter: blur(24px) brightness(1.5); }
        }
        .animate-glow { animation: glow 2s infinite alternate; }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          45% { opacity: 0.7; }
          55% { opacity: 0.9; }
          60% { opacity: 0.5; }
          65% { opacity: 1; }
        }
        .animate-flicker { animation: flicker 2.5s infinite; }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 4s linear infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px) scale(1.04); }
        }
        .animate-float { animation: float 2.2s ease-in-out infinite; }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(.4,0,.2,1); }
        .drop-shadow-glow { filter: drop-shadow(0 0 8px #a78bfa); }
      `}</style>
    </div>
  );
};

export default TarotModal; 