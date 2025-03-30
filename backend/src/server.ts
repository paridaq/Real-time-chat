import express from 'express'
import {Request,Response} from 'express'
import WebSocket ,{WebSocketServer} from "ws"
import http from 'http'


const app =express();

const port =8080;




const server = app.listen(port,()=>{
    console.log('server created successfully')
})


const wss = new WebSocketServer({server});
const rooms = new Map();

wss.on('connection',(ws)=>{
    ws.on('message',(message)=>{
        const data = JSON.parse(message.toString());

        if(data.type === 'createRoom'){
            const roomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
            rooms.set(roomCode,{
                clients:new Set(),
                messages:[{sender:"system",text:"Room created Succesfully"}]
            });
            //JSON.stringify convert java script object into json 
            //as we can not send 
            ws.send(JSON.stringify({type:'roomcreated',roomCode}))
        }

        if (data.type === 'joinRoom') {
            const { roomCode, username } = data;

            if (rooms.has(roomCode)) {
                const room = rooms.get(roomCode);

                if (room.clients.size < 6) {
                    room.clients.add({ username, ws });

                    ws.send(JSON.stringify({ 
                        type: 'roomJoined', 
                        roomCode, 
                        messages: room.messages // Send chat history to new user
                    }));

                    // Notify all users in the room about the new user
                    for (const client of room.clients) {
                        if (client.ws.readyState === WebSocket.OPEN) {
                            client.ws.send(JSON.stringify({
                                type: 'userJoined',
                                sender: "System",
                                text: `${username} joined the room`,
                                users: [...room.clients].map(u => u.username) // Updated user list
                            }));
                        }
                    }
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'Room is full' }));
                }
            } else {
                ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
            }
        }
        if(data.type==='message'){
            const {roomCode,sender,text} = data;
            if(rooms.has(roomCode)){
                const room = rooms.get(roomCode)
                const msgdata = {sender,text}
                room.messages.push(msgdata)
                for(const client of room.clients){
                    if(client.ws.readyState==WebSocket.OPEN){
                        client.ws.send(JSON.stringify({
                            type:'message',
                            ...msgdata
                        }))
                    }
                }
            }
        }

        //handle room deetion case
        ws.on('close', () => {
            for (const [roomCode, room] of rooms) {
                const userToRemove = [...room.clients].find(client => client.ws === ws);
                if (userToRemove) {
                    room.clients.delete(userToRemove);
    
                    // Notify remaining users that someone left
                    for (const client of room.clients) {
                        if (client.ws.readyState === WebSocket.OPEN) {
                            client.ws.send(JSON.stringify({
                                type: 'userLeft',
                                sender: "System",
                                text: `${userToRemove.username} has left the room`,
                                users: [...room.clients].map(u => u.username)
                            }));
                        }
                    }
    
                    if (room.clients.size === 0) rooms.delete(roomCode);
                    break;
                }
            }

    })
})


})
