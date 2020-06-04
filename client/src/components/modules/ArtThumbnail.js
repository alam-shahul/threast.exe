import React, { useState, useEffect } from "react";

import audio_thumbnail from "../../public/images/audio_wave.png";
import default_thumbnail from "../../public/images/underConstruction.gif";
import "../../public/stylesheets/Art.css";
const video_thumbnail = "https://firebasestorage.googleapis.com/v0/b/threast-website.appspot.com/o/image%2F1589497383829?alt=media&token=4ceb9720-ff80-4d77-8cef-78e2186e7bb6";

function ArtThumbnail(props) {

  function ThumbnailDisplay(props) {
    let type = props.type;
    if (!props.downloadURL)
      return (<img src={default_thumbnail} />);
    if (type == "image")
      return (<img src={props.downloadURL} />);
    else if (type == "video")
      return (<img src={video_thumbnail} />);
    else if (type == "audio")
      return (<img src={audio_thumbnail} />);
    else return null; 
  }

  return (
    <div className="polaroidFrame">
      <div className="polaroidImage">
        <ThumbnailDisplay type={props.artwork.type} downloadURL={props.artwork.downloadURL}/>
      </div>
      <div className="title">{props.artwork.title}</div>
      <div className="description">{props.artwork.description}</div>
    </div>
  );
}

export default ArtThumbnail;
