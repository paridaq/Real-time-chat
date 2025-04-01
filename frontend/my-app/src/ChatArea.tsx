import { useEffect, useRef, useState } from "react";



interface Message {
    text: string;
    name: string;
    };




function ChatArea() {
   const ws = useRef<WebSocket | null>(null)
    const roomCode = localStorage.getItem('room-code')

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const username = localStorage.getItem('user-name') // Define the sender's name

    
    useEffect(() => {
        // Initialize WebSocket connection
        if (ws.current) return;
        ws.current = new WebSocket("ws://localhost:8080");
        console.log(ws.current)

        ws.current.onopen = () => {
            console.log("WebSocket connection is ready");
            console.log(username)

            // Request previous messages for the room
            ws.current?.send(
                JSON.stringify({
                    type: "room-messages",
                    roomCode,
                })
            );
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data); // Parse the incoming data
            console.log("Message received:", data);

            if (data.type === "found-messages") {
                // Populate chat history when the user joins the room
                setMessages(() => [...data.message]); 
                console.log(data.message)
            } else if (data.type === "message") {
                // Update the messages state with the new message
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: data.text, name: data.name },
                ]);
            }
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.current.onclose = () => {
            console.log("WebSocket connection closed");
        };

        // Cleanup WebSocket connection on component unmount
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [roomCode]); 
    
    const handleSend = () => {
       
         if(ws.current && ws.current.readyState===WebSocket.OPEN){
            const msgData ={
                type:'message',
                username,
                roomCode,
                text:input
                
            }
            ws.current.send(JSON.stringify(msgData))
              setMessages((prevMessage) => [...prevMessage, { text: input, name: username || "Unknown" }]);
                setInput("")      
         }else{
            console.error("Websocket is not open")
         }



        // if (input.trim()) {
        //     setMessages([...messages, { text: input, sender: "user" }]);
        //     setInput("");
        // }
    };

    return (
        
        <div style={{ width: "100%", height: "80vh", backgroundColor: "black", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <h3>Let's chart</h3>
            <p >Room Code:{roomCode}</p>
            
            <div style={{ flex: 1, overflowY: "auto", padding: "10px", backgroundColor: "black", color: "white" }}>
            {messages.map((message, index) => (
                <div
                key={index}
                style={{
                    textAlign: message.name === username ? "right" : "left",
                    margin: "10px 0",
                }}
                >
                <span
                    style={{
                    display: "inline-block",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: message.name === username ? "white" : "gray",
                    color: message.name === username ? "black" : "white",
                    }}
                >
                    {message.text}
                </span>
                </div>
            ))}
            </div>
            <div style={{ display: "flex", padding: "10px", backgroundColor: "black" }}>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                style={{
                flex: 1,
                padding: "10px",
                border: "1px solid white",
                borderRadius: "5px",
                marginRight: "10px",
                backgroundColor: "black",
                color: "white",
                }}
            />
            <button
                onClick={handleSend}
                style={{
                padding: "10px 20px",
                backgroundColor: "white",
                color: "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                }}
            >
                Send
            </button>
            </div>
        </div>
    );
}


export default ChatArea;


