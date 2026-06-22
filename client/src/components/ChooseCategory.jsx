import { useState, useEffect } from "react";

const categories = [
  { id: "food",    label: "Food",               icon: "🍜", color: "#fb923c" },
  { id: "city",    label: "City / Building",    icon: "🏙️", color: "#60a5fa" },
  { id: "career",  label: "Profession / Career", icon: "💼", color: "#a78bfa" },
  { id: "nature",  label: "Animal / Nature",     icon: "🌿", color: "#34d399" },
  { id: "random",  label: "Random",              icon: "🎲", color: "#fbbf24" },
  { id: "other",   label: "Other",               icon: "✦",  color: "#f472b6" },
];

// 🛠️ FIX 1: Explicitly destructure votingEndsAt from the props here so the useEffect can see it
export default function CategorySelector({ players = [], votingEndsAt, onSelect }) {
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    const targetTime = votingEndsAt || (Date.now() + 10 * 1000);

    const calculateTimeLeft = () => {
      const diff = targetTime - Date.now();
      const seconds = Math.max(0, Math.round(diff / 1000));
      setTimeLeft(seconds);

      if (seconds <= 0) {
        // 🛠️ FIX 2: Fixed typo from timerIneterval to timerInterval so it cleans up properly
        clearInterval(timerInterval);
      }
    };

    calculateTimeLeft();
    const timerInterval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timerInterval);
  }, [votingEndsAt]);

  const handleClick = (id) => {
    // 🛠️ FIX 3: Lock inputs if a category is selected OR if the clock hits zero
    if (selected !== null || timeLeft <= 0) return;
    setSelected(id);
    onSelect?.(id);

  };

  return (
    <div className="w-full h-full p-2 flex flex-col justify-center items-center" style={{ fontFamily: "DM Sans, system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      <div className="w-full max-w-xl rounded-2xl p-5" style={{ background: "#16161d", border: "1px solid rgba(255,255,255,0.08)" }}>
        
        {/* 🛠️ FIX 4: Merged your separate broken flex header layer into a single clean element */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>
            Pick a Category
          </p>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all duration-300"
               style={{ 
                 background: timeLeft <= 3 ? "rgba(239, 68, 68, 0.1)" : "rgba(255, 255, 255, 0.03)",
                 border: `1px solid ${timeLeft <= 3 ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.08)"}`,
                 color: timeLeft <= 3 ? "#ef4444" : "#a3a3a3"
               }}>
            <span>⏱️</span>
            <span>{timeLeft > 0 ? `${timeLeft}s` : "Voting Closed"}</span>  
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categories.map(({ id, label, icon, color }) => {
            // 🛠️ FIX 5: Automatically dim/disable cards if time hits 0
            const isSelected = selected === id;
            const isLocked   = selected !== null || timeLeft <= 0;
            const isDimmed   = isLocked && !isSelected;

            const votersForThisCategory = players.filter(p => p.votedCategory === id);

            return (
              <button
                key={id}
                onClick={() => handleClick(id)}
                disabled={isLocked && !isSelected}
                className="flex flex-col items-start gap-2 px-4 py-3.5 rounded-xl text-left transition-transform duration-150 active:scale-95 w-full"
                style={{
                  background: isSelected ? `${color}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isSelected ? color : "rgba(255,255,255,0.1)"}`,
                  boxShadow: isSelected ? `0 0 18px ${color}33` : "none",
                  opacity: isDimmed ? 0.25 : 1,
                  cursor: isLocked ? "default" : "pointer",
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="text-xl leading-none select-none">{icon}</span>

                  <span
                    className="text-sm font-medium flex-1"
                    style={{ color: isSelected ? "#ffffff" : "rgba(255,255,255,0.55)" }}
                  >
                    {label}
                  </span>

                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-200"
                    style={{
                      background: isSelected ? color : "transparent",
                      color: "#0f0f13",
                      opacity: isSelected ? 1 : 0,
                      transform: isSelected ? "scale(1)" : "scale(0.4)",
                    }}
                  >
                    ✓
                  </span>
                </div>

                {votersForThisCategory.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5 w-full">
                    {votersForThisCategory.map(p => (
                      <span 
                        key={p.id} 
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md border"
                        style={{ background: `${color}10`, borderColor: `${color}30`, color: color }}
                      >
                        {p.username}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p
          className="mt-4 text-xs transition-opacity duration-300"
          style={{
            color: "rgba(255,255,255,0.3)",
            opacity: selected ? 1 : 0,
            minHeight: "16px",
          }}
        >
          Selected — {categories.find((c) => c.id === selected)?.label}
        </p>

      </div>
    </div>
  );
}