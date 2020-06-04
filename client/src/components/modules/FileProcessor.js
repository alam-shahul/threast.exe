import React, { useState, useEffect } from "react";

import "../../public/stylesheets/FileProcessor.css";
import default_media from "../../public/images/underConstruction.gif";

export function FileDisplay(props) {
  const type = props.type;
  if (!props.URL)
    return (<div>No media yet!</div>);
  else if (type == "image")
      return (<img src={props.URL}/>);
  else if (type == "video")
      return (
        <video src={props.URL} controls="controls" type="video/*"></video>
      );
  else if (type == "audio"){
      return (
        <audio src={props.URL} controls="controls" type="audio/*"></audio>
      );
  }
  else return null; 
}

export function FileProcessor(props) {
  const [URL, setURL] = useState(props.initialURL);

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
      <div className = "fileDisplayContainer">
        <FileDisplay type={props.type} URL={URL}/>
      </div>
    </>
  )
}
