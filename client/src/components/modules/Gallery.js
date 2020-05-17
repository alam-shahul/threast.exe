import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StackGrid, { transitions } from "react-stack-grid";
const { scaleDown } = transitions;

import { firebase } from '@firebase/app';

import "../../public/stylesheets/Art.css";
import audio_thumbnail from "../../public/images/audio_wave.png";

function ArtThumbnail(props) {
  const defaultSrc = "https://firebasestorage.googleapis.com/v0/b/threast-website.appspot.com/o/image%2F1589497383829?alt=media&token=4ceb9720-ff80-4d77-8cef-78e2186e7bb6";

  function ThumbnailDisplay(props) {
    let type = props.type;
    if (type == "image")
      return (<img src={props.downloadURL} />);
    else if (type == "video")
      return (<img src={defaultSrc} />);
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

function Gallery(props) {
  //const [mode, setMode] = useState(null);
  return (
    <>
      <StackGrid
        appear={scaleDown.appear}
        appeared={scaleDown.appeared}
        enter={scaleDown.enter}
        entered={scaleDown.entered}
        leaved={scaleDown.leaved}
        monitorImagesLoaded={true}
        horizontal={false}
        columnWidth={300}
        gutterWidth={15}
        gutterHeight={15}
      >
        {props.gallery ?
          props.gallery.map((artworkSnapshot) => {
            const artwork = artworkSnapshot.data();
            return <Link
                     style={{textDecoration: 'none'}}
                     key={artworkSnapshot.id}
                     to={"/art?id=" + artworkSnapshot.id}  
                   >
                     <ArtThumbnail
                        key={artworkSnapshot.id}
                        artwork={artwork}
                     />
                   </Link>
            })
          :
          <></>
        }
      </StackGrid>
    </>
  );
}

export default Gallery;
