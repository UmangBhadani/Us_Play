import React, { useEffect } from 'react';

export default function WordReveal({ room, socketId, onTimerComplete }) {
  // 1. Find the current player object and grab just the word string variable
  const playerObj = room.players.find(p => p.id === socketId);
  const secretWord = playerObj ? playerObj.word : "Loading...";

  // 3. Simple 3-second timeout to disappear and move to the next step
  useEffect(() => {
    const timer = setTimeout(() => {
      onTimerComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onTimerComplete]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-neutral-950 font-sans text-white select-none">
      
      {/* 2. Stylish Tailwind structure focused purely on displaying the word string */}
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 mb-2">
          Your Word
        </p>
        <h1 className="text-5xl font-black tracking-wide text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] md:text-7xl">
          {secretWord}
        </h1>
      </div>

    </div>
  );
}