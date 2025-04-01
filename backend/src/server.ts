import express from 'express'
import {Request,Response} from 'express'
import WebSocket ,{WebSocketServer} from "ws"
import http from 'http'
import { json } from 'stream/consumers';


const app =express();

const port =8080;




const server = app.listen(port,()=>{
    console.log('server created successfully')
})


const wss = new WebSocketServer({server});
const rooms = new Map();

wss.on('connection',(ws)=>{
    console.log('websocket connection established')
    console.log(`New client connected. Total clients: ${wss.clients.size}`);
    ws.on('message',(message)=>{
        const data = JSON.parse(message.toString());

        if(data.type === 'create-room'){
            try{
            const roomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
            rooms.set(roomCode,{
                clients:new Set(),
                messages:[{name:"system",text:"Room created Succesfully"}]
            });
            //JSON.stringify convert java script object into json 
            //as we can not send 
            ws.send(JSON.stringify({type:'room-created',roomCode}))
            console.log(rooms)
        }catch(error){
            console.log(error)
            ws.send(JSON.stringify({type:'eror',message:'failed to create the code'}))
        }
        }

        if (data.type === 'join-room') {
            const { roomCode, name } = data;

            if (rooms.has(roomCode)) {
                const room = rooms.get(roomCode);

                if (room.clients.size < 6) {
                    room.clients.add({ name, ws });
                    console.log(room)

                    ws.send(JSON.stringify({ 
                        type: 'joined-room', 
                        roomCode, 
                        name,
                    message: room.messages // Send chat history to new user
                    }));
                    console.log(room.messages)

                    // Notify all users in the room about the new user
                    for (const client of room.clients) {
                        if (client.ws.readyState === WebSocket.OPEN) {
                            client.ws.send(JSON.stringify({
                                roomCode,
                                name,
                                type: 'userJoined',
                                sender: "System",
                                text: `${name} joined the room`,
                                users: [...room.clients].map(u => u.name) // Updated user list
                            }));
                        }
                    }
                    console.log(rooms)
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'Room is full' }));
                }
            } else {
                ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
            }
        }
        //check if the room exist and retun all the messages inside the rooom
        if(data.type==='room-messages'){
            const {roomCode} = data;
            if(rooms.has(roomCode)){
                const room = rooms.get(roomCode)
                ws.send(JSON.stringify({
                  type:'found-messages',
                  message:room.messages
                }))
                console.log(room.messages)
            }
        }

        // this
        if(data.type==='message'){
            const {roomCode,username,text} = data;
            if(rooms.has(roomCode)){
                const room = rooms.get(roomCode)
                const msgdata = {name:username,text}
                room.messages.push(msgdata)
                ws.send(JSON.stringify({...msgdata}))


                /*
                for(const client of room.clients){
                    console.log(`Client WebSocket state: ${client.ws.readyState}`);
                    if(client.ws.readyState==WebSocket.OPEN){
                        client.ws.send(JSON.stringify({
                            type:'message-re',
                            ...msgdata
                        }))
                    }
                }
                    */
            }
        }
    })
  // ws close calls when user disconect from the server
        //handle room deetion case
  // Handle Disconnection
 // thi block auomatically calls when user disconnects
  ws.on('close', () => {
    for (const [roomCode, room] of rooms) {
        //find the user whose websocket connection is closed
        const userToRemove = [...room.clients].find(client => client.ws === ws);
        if (userToRemove) {
            room.clients.delete(userToRemove);

            // Notify remaining users that someone left and find the user who left
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
});



})



