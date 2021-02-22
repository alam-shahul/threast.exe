import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';

import { firebase } from '@firebase/app';
import { auth, firestore, storage} from "../../firebaseClient";

import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import Tex from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';
import math from 'remark-math';

import default_thumbnail from "../../public/images/underConstruction.gif";
import { FileDisplay, FileProcessor } from "./FileProcessor.js";
import CommentSection from "./CommentSection.js";
import ContributionInfo from "./ContributionInfo.js";

function BlogpostViewer(props) {
  const [photoURL, setPhotoURL] = useState("");
 
  useEffect(() => {
    firestore
    .collection("profiles")
    .doc(props.blogpost.profileId)
    .onSnapshot(profileSnapshot => {
      const profile = profileSnapshot.data();
      if (profile) {
        console.log(profile);
        setPhotoURL(profile.photoURL);
      }
    })
  }, [props.blogpost])

  function renderParagraph(props) {
    const { children } = props;
  
    if (children && children[0]
      && children.length === 1
      && children[0].props
      && children[0].props.src) { // rendering media without p wrapper
  
      return children;
    }
  
    return <p>{children}</p>;
  }

  function renderImage(props) {
    return (
      <div style={{textAlign: "center"}}>
        <img {...props} style={{maxWidth: '100%'}} />
      </div>
    )
  }

  return (
    <>
      <div className="blogpostViewer">
        <div className="blogHeader">
          <div className="title">{props.blogpost.title}</div>
          <div className="tagline">{props.blogpost.tagline}</div>
          <div className="author">
            <ContributionInfo ownerId={props.blogpost.profileId} contributionTime={props.blogpost.lastUpdated} ownerName={props.blogpost.ownerName} photoURL={photoURL} format={"MMM DD, YYYY"}/>
          </div>
          <FileDisplay type="image" URL={props.blogpost.thumbnailURL || default_thumbnail}/>
        </div>
        <div className="content">
          <ReactMarkdown
            plugins={[gfm, math]}
            children={props.blogpost.content}
            renderers={{
              paragraph: renderParagraph,
              image: renderImage,
              inlineMath: ({value}) => <Tex math={value} />,
              math: ({value}) => <Tex block math={value} />
            }}
            skipHtml={false}
            escapeHtml={true}
          />
        </div>
        <div className="commentDivider"></div>
        <CommentSection user={props.user} parentId={props.id} subject={props.blogpost}/>
      </div>
    </>
  );
}

export default BlogpostViewer;
