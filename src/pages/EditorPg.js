import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { Navigate, useLocation,useNavigate,useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';


export default function EditorPg() {
 
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const [clients, setClients] = useState([]);

  useEffect(()=> {
    const init = async () => {
      socketRef.current = await initSocket();

      // Handling errors
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      const handleErrors = (e) => {
        console.log("socket error",e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({clients, username, socketId}) => {
        if(username !== location.state?.username){
          toast.success(`${username} joined successfully`);
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE,{
          code: codeRef.current,
          socketId
        } );
      } )

      //Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId,username}) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId)
        })
      })
    };
    init();

    // cleaning function

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    }

  },[]);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("RoomId has been copied");
    } catch (error) {
      toast.error("Not able to copy");
    }
  }

  const leaveRoom = () => {
    reactNavigator("/");
  }
  


  if(!location.state){
    return <Navigate to="/"/>;
  }

  return (
    <div className="editor-content">
      <div className="left-content">
        <div className="left-info">
          <div className="logo">
            <img className="logo-img" src="/editor-img.png" alt="logo" />
          </div>
          <h3 className='status'>Connected</h3>
          <div className="connection-list">
            {
              clients.map((connect) => (
                <Client key={connect.socketId} username={connect.username}/>
              ))
            }
          </div>
        </div>
        <button className='btn copy-btn' onClick={copyRoomId}>Copy Room ID</button>
        <button className='btn leave-btn' onClick={leaveRoom}>Leave</button>
      </div>
      <div className="right-content">
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => {codeRef.current = code}}/>
      </div>
    </div>
  )
}
