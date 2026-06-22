

const activeRoom = {};

const roomCrud = {
    createRoom:(roomId,hostId)=>{
        activeRoom[roomId]={
            id: roomId,
            host: hostId,
            players: [],
            status: "LOBBY",
            gameData: null,
        }
    },
    getRoom: (roomId)=>{
    return activeRoom[roomId]
 },

    deleteRoom: (roomId)=>{
    delete activeRoom[roomId]
 },
 removePlayer: (socketId)=>{
    let roomId = null;
    for(let roomid in activeRoom){
        const room = activeRoom[roomid];
        const initialLength = room.players.length;
        const playerExists = room.players.some(player => player.id === socketId);
        if(playerExists){
            roomId = roomid;
            room.players = room.players.filter(player => player.id !== socketId);
        }
        if(room.players.length === 0){
            delete activeRoom[roomid];

        }
        else if(room.host === socketId){
            room.host = room.players[0].id;
        }
    }
    return roomId;
 },
 updateplayer:(socketId)=>{
    let roomId = null;
    for(let roomid in activeRoom){
        const room = activeRoom[roomid];
        const playerExists = room.players.some(player => player.id === socketId);
        if(playerExists){
            roomId = roomid;
            const Player = room.players.find(player => player.id === socketId);
            Player.isReady = !Player.isReady;
        }
    }
    return roomId;

 },
 getRoomBySocketId:(socketId) =>{
    let roomId = null;
    for(let roomid in activeRoom){
        const room = activeRoom[roomid];
        const playerExists = room.players.some(player => player.id === socketId);
        if(playerExists){
            roomId = roomid;
        }
    }
    return roomId;
 }
}


export default roomCrud;