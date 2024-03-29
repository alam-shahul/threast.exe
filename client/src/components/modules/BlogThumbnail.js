import React, { useState, useEffect } from "react";

import audio_thumbnail from "../../public/images/audio_wave.png";
import default_thumbnail from "../../public/images/underConstruction.gif";
const video_thumbnail = "https://firebasestorage.googleapis.com/v0/b/threast-website.appspot.com/o/image%2F1593875454910?alt=media&token=2702fb3d-0bae-479d-b54d-0f3ca665c2a4";

function BlogThumbnail(props) {

  function ThumbnailDisplay(props) {
    let type = props.type;
    if (!props.thumbnailURL)
      return (<img src={default_thumbnail} />);
    if (type == "image")
      return (<img src={props.thumbnailURL} />);
    else if (type == "video")
      return (<img src={video_thumbnail} />);
    else if (type == "audio")
      return (<img src={audio_thumbnail} />);
    else return null; 
  }

  return (
    <div className="blogpostFrame">
      <div className="blogpostFrameText">
        <div className="title">{props.blogpost.title}</div>
        { props.blogpost.tagline ?
          <div className="tagline">{props.blogpost.tagline}</div>
          :
          <></>
        }
        <div>by <span className="author">{props.blogpost.ownerName}</span></div>
      </div>
      <div className="blogpostImage">
        <ThumbnailDisplay type="image" thumbnailURL={props.blogpost.thumbnailURL}/>
      </div>
    </div>
  );
}

export default BlogThumbnail;
