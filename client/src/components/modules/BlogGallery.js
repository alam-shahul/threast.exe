import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StackGrid, { transitions } from "react-stack-grid";
const { scaleDown } = transitions;

import { firebase } from '@firebase/app';

import BlogThumbnail from "./BlogThumbnail.js";
import Loading from "./Loading.js";

function BlogGallery(props) {
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
    fetchGallery().then((gallerySnapshot) => {
      console.log(gallerySnapshot.docs)
      isNextAvailable(gallerySnapshot.docs[gallerySnapshot.docs.length - 1]);
      setGallery(gallerySnapshot.docs);
      setCurrentPage(0);
    });
  }

  return (
    <>
      <div className="blogContainer">
        { gallery ?
          (
            <>
              <div className="galleryTitle">
                {props.title}
              </div>
              { nextAvailable ?
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
                :
                <></>
              }
              { gallery.length > 0 ?
                ( 
                  <div className="gallery">
                    { gallery ?
                      gallery.map((blogpostSnapshot) => {
                        const blogpost = blogpostSnapshot.data();
                        return <Link
                                 style={{textDecoration: 'none'}}
                                 key={blogpostSnapshot.id}
                                 to={"/blog?id=" + blogpostSnapshot.id}  
                               >
                                 <BlogThumbnail
                                    key={blogpostSnapshot.id}
                                    blogpost={blogpost}
                                 />
                               </Link>
                        })
                      :
                      <></>
                    }
                  </div>
                )
                :
                <div>No blogposts!</div>
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

export default BlogGallery;
