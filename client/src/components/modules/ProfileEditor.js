import React, { useState, useEffect } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Link } from "react-router-dom";

import { firebase } from '@firebase/app';
import "firebase/auth";

import { auth, firestore } from "../../firebaseClient";
import "../../utilities.css";
import { deleteMediaByURL, uploadToFirestore } from "../../utilities";
import { FileProcessor } from "./FileProcessor.js";

function ProfileEditor(props) {
  const [blurb, setBlurb] = useState(props.profile.blurb);
  const [file, setFile] = useState(null);
  const [photoURL, setPhotoURL] = useState(props.profile.photoURL);
  const [dataStatus, setDataStatus] = useState("saved");

  // This effect is necessary to sync the state change with the upload
  // (although it isn't done perfectly)
  useEffect(() => {
    if (dataStatus == "saving") {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      saveProfile(timestamp);
    }
  }, [dataStatus]);

  function updateBlurb(e) {
    setBlurb(e.target.value);
    setDataStatus("unsaved");
  }

  function updateFile(e, updateDisplayURL) {
    const target = e.target;

    if (target.files && target.files[0]) {
      var file = target.files[0];
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (photoURL)
          deleteMediaByURL(photoURL);
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
        const filepath = `profilePhotos/${Date.now()}`;
        let uploadTask = uploadToFirestore(filepath, file, props.uid);
        
        uploadTask.then(function(snapshot) {
          snapshot.ref.getDownloadURL().then(function(downloadURL) {
            setPhotoURL(downloadURL);
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

  function saveProfile(timestamp) {
    let profileRef = firestore.collection("profiles").doc(props.profileId);
    let data = {
      blurb: blurb,
      photoURL: photoURL,
    };
    let profile = profileRef.update(data)
      .then(profileSnapshot => {
        console.log("Profile saved.");
        setDataStatus("saved");
      });
  } 

  return (
    <>
      <form className="" onSubmit={handleSubmit}>
        <div className="">
          <label className="">Blurb</label>
          <input required className="" type="text" onChange={updateBlurb} value={blurb}/>
          <small className="">A description for yourself.</small>
          <FileProcessor type="image" initialURL={photoURL} updateFile={updateFile}/>
          <button type="button" className="" onClick={handleSubmit}>Save Profile</button>
          { dataStatus == "saved" ?
            <span className="dark-green">Profile saved successfully.</span>
          :
            <span className="gold">The profile has not been saved.</span>
          }
        </div>
      </form>
    </>
  )
}

export default ProfileEditor;
