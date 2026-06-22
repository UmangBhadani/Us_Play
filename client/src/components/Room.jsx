import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "./socketIo";
import PlayerCard from "./PlayerCard";
import CategorySelector from "./ChooseCategory";
import VotingResult from "./VotingResult";

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  // 1. YOUR MASTER FRONTEND ARRAY LIVE TRACKER
  const [players, setPlayers] = useState([]);

  // Minimal game loop states (Kept so your layout doesn't look completely empty)
  const [word]  = useState("_ _ _ _ _ _");
  const [timer] = useState("0:00");
  const [round] = useState(1);
  const [roomStatus, setRoomStatus] = useState("LOBBY"); 
  const [votingEndsAt,setVotingEndsAt] = useState(null);
  const [winCat,setWinCat] = useState(null);

  
  // 2. WEBSOCKET STATE SYNCHRONIZATION
  useEffect(() => {
    socket.emit("joinRoom", {roomId, username: "Anonymous"});

    socket.on("room-updated", (updatedRoom) => {
      if (updatedRoom && updatedRoom.players) {
        // Overwrites the frontend array with the fresh master list from server
        setPlayers(updatedRoom.players);
        setRoomStatus(updatedRoom.status);
        setVotingEndsAt(updatedRoom.votingEndsAt);
        setWinCat(updatedRoom.winCat);
      }
    });

    return () => {
      socket.off("room-updated");
    };
  }, [roomId]);

  // HANDLERS
  const handleLeave = () => {
    socket.emit("leaveRoom");
    navigate("/");
  };

  const handleReady = () => {
    socket.emit("playerReady");
  };
  const myData = players.find(p => p.id === socket.id);
  const amIReady = myData?.isReady || false;


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] font-sans text-white">
      
      {/* Header Area */}
      <div className="text-center mb-8 text-[#e0e0e0]">
        <h1 className="text-2xl font-bold mb-2">Welcome to Room: {roomId}</h1>
        <p className="text-[#888888]">Share this ID with your friends!</p>
      </div>

      {/* Main Room Card Grid Structure */}
<div className="relative grid w-full max-w-5xl h-137.5 grid-cols-[260px_1fr_260px] bg-[#111111] border border-[#2a2a2a] rounded-[20px] py-7 px-9">        
        {/* Round Badge */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-[#2a2a2a] border-t-0 rounded-b-lg pt-0.75 pb-1.25 px-4.5 text-[10px] font-semibold tracking-[0.16em] uppercase text-[#444444]">
          Round {round}
        </div>

        {/* Top Control Bar */}
        <div className="col-span-full row-start-1 flex items-center justify-between gap-4">
          <div className="flex flex-1 items-center justify-center max-w-110 h-11 bg-[#0f0f0f] border border-[#2e2e2e] rounded-[10px] text-[15px] font-medium tracking-[0.30em] text-[#d4d4d4]">
            {word}
          </div>
          <button
            className="shrink-0 h-9.5 px-4.5 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-[11px] font-semibold tracking-[0.12em] uppercase text-[#888888] transition-colors duration-200 hover:border-[#c0392b] hover:text-[#c0392b] cursor-pointer"
            onClick={handleLeave}
          >
            Leave
          </button>
        </div>

        {/* ================================================================= */}
        {/* LEFT SIDE AREA (Col-Start-1, Row-Start-2)                        */}
        {/* ================================================================= */}
        <div className="col-start-1 row-start-2 flex flex-col gap-3 justify-center items-center border border-dashed border-[#222222] rounded-xl p-2">
          {/* 💡 YOUR WORKSPACE: Put your left side map loop here! */}
          {players.filter((_, index) => index % 2 === 0) .map((singlePlayer) => (
            <PlayerCard 
              key={singlePlayer.id} 
              player={singlePlayer} 
          />
  ))}
        </div>

        {/* CENTER TIMER CONTAINER */}
        {/* CENTER TIMER CONTAINER */}
<div className="col-start-2 row-start-2 flex flex-col items-center justify-center gap-7">
  {roomStatus === "LOBBY" && (
    <div className="flex flex-col items-center justify-center gap-1 w-27.5 h-27.5 rounded-[14px] bg-[#161616] border border-[#2e2e2e]">
      <span className="text-[30px] font-bold text-[#e0e0e0] tracking-[0.02em] leading-none">
        {timer}
      </span>
      <span className="text-[9px] font-medium tracking-[0.20em] uppercase text-[#3d3d3d]">
        sec
      </span>
    </div>
  )}
  {roomStatus === "Game" && (
    <CategorySelector
      players={players}
      votingEndsAt={votingEndsAt}
      onSelect={(chooseID) => {
        socket.emit("categoryChosen", { categoryId: chooseID });
      }}
    />
  )}
  {roomStatus === "VotingResult" && (
    <VotingResult winningCategory={winCat}/>
  )}
  {roomStatus === "Playing" &&}
</div>

        {/* ================================================================= */}
        {/* RIGHT SIDE AREA (Col-Start-3, Row-Start-2)                       */}
        {/* ================================================================= */}
        <div className="col-start-3 row-start-2 flex flex-col gap-3 justify-center items-center border border-dashed border-[#222222] rounded-xl p-2">
          {/* 💡 YOUR WORKSPACE: Put your right side map loop here! */}
          {players.filter((_, index) => index % 2 !== 0).map((singlePlayer) => (
            <PlayerCard 
              key={singlePlayer.id} 
              player={singlePlayer} 
            />
  ))}
        </div>

        {/* Bottom Action Footer */}
        <div className="col-span-full row-start-3 flex items-center justify-center">
          <button
            className={`h-10.5 px-13 bg-[#1a1a1a] border border-[#333333] rounded-[10px] text-[11px] font-semibold tracking-[0.16em] uppercase text-[#bbbbbb] transition-colors duration-200 hover:border-[#555555] hover:text-[#eeeeee] cursor-pointer ${roomStatus} === "GAME"
            ? "bg-[#222222] text-[#555555] border-[#333333] cursor-not-allowed"
            : "bg-[#1a1a1a] hover:border-[#555555] hover:text-[#eeeeee] cursor-pointer"`}
            onClick={handleReady}
            disabled={roomStatus === "GAME"}
            
          >
            {roomStatus === "Game" ? "Starting..." : (amIReady ? "Cancel" : "Ready")}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Room;