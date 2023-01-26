import React, { useEffect, useRef } from 'react'
import CodeMirror from "codemirror"
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css"
import ACTIONS from "../Actions"

export default function Editor({socketRef,roomId,onCodeChange}) {

    const editorRef = useRef(null);
    useEffect(() => {
        const init = async () => {
            editorRef.current = CodeMirror.fromTextArea(document.getElementById("editor-code"),{
                mode: {name : "javascript", json: true},
                theme: "dracula",
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            })
            editorRef.current.on("change", (instance, changes) => {
              console.log("changes",changes);
              const { origin } = changes;
              const code = instance.getValue();
              onCodeChange(code);
              if(origin !== "setValue"){
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                  roomId,
                  code,
                })
              }
            })
        }
        init();
    },[]);

    useEffect(() => {
      if(socketRef.current){
        socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) => {
          if(code !== null){
            editorRef.current.setValue(code);
          }
        })
      }

      return () =>
      {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    },[socketRef.current])
  return (

    <textarea id="editor-code"></textarea>

  )
}
