import React, { useState, useEffect } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { firebase } from '@firebase/app';
import "firebase/auth";
import "firebase/storage";

import "../../utilities.css";

import { get, post } from "../../utilities";

function Create(props) {
  get("/api/whoami").then((user) => {
    console.log(user);
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saved, setSaved] = useState(false);

  function updateName(e) {
    setName(e.target.value);
    setSaved(false);
  }

  function updateDescription(e) {
    setDescription(e.target.value);
    setSaved(false);
  }

  function handleSubmit(e) {
    return;
  }

  function updateImage(e) {
    // TODO: upload to server
    e.preventDefault();

    var storageRef = firebase.storage().ref();
    
    const target = e.target;
    if (target.files && target.files[0]) {
      //const reader = new FileReader();
      //reader.onload = (e) => {


      //}   
      //reader.readAsDataURL(target.files[0]);
      var file = target.files[0];

      var metadata = {
        contentType: 'image/jpeg'
      };

      const imageName = `images/${Date.now()}-test`;
      var uploadTask = storageRef.child(imageName).put(file, metadata);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        }, function(error) {
      
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
      
          case 'storage/canceled':
            // User canceled the upload
            break;
      
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, function() {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL);
        });
      });
    } 
    //post("/api/create", this.state).then(response => {
    //  if (response._id) {
    //    setSaved(true);
    //  }
    //});
    return;
  }

  return (
    <>
      <form className="pa4 black-80" onSubmit={handleSubmit}>
        <div className="measure">
          <label className="f6 b db mb2">Title</label>
          <input required className="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" onChange={updateName} value={name}/>
          <small className="f6 black-60 db mb2">A title for your artwork.</small>
          <label className="f6 b db mb2">Description</label>
          <input required className="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" onChange={updateDescription} value={description}/>
          <small className="f6 black-60 db mb2">A description for your artwork.</small>
          <input required type="file" accept="image/png, image/jpeg, image/gif" onChange={updateImage}/>
          <button type="button" className="f6 link br2 ph3 pv2 mb2 dib white bg-dark-green mr2" onClick={handleSubmit}>Save Deck</button>
          { saved ?
            <span className="dark-green">Deck saved successfully.</span>
          :
            <span className="gold">The deck has not been saved.</span>
          }
        </div>
      </form>
    </>
  );
}

export default Create;
