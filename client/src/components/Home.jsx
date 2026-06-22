import { useState, useRef } from "react";
import socket from "./socketIo";
import {useNavigate} from "react-router-dom";



export default function Home() {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState("anonymous");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("anonymous");
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [roomId, setRoomId] = useState("");
  const inputRef = useRef(null);

  const handleNameClick = () => {
    setEditingName(true);
    setNameInput(username);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commitName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) setUsername(trimmed);
    setEditingName(false);
  };

  const handleNameKey = (e) => {
    if (e.key === "Enter") commitName();
    if (e.key === "Escape") setEditingName(false);
  };

  const handleJoinOk = () => {
    const trimmed = roomId.trim();
    if (!trimmed) return;
    socket.emit("joinRoom", {roomId: trimmed, username: username});
    socket.on("roomJoined",()=>{
      navigate(`/room/${trimmed}`);
    })
    
    socket.on("error",(message)=>{
      alert(message);
    })
    alert(`Joining room: ${trimmed}`);
    setJoiningRoom(false);
    setRoomId("");
  };

  const handleCreateRoom = () => {
    socket.emit("createRoom",{username:username}); 
  };
  socket.on("roomCreated",(roomId)=>{
    alert(`Room created with ID: ${roomId}`);
    navigate(`/room/${roomId}`);
  })

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center font-mono">
      <div className="flex flex-col items-center gap-10 w-full max-w-xs px-4">

        {/* Avatar + Username */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 text-xl tracking-widest select-none">
            {initials}
          </div>

          {editingName ? (
            <input
              ref={inputRef}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={commitName}
              onKeyDown={handleNameKey}
              maxLength={24}
              className="bg-transparent border-b border-neutral-500 text-neutral-200 text-sm text-center outline-none w-40 pb-0.5 caret-neutral-400"
            />
          ) : (
            <button
              onClick={handleNameClick}
              className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-150 border-b border-transparent hover:border-neutral-600"
            >
              {username}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleCreateRoom}
            className="w-full py-2.5 bg-neutral-200 text-neutral-900 text-sm tracking-widest uppercase hover:bg-white transition-colors duration-150"
          >
            Create Room
          </button>

          <button
            onClick={() => setJoiningRoom((v) => !v)}
            className="w-full py-2.5 bg-transparent border border-neutral-700 text-neutral-400 text-sm tracking-widest uppercase hover:border-neutral-500 hover:text-neutral-300 transition-colors duration-150"
          >
            Join Room
          </button>
        </div>

        {/* Join Room Input */}
        {joiningRoom && (
          <div className="flex w-full gap-2">
            <input
              autoFocus
              value={roomId}
              onChange={(e) => {
                const val = e.target.value;
                if(val === "" || /^[a-zA-Z0-9-]+$/.test(val)){
                  setRoomId(val)
                } 
              }}
              onKeyDown={(e) => e.key === "Enter" && handleJoinOk()}
              maxLength={6}
              placeholder="room id"
              className="flex-1 bg-neutral-900 border border-neutral-700 text-neutral-300 text-sm px-3 py-2 outline-none placeholder-neutral-600 focus:border-neutral-500 transition-colors duration-150"
            />
            <button
              onClick={handleJoinOk}
              className="px-4 py-2 bg-neutral-800 text-neutral-300 text-sm hover:bg-neutral-700 hover:text-neutral-100 border border-neutral-700 transition-colors duration-150"
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
}