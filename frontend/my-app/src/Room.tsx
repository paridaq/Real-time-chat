 
 
 function Room(){
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
              <button className="create-room-button">Create New Room</button>
              <input className="input-field" type="text" placeholder="Enter your name" />
              <input className="input-field" type="text" placeholder="Enter Room Code" />
              <button className="join-room-button">Join Room</button>
         </div>   
               </>
    )
 }
 export default Room