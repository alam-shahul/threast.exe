import React, { useState, useEffect } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Link } from "react-router-dom";

import { firebase } from '@firebase/app';
import "firebase/auth";

import { auth, firestore } from "../../firebaseClient";
import "../../utilities.css";
import "../../public/stylesheets/Account.css";
import { deleteMediaByURL, uploadToFirestore } from "../../utilities";
import { FileProcessor } from "./FileProcessor.js";

function ProfileEditor(props) {
  const [blurb, setBlurb] = useState(props.profile.blurb);
  const [file, setFile] = useState(null);
  const [photoURL, setPhotoURL] = useState(props.profile.photoURL);
  const [dataStatus, setDataStatus] = useState(null);

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
   
    const newProfile = Object.assign({}, props.profile, {blurb: e.target.value})
    props.updateParent(newProfile);
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
        const filepath = `profilePhotos/${Date.now()}`;
        let uploadTask = uploadToFirestore(filepath, file, props.uid);
        
        uploadTask.then(function(snapshot) {
          snapshot.ref.getDownloadURL().then(function(downloadURL) {
            setPhotoURL(downloadURL);
            const newProfile = Object.assign({}, props.profile, {photoURL: downloadURL})
            props.updateParent(newProfile);
            if (props.profile.photoURL)
              deleteMediaByURL(photoURL);
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
  
  function ProfileStatus() {
    if (dataStatus === "saved")
      return (<div className="dark-green"> Profile saved successfully.</div>);
    else if (dataStatus === "unsaved")
      return (<div className="dark-green"> There are unsaved changes to your profile.</div>);
    else
      return null;
  }

  return (
    <>
      <div className="profileEditor">
        <form className="profileText" onSubmit={handleSubmit}>
          <div className="formField">
            <label>
              <div className="u-bold">Blurb</div>
              <input required className="" type="text" onChange={updateBlurb} value={blurb}/>
              <div>
                <small className="">A description for yourself.</small>
              </div>
            </label>
          </div>
          <div className="formField">
            <div className="u-bold">Profile Picture</div>
            <FileProcessor type="image" initialURL={photoURL} updateFile={updateFile}/>
          </div>
          <button type="button" className="" onClick={handleSubmit}>Save Profile</button>
          <ProfileStatus/>
        </form>
      </div>
    </>
  )
}

export default ProfileEditor;
