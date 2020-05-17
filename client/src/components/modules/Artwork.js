import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { firebase } from '@firebase/app';
import { auth, firestore, storage } from "../../firebaseClient";

import "../../utilities.css";
import "../../public/stylesheets/Art.css";

function Artwork(props) {
  const [title, setTitle] = useState(props.artwork.title);
  const [description, setDescription] = useState(props.artwork.description);
  const [type, setType] = useState(props.artwork.type);
  const [ownerId, setOwnerId] = useState(props.artwork.ownerId);
  const [file, setFile] = useState(null);
  const [downloadURL, setDownloadURL] = useState(props.artwork.downloadURL);
  const [saved, setSaved] = useState(true);

  const isOwner = (ownerId === props.userId); 

  function updateTitle(e) {
    setTitle(e.target.value);
    setSaved(false);
  }

  function updateDescription(e) {
    setDescription(e.target.value);
    setSaved(false);
  }

  function updateType(e) {
    setType(e.target.value);
    setSaved(false);
  }

  function updateFile(e) {
    const target = e.target;

    if (target.files && target.files[0]) {
      var file = target.files[0];
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setDownloadURL(e.target.result);
      }   
      reader.readAsDataURL(file);
      
      setFile(file);
      setSaved(false);
    } 
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!saved) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      if (file != null) {
        const filepath = `${type}/${Date.now()}`;
        let uploadTask = uploadToFirestore(filepath, file);
        
        uploadTask.then(function(snapshot) {
          snapshot.ref.getDownloadURL().then(function(downloadURL) {
            setDownloadURL(downloadURL);
            console.log('File available at', downloadURL);
            saveArtwork(timestamp);
          });
        });
      }
      else {
        saveArtwork(timestamp);
      }
    }
  }

  function saveArtwork(timestamp) {
    const artName = `${props.id}`;
    let artRef = firestore.collection("art").doc(artName);
    let data = {
      lastUpdated: timestamp,
      title: title,
      type: type,
      description: description,
      downloadURL: downloadURL,
      ownerId: ownerId
    };
    let art = artRef.set(data)
      .then(artSnapshot => {
        console.log("Art saved.");
        setSaved(true);
      });
  } 
 
  function uploadToFirestore(filepath, file) {
    var metadata = {
      contentType: file.type,
    };

    var storageRef = storage.ref();
    var fileRef = storageRef.child(filepath);
    var uploadTask = fileRef.put(file, metadata);
      
    function displayProgress(snapshot) {
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
    }

    function handleErrors(error) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          // TODO: Let's display an error message here!
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }
    
    var setUploadCallbacks = uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED); // or 'state_changed'

    setUploadCallbacks({
      "next": displayProgress,
      "error": handleErrors
    });

    return uploadTask;
  }

  function FileUpload(props) {
    const type = props.type;
    if (type == "image")
        return (<input required type="file" accept="image/png, image/jpeg, image/gif, image/svg+xml" onChange={updateFile}/>);
    else if (type == "video")
        return (<input required type="file" accept="video/*" onChange={updateFile}/>);
    else if (type == "audio")
        return (<input required type="file" accept="audio/*" onChange={updateFile}/>);
    else return null; 
  }

  function FileDisplay(props) {
    const type = props.type;
    if (type == "image")
        return (<img src={downloadURL}/>);
    else if (type == "video")
        return (
          <video controls="controls" type="video/*">
            <source src={downloadURL}/>
          </video>
        );
    else if (type == "audio")
        return (
          <audio controls="controls" type="audio/*">
            <source src={downloadURL}/>
          </audio>
        );
    else return null; 
  }

  return (
    <>
      <Link to="/art">Back To Art</Link>
      <form className="" onSubmit={handleSubmit}>
        <div className="">
          { isOwner ?
              (
                <>
                  <label className="">Title</label>
                  <input required className="" type="text" onChange={updateTitle} value={title}/>
                  <small className="">A title for your artwork.</small>
                  <label className="">Description</label>
                  <input required className="" type="text" onChange={updateDescription} value={description}/>
                  <small className="">A description for your artwork.</small>
                  <FileUpload type={type}/>
                  <div className = "fileDisplayContainer">
                    <FileDisplay type={type}/>
                  </div>
                  <button type="button" className="" onClick={handleSubmit}>Save Art</button>
                  { saved ?
                    <span className="dark-green">Artwork saved successfully.</span>
                  :
                    <span className="gold">The artwork has not been saved.</span>
                  }
                </>
              ) :
              (
                <>
                  <label className="">Title</label>
                  <div>{title}</div>
                  <label className="">Description</label>
                  <div>{description}</div>
                  <label className="">Owner ID</label>
                  <div>{ownerId}</div>
                  <div className = "fileDisplayContainer">
                    <FileDisplay type={type}/>
                  </div>
                </>
              )
          }
        </div>
      </form>
    </>
  );
}

export default Artwork;
