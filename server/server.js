import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server,Socket } from 'socket.io';
import {nanoid} from 'nanoid';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import wordSchema from './models/wordSchema.js';
import roomCrud from './roomFunctions.js';
import { getRandomWord } from './wordFetch.js';

dotenv.config();


const app = express();
app.use(cors());


const server = http.createServer(app);

mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("Mongo DB connected")})
.catch((err)=>{console.log("failed DB",err);
})


const io = new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST"]
  }
});

io.on('connection', (socket) => {
  socket.on("createRoom",({username})=>{
    const roomId = nanoid(6);
    roomCrud.createRoom(roomId,socket.id);
    socket.join(roomId);
    roomCrud.getRoom(roomId).players.push({id:socket.id,username:username,isReady:false});
    socket.emit("roomCreated",roomId); 
  })

  socket.on("joinRoom",({roomId, username})=>{
    const room = roomCrud.getRoom(roomId);
     if(room){
      const isAlreadyInRoom = room.players.some(player => player.id === socket.id);
      if (!isAlreadyInRoom) {
      room.players.push({ id: socket.id, username: username, isReady: false });
     }
    socket.join(roomId);
    socket.emit("roomJoined");
    io.to(roomId).emit("room-updated",roomCrud.getRoom(roomId));}
  
  else{
    socket.emit("error","Room not found")}

  });
  socket.on("leaveRoom",()=>{
    const affectedRoomId = roomCrud.removePlayer(socket.id);
    socket.leave(affectedRoomId);
    io.to(affectedRoomId).emit("room-updated",roomCrud.getRoom(affectedRoomId));
    socket.to(affectedRoomId).emit("playerLeft",socket.id);
  })
  socket.on("playerReady",()=>{
    const affectedRoomId = roomCrud.updateplayer(socket.id);
    const room = roomCrud.getRoom(affectedRoomId);
    const allReady = room.players.every(player => player.isReady);
    if(allReady){
      room.status = "Game"
      room.votingEndsAt = Date.now() + (10*1000);
      io.to(affectedRoomId).emit("room-updated",room);

      setTimeout(async ()=>{
        const liveRoom = roomCrud.getRoom(affectedRoomId);
        if(!liveRoom || liveRoom.status !== "Game") return;

        const voteCount = {};
        liveRoom.players.forEach(player => {
          if(player.votedCategory){
            voteCount[player.votedCategory] = (voteCount[player.votedCategory] || 0) + 1;
          }
        })
        let winner = "random";
        let maxVotes = 0;
        
        for(const cat in voteCount){
          if(voteCount[cat]>maxVotes){
            maxVotes = voteCount[cat]
            winner = cat
          }
        }
        let wordData = null;
        try{
          wordData = await getRandomWord(winner)
        }
        catch(err){
          console.error("Failed to fetch words from data base" , err)
        }

        const imposterIndex = Math.floor(Math.random() * liveRoom.players.length);

        liveRoom.players.forEach((player , index) => {
          if(index === imposterIndex){
            player.role = "Imposter"
            player.word = wordData.imposterWord
          }
          else{
            player.role = "Villager"
            player.word = wordData.villagerWord
          }
        })

        liveRoom.currentHint = wordData.hint

        liveRoom.status = "VotingResult";
        liveRoom.winCat = winner;
        io.to(affectedRoomId).emit("room-updated",liveRoom);

        setTimeout(()=>{
          const finalRoom = roomCrud.getRoom(affectedRoomId);
          if(!finalRoom || finalRoom.status !== "VotingResult") return;
          finalRoom.status = "Playing";
          io.to(affectedRoomId).emit("room-updated",finalRoom)
        },5000)

      },10 * 1000);
    }
    else{
        io.to(affectedRoomId).emit("room-updated",roomCrud.getRoom(affectedRoomId));

    }
  });
  socket.on("categoryChosen",({categoryId}) =>{
    const affectedRoom = roomCrud.getRoomBySocketId(socket.id)
    const room = roomCrud.getRoom(affectedRoom)
    if(!room || room.status !== "Game")
      return
    const player = room.players.find(p => p.id === socket.id);
    if(player && !player.votedCategory){
      player.votedCategory = categoryId;
    }

    io.to(affectedRoom).emit("room-updated",room)
  })
  socket.on('disconnect', () => {
  const affectedRoomId = roomCrud.removePlayer(socket.id)
  io.to(affectedRoomId).emit("room-updated",roomCrud.getRoom(affectedRoomId));
 });
  
});







server.listen(3000, () => {
  console.log('listening on *:3000');
});

