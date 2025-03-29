import { useState } from "react";


interface Message {
    text: string;
    sender: "user" | "other";
}



function ChatArea() {

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    
    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, sender: "user" }]);
            setInput("");
        }
    };

    return (
        
        <div style={{ width: "100%", height: "80vh", backgroundColor: "black", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <h3>Let's chart</h3>
            
            <div style={{ flex: 1, overflowY: "auto", padding: "10px", backgroundColor: "black", color: "white" }}>
            {messages.map((message, index) => (
                <div
                key={index}
                style={{
                    textAlign: message.sender === "user" ? "right" : "left",
                    margin: "10px 0",
                }}
                >
                <span
                    style={{
                    display: "inline-block",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: message.sender === "user" ? "white" : "gray",
                    color: message.sender === "user" ? "black" : "white",
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


