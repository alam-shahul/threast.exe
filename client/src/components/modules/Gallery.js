import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StackGrid, { transitions } from "react-stack-grid";
const { scaleDown } = transitions;

import { firebase } from '@firebase/app';

import ArtThumbnail from "./ArtThumbnail.js";
import "../../public/stylesheets/Art.css";


function Gallery(props) {
  //const [mode, setMode] = useState(null);
  return (
    <>
      <div className="artContainer">
        { props.gallery ?
          (
            <>
              <div className="galleryTitle">
                {props.title}
              </div>
              { props.gallery.length > 0 ?
                ( 
                  <StackGrid
                    appear={scaleDown.appear}
                    appearDelay={50}
                    appeared={scaleDown.appeared}
                    enter={scaleDown.enter}
                    entered={scaleDown.entered}
                    leaved={scaleDown.leaved}
                    monitorImagesLoaded={true}
                    horizontal={false}
                    columnWidth={300}
                    gutterWidth={15}
                    gutterHeight={15}
                    className="gallery"
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
                )
                :
                <div>No artworks!</div>
              }
            </>
          )
          :
          <div>Loading...</div>
        }
      </div>
    </>
  );
}

export default Gallery;
