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


wss.on("connection", (ws) => {
    console.log("✅ New client connected");

    ws.on("message", (message) => {
        console.log("📩 Received message:", message);
    });

    ws.on("close", () => {
        console.log("❌ Client disconnected");
    });
});




