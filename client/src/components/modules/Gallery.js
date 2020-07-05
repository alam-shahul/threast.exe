import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StackGrid, { transitions } from "react-stack-grid";
const { scaleDown } = transitions;

import { firebase } from '@firebase/app';

import ArtThumbnail from "./ArtThumbnail.js";
import "../../public/stylesheets/Art.css";
import Loading from "./Loading.js";

function Gallery(props) {
  //const [mode, setMode] = useState(null);
  const pageSize = 16;

  const [nextAvailable, setNextAvailable] = useState(false);
 
  const [currentPage, setCurrentPage] = useState(0);
  const [gallery, setGallery] = useState(null);

  function populateNext() {
    fetchGallery("next").then((gallerySnapshot) => {
      if (gallerySnapshot.docs.length > 0) {
        setGallery(gallerySnapshot.docs);
        setCurrentPage(currentPage+1);

        let lastVisible = gallerySnapshot.docs[gallerySnapshot.docs.length - 1];
        isNextAvailable(lastVisible);
      }
    });
  }

  function populatePrevious() {
    fetchGallery("previous").then((gallerySnapshot) => {
      if (gallerySnapshot.docs.length > 0) {
        setGallery(gallerySnapshot.docs);
        setCurrentPage(currentPage-1);

        setNextAvailable(true);
      }
    });
  }

  function isNextAvailable(lastVisible) {
    if (!lastVisible)
      setNextAvailable(false);
    else { 
      props.startQuery
        .startAfter(lastVisible)
        .get().then((gallerySnapshot) => {
          let nextStatus = (gallerySnapshot.docs.length > 0);
          setNextAvailable(nextStatus);
        });
    }
  }

  function fetchGallery(type = "initial") {
    let query;
    if (type === "initial") {
      query = props.startQuery.limit(pageSize);
    }
    else if (type === "previous") {
      let firstVisible = gallery[0];
      query = props.startQuery
        .endBefore(firstVisible)
        .limitToLast(pageSize);
    }
    else if (type === "next") {
      let lastVisible = gallery[gallery.length-1];
      query = props.startQuery
        .startAfter(lastVisible)
        .limit(pageSize);
    }
    
    return query.get()
  }

  if(!gallery) {
    console.log(gallery);
    console.log(props.user);
  
    fetchGallery().then((gallerySnapshot) => {
      isNextAvailable(gallerySnapshot.docs[gallerySnapshot.docs.length - 1]);
      setGallery(gallerySnapshot.docs);
      setCurrentPage(0);
    });
  }

  console.log(gallery);

  return (
    <>
      <div className="artContainer">
        { gallery ?
          (
            <>
              <div className="galleryTitle">
                {props.title}
              </div>
              <div className="buttonContainer">
                { (currentPage != 0) ?
                  <span className="previousButton" onClick={e => populatePrevious()}>←</span>
                  :
                  <></>
                }
                { (nextAvailable) ?
                  <span className="nextButton" onClick={e => populateNext()}>→</span>
                  :
                  <></>
                }
              </div>
              { gallery.length > 0 ?
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
                    { gallery ?
                      gallery.map((artworkSnapshot) => {
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
          <Loading/>
        }
      </div>
    </>
  );
}

export default Gallery;
