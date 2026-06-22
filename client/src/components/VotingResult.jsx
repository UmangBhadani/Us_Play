import React from "react";

const categories = {
  food:   { label: "Food",               icon: "🍜", color: "#fb923c" },
  city:   { label: "City / Building",    icon: "🏙️", color: "#60a5fa" },
  career: { label: "Profession / Career", icon: "💼", color: "#a78bfa" },
  nature: { label: "Animal / Nature",     icon: "🌿", color: "#34d399" },
  random: { label: "Random",              icon: "🎲", color: "#fbbf24" },
  other:  { label: "Other",               icon: "✦",  color: "#f472b6" },
};

export default function VotingResult({ winningCategory }) {
  const result = categories[winningCategory] || { label: "Random", icon: "🎲", color: "#fbbf24" };

  return (
    <div className="w-full max-w-xl rounded-2xl p-8 flex flex-col items-center justify-center text-center" 
         style={{ background: "#16161d", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "DM Sans, sans-serif" }}>
      
      <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
        Voting Closed!
      </p>
      
      <h2 className="text-xl font-bold mb-6 text-white">The Winning Category is...</h2>

      {/* Winning Category Badge */}
      <div className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl mb-8 transition-all duration-300 animate-bounce"
           style={{ background: `${result.color}15`, border: `2px solid ${result.color}`, boxShadow: `0 0 25px ${result.color}25` }}>
        <span className="text-5xl">{result.icon}</span>
        <span className="text-2xl font-bold text-white">{result.label}</span>
      </div>

      {/* Loading bar for smooth transition transition */}
      <div className="flex items-center gap-2 text-xs text-[#888888]">
        <div className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
        <span>Preparing secrets, game starting shortly...</span>
      </div>
    </div>
  );
}