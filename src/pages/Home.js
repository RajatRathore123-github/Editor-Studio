import React, { useState } from 'react'
import {v4 as uuidV4} from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success("Created a new Room");
    };
    const joinRoom = () => {
        if(!roomId || !username){
            toast.error("RoomId and username is required");
            return;
        }

        //Redirect to Editor pane
        navigate(`/editor/${roomId}`,{
            state: {
                username,
            }
        });
    }

    const handleEnter = (e) => {
        if(e.code === "Enter"){
            joinRoom();
        }
    }
  return (
    <>
    <div className="home-section">
        <div className="form-section">
            <img className="logo-img" src="/editor-img.png" alt="code-editor-logo" />
            <h4 className='editor-info'>
                Paste invitation ROOM ID
            </h4>
            <div className="editor-input">
                <input type="text" className='room-id' placeholder='ROOM ID' value={roomId} onChange={(e)=> setRoomId(e.target.value)} onKeyUp={handleEnter}/>
                <input type="text" className='room-id' placeholder='USERNAME' value={username} onChange={(e)=> setUsername(e.target.value)} onKeyUp={handleEnter}/>
                <button className='btn join-btn' onClick={joinRoom} >Join</button>
                <span className='create-info'>
                    If you don't have an invite then create &nbsp;
                    <a onClick={createNewRoom} href="/" className='create-new'>New Room</a>
                </span>
            </div>
        </div>
        <h4 className='footer'>Built with ❤️ by <a href="https://github.com/RajatRathore123-github" target="blank" alt="Me"><span className='Me'>Rajat Rathore</span></a></h4>
    </div>
    </>
  )
}
