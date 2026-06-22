import React from 'react';

// 'player' is a single object, e.g., { id: "123", username: "Umang" }
const PlayerCard = ({ player }) => {
  
  // 1. Get the username string out of the object
  const username = player?.username || "Anonymous";

  // 2. Cut the string to get the first 2 letters for the avatar circle
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-6 w-full max-w-md p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl shadow-lg">
      
      {/* Circle Text Avatar */}
      <div className="flex items-center justify-center shrink-0 w-16 h-16 border border-[#4a4a4a] rounded-full text-zinc-300 font-medium text-lg tracking-wide uppercase">
        {initials}
      </div>

      {/* Username Display */}
      <div className="flex flex-col min-w-0">
        <span className="text-zinc-300 font-medium text-base truncate">
          {username}
        </span>
      </div>

    </div>
  );
};

export default PlayerCard;