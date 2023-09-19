import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';

import { firebase } from '@firebase/app';
import { auth, firestore, storage} from "../../firebaseClient";

import default_thumbnail from "../../public/images/underConstruction.gif";
import { FileDisplay, FileProcessor } from "./FileProcessor.js";
import CommentSection from "./CommentSection.js";
import ContributionInfo from "./ContributionInfo.js";
import MarkdownViewer from "./MarkdownViewer.js";

function BlogpostViewer(props) {
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    firestore
    .collection("profiles")
    .doc(props.blogpost.profileId)
    .onSnapshot(profileSnapshot => {
      const profile = profileSnapshot.data();
      if (profile) {
        setPhotoURL(profile.photoURL);
      }
    })
  }, [props.blogpost])

  return (
    <>
      <div className="blogpostViewer">
        <div className="blogHeader">
          <div className="title">{props.blogpost.title}</div>
          <div className="tagline">{props.blogpost.tagline}</div>
          <div className="author">
            <ContributionInfo ownerId={props.blogpost.profileId} contributionDate={props.blogpost.lastUpdated.toDate()} ownerName={props.blogpost.ownerName} photoURL={photoURL} format={"MMM DD, YYYY h:mm A"}/>
          </div>
          <FileDisplay type="image" URL={props.blogpost.thumbnailURL || default_thumbnail}/>
        </div>
        <div className="content">
          <MarkdownViewer content={props.blogpost.content} />
        </div>
        <div className="commentDivider"></div>
        <CommentSection user={props.user} parentId={props.id} subject={props.blogpost}/>
      </div>
    </>
  );
}

export default BlogpostViewer;
