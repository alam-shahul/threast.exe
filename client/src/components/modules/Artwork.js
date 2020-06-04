import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { firebase } from '@firebase/app';
import { auth, firestore, storage} from "../../firebaseClient";

import "../../utilities.css";
import { deleteMediaByURL, uploadToFirestore } from "../../utilities";
import "../../public/stylesheets/Art.css";
import { FileDisplay, FileProcessor } from "./FileProcessor.js";

function Artwork(props) {
  const [redirect, setRedirect] = useState(null);
  const [title, setTitle] = useState(props.artwork.title);
  const [description, setDescription] = useState(props.artwork.description);
  const [file, setFile] = useState(null);
  const [downloadURL, setDownloadURL] = useState(props.artwork.downloadURL);
  const [visibility, setVisibility] = useState(props.artwork.visibility);

  // The dataStatus state has five possible values: "saved", "unsaved", "saving", "deleting" and "deleted"
  const [dataStatus, setDataStatus] = useState("saved");

  const isOwner = (props.user && props.artwork.ownerId === props.user.uid); 


  // This effect is necessary to sync the state change with the upload
  // (although it isn't done perfectly)
  useEffect(() => {
    if (dataStatus == "saving") {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      saveArtwork(timestamp);
    }
  }, [dataStatus]);

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
      if (file != null) {
        const filepath = `${props.artwork.type}/${Date.now()}`;
        let uploadTask = uploadToFirestore(filepath, file, props.artwork.ownerId);
        
        uploadTask.then(function(snapshot) {
          snapshot.ref.getDownloadURL().then(function(newDownloadURL) {
            if (downloadURL)
              deleteMediaByURL(downloadURL);

            setDownloadURL(newDownloadURL);
            console.log('File available at', newDownloadURL);
            setDataStatus("saving");
          });
        });
      }
      else {
        setDataStatus("saving");
      }
    }
  }

  function saveArtwork(timestamp) {
    const artName = `${props.id}`;
    let artRef = firestore.collection("art").doc(artName);
    let data = {
      lastUpdated: timestamp,
      title: title,
      type: props.artwork.type,
      description: description,
      downloadURL: downloadURL,
      ownerId: props.artwork.ownerId,
      profileId: props.artwork.profileId,
      visibility: visibility
    };
    let art = artRef.set(data)
      .then(artSnapshot => {
        console.log("Art saved.");
        setDataStatus("saved");
      });
  }

  function deleteArtwork() {
    if (!props.id)
      return;

    const artName = `${props.id}`;
    let artRef = firestore.collection("art").doc(artName);
   
    if (downloadURL)
      deleteMediaByURL(downloadURL);
 
    // Delete the file
    artRef.delete().then(function() {
      // File deleted successfully
      console.log("Artwork deleted!");
    }).catch(function(error) {
      // Uh-oh, an error occurred!
      console.log(error);
    }); 
  } 

  return (
    <>
      <Link to="/art">Back To Art</Link>
      <div className="">
        { isOwner ?
            (
              <>
                <form className="" onSubmit={handleSubmit}>
                  <label className="">Title</label>
                  <input required="required" className="" type="text" onChange={updateTitle} value={title}/>
                  <small className="">A title for your artwork.</small>
                  <label className="">Description</label>
                  <input className="" type="text" onChange={updateDescription} value={description}/>
                  <small className="">A description for your artwork.</small>
                  <label className="">Visibility</label>
                  <select value={visibility} onChange={updateVisibility}>
                    <option value="public">Public</option>
                    <option value="threast">Threast-Only</option>
                  </select>
                  <FileProcessor type={props.artwork.type} initialURL={downloadURL} updateFile={updateFile}/>
                  <button type="submit" className="">Save Art</button>
                  <button type="button" className="" onClick={deleteArtwork}>Delete Art</button>
                  { dataStatus == "saved" ?
                    <span className="dark-green">Artwork saved successfully.</span>
                  :
                    <span className="gold">The artwork has not been saved.</span>
                  }
                </form>
              </>
            ) :
            (
              <>
                <label className="">Title</label>
                <div>{title}</div>
                <label className="">Description</label>
                <div>{description}</div>
                <label className="">Posted by</label>
                <Link to={"/people?id=" + props.artwork.profileId}>
                  <div>{props.artwork.ownerId}</div>
                </Link>
                <div className = "fileDisplayContainer">
                  <FileDisplay type={props.artwork.type} URL={props.artwork.downloadURL}/>
                </div>
              </>
            )
        }
      </div>
    </>
  );
}

export default Artwork;
