import React, { useState, useEffect } from "react";

import "../../public/stylesheets/FileProcessor.css";

export function FileDisplay(props) {
  const type = props.type;
  if (!props.URL)
    return (
      <div className = "fileDisplayContainer">
        <div>No media yet!</div>
      </div>
    )
  else if (type == "image") {
      return (
        <div className = "fileDisplayContainer">
          <img src={props.URL}/>
        </div>
      );
  }
  else if (type == "video")
      return (
        <div className = "fileDisplayContainer">
          <video src={props.URL} controls="controls" type="video/*"></video>
        </div>
      );
  else if (type == "audio"){
      return (
        <div className = "fileDisplayContainer">
          <audio src={props.URL} controls="controls" type="audio/*"></audio>
        </div>
      );
  }
  else return null; 
}

export function FileProcessor(props) {
  const [URL, setURL] = useState(props.initialURL);

  useEffect(() => {
    setURL(props.initialURL);
  }, [props.initialURL])

  function FileUpload(props) {
    const type = props.type;
    if (type == "image")
        return (<input type="file" accept="image/png, image/jpeg, image/gif, image/svg+xml" onChange={(e) =>  props.updateFile(e, setURL)}/>);
    else if (type == "video")
        return (<input type="file" accept="video/*" onChange={(e) =>  props.updateFile(e, setURL)}/>);
    else if (type == "audio")
        return (<input type="file" accept="audio/*" onChange={(e) =>  props.updateFile(e, setURL)}/>);
    else return null; 
  }

  return (
    <>
      <FileUpload type={props.type} updateFile={props.updateFile}/>
      <FileDisplay type={props.type} URL={URL}/>
    </>
  )
}
