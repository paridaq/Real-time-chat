import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

 
 
 function Room(){
    const[roomCode,setRoomCode] = useState<string>('')
    const [name,setName] = useState<string>('');
    const navigate = useNavigate();


const ws = new WebSocket('http://localhost:8080')
useEffect(()=>{
    ws.onopen = () => {
        console.log("WebSocket connection established");
    };

})

const createRoom = ()=>{
    
        
        if(ws.readyState===WebSocket.OPEN){
            ws.send(JSON.stringify({type:"create-room"}))
        }

    
    ws.onmessage=(event)=>{
      const data = JSON.parse(event.data)
      if(data.type==='room-created'){
        setRoomCode(data.roomCode)
        
      }
    }
    ws.onerror=(error)=>{
        console.log(error)
    }
    ws.onclose=()=>{
        console.log('websocket connection closed')
    }

}

const joinRoom=()=>{
    
        ws.send(JSON.stringify({type:"join-room",roomCode,name}))
        ws.onmessage=(event)=>{
            const data = JSON.parse(event.data);
            if(data.type ==="joined-room"){
                console.log('room joined succesfully')
                navigate('/chat')
                localStorage.setItem('room-code',data.roomCode)
                localStorage.setItem('user-name',data.name)
                
            }
        }
    
}



    return(
        <>
        <style>
            {
                `
                body {
                    background-color: white;
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                }

                .room-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    background-color: #f5f5f5;
                    padding: 20px;
                }

                .room-title {
                    font-size: 2rem;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #333;
                }

                .room-subtitle {
                    font-size: 1rem;
                    margin-bottom: 20px;
                    color: #666;
                }

                .create-room-button,
                .join-room-button {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    margin: 10px 0;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1rem;
                }

                .create-room-button:hover,
                .join-room-button:hover {
                    background-color: #0056b3;
                }

                .input-field {
                    width: 80%;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 1rem;
                }
                `
            }       </style>
        <div className="room-container">
              <h1 className="room-title">Real Time Chat</h1>
              <p className="room-subtitle">Temporary room that expires after all users exit</p>
              <button className="create-room-button" onClick={createRoom}>Create New Room</button>
                {roomCode && <p style={{color:"black"}}>{roomCode}</p>}
              <input className="input-field"
               type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e)=>setName(e.target.value)} />
              <input className="input-field"
               type="text"
                placeholder="Enter Room Code"
                value={roomCode}
                onChange={(e)=>setRoomCode(e.target.value)} />
              <button className="join-room-button" onClick={joinRoom}>Join Room</button>
         </div>   
               </>
    )
 }
 export default Room