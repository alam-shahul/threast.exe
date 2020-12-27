import React, { useState, useEffect } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Link } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';

import { firebase } from '@firebase/app';
import "firebase/auth";

import { auth, firestore } from "../../firebaseClient";
import "../../utilities.css";
import "../../public/stylesheets/Account.css";
import { deleteMediaByURL, uploadToFirestore } from "../../utilities";
import { FileProcessor } from "./FileProcessor.js";

function BlogpostEditor(props) {
  const [content, setContent] = useState(props.blogpost.content);
  const [file, setFile] = useState(null);
  const [thumbnailURL, setThumbnailURL] = useState(props.blogpost.thumbnailURL);
  const [dataStatus, setDataStatus] = useState(null);

  // This effect is necessary to sync the state change with the upload
  // (although it isn't done perfectly)
  useEffect(() => {
    if (dataStatus == "saving") {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      saveProfile(timestamp);
    }
  }, [dataStatus]);

  function updateContent(e) {
    setContent(e.target.value);
   
    const newBlog = Object.assign({}, props.blogpost, {content: e.target.value})
    props.updateParent(newBlog);
    setDataStatus("unsaved");
  }

  function updateTitle(e) {
    if (!e.target.value) {
      e.target.setCustomValidity("Please enter a title."); 
    } else {
      e.target.setCustomValidity("");
    }

    setTitle(e.target.value);
    setDataStatus("unsaved");
  }

  function updateDescription(e) {
    setDescription(e.target.value);
    setDataStatus("unsaved");
  }

  function updateVisibility(e) {
    setVisibility(e.target.value);
    setDataStatus("unsaved");
  }

  function updateFile(e, updateDisplayURL) {
    const target = e.target;

    if (target.files && target.files[0]) {
      var file = target.files[0];
      
      const reader = new FileReader();
      reader.onload = (e) => {
        updateDisplayURL(e.target.result);
      }   
      reader.readAsDataURL(file);
      
      setFile(file);
      setDataStatus("unsaved");
    } 
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (dataStatus == "unsaved") {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      if (file != null) {
        const filepath = `blogThumbnails/${props.uid}/${Date.now()}`;
        let uploadTask = uploadToFirestore(filepath, file, props.uid);
        
        uploadTask.then(function(snapshot) {
          snapshot.ref.getDownloadURL().then(function(downloadURL) {
            setThumbnailURL(downloadURL);
            const newBlog = Object.assign({}, props.blogpost, {thumbnailURL: downloadURL})
            props.updateParent(newBlog);
            if (props.blogpost.thumbnailURL)
              deleteMediaByURL(thumbnailURL);
            console.log('File available at', downloadURL);
            setDataStatus("saving");
          });
        });
      }
      else {
        setDataStatus("saving");
      }
    }
  }

  function saveBlogpost(timestamp) {
    let blogpostRef = firestore.collection("blogs").doc(props.blogpostId);
    let data = {
      content: blurb,
      thumbnailURL: photoURL,
    };
    let blogpost = blogpostRef.update(data)
      .then(blogpostSnapshot => {
        console.log("Blog saved.");
        setDataStatus("saved");
      });
  } 
  
  function BlogpostStatus() {
    if (dataStatus === "saved")
      return (<div className="dark-green"> Blogpost saved successfully.</div>);
    else if (dataStatus === "unsaved")
      return (<div className="dark-green"> There are unsaved changes to your blogpost.</div>);
    else
      return null;
  }

  return (
    <>
      <form className="profileEditor" onSubmit={handleSubmit}>
        <div className="formField">
          <label>
            <div className="u-bold">Blurb</div>
            <TextareaAutosize required className="" onChange={updateBlurb} value={blurb}/>
            <div>
              <small className="">A description for yourself.</small>
            </div>
          </label>
        </div>
        <div className="formField">
          <div className="u-bold">Profile Picture</div>
          <FileProcessor type="image" initialURL={props.profile.photoURL} updateFile={updateFile}/>
        </div>
        <button type="button" className="" onClick={handleSubmit}>Save Profile</button>
        <ProfileStatus/>
      </form>
    </>
  )
}

export default BlogpostEditor;