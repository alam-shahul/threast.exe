import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';

import { firebase } from '@firebase/app';
import { auth, firestore, storage} from "../../firebaseClient";

import "../../utilities.css";
import { deleteMediaByURL, uploadToFirestore } from "../../utilities";
import "../../public/stylesheets/Art.css";
import { FileDisplay, FileProcessor } from "./FileProcessor.js";
import ArtThumbnail from "./ArtThumbnail.js";
import LinkButton from "./LinkButton.js";

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
  var mockArtwork = {
    title: title,
    description: description,
    type: props.artwork.type,
    downloadURL: downloadURL
  }

  // This effect is necessary to sync the state change with the upload
  // (although it isn't done perfectly)
  useEffect(() => {
    if (dataStatus == "saving") {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      saveArtwork(timestamp);
    }
  }, [dataStatus]);

  function updateFile(e, updateDisplayURL) {
    const target = e.target;

    if (target.files && target.files[0]) {
      var file = target.files[0];
      
      const reader = new FileReader();
      reader.onload = (e) => {
        updateDisplayURL(e.target.result);
        mockArtwork = {
          title: title,
          description: description,
          type: props.artwork.type,
          downloadURL: e.target.result
        }
        console.log(mockArtwork);
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
      ownerName: props.artwork.ownerName,
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
    setDataStatus("deleting");
    artRef.delete().then(function() {
      // File deleted successfully
      console.log("Artwork deleted!");
      setDataStatus("deleted");
      setRedirect("/account");
    }).catch(function(error) {
      // Uh-oh, an error occurred!
      console.log(error);
    }); 
  } 

  function ArtworkStatus() {
    if (dataStatus == "saved")
      return (<div className="dark-green">Artwork saved successfully.</div>);
    else if (dataStatus == "saved")
      return (<div className="dark-green">Artwork is being saved...</div>);
    else if (dataStatus == "deleting")
      return (<div>Artwork is being deleted...</div>)
    else if (dataStatus == "deleted")
      return (<div>Artwork has been deleted.</div>)
    else
      return (<div className="gold">The artwork has not been saved.</div>);
  }

  return (
    <>
      <div className="artworkContainer">
        { isOwner ?
            (
              <>
                <form className="artworkEditor" onSubmit={handleSubmit}>
                  <div className="formField">
                    <label>
                      <div className="u-bold">Title</div> 
                      <input required="required" className="" type="text" onChange={updateTitle} value={title}/>
                      <div>
                        <small className="">A title for your artwork.</small>
                      </div>
                    </label>
                  </div>
                  <div className="formField">
                    <label>
                      <div className="u-bold">Description</div>
                      <TextareaAutosize required className="" onChange={updateDescription} value={description}/>
                      <div>
                        <small className="">A description for your artwork.</small>
                      </div>
                    </label>
                  </div>
                  <div className="formField">
                    <label>
                      <div className="u-bold">Visibility</div>
                      <select value={visibility} onChange={updateVisibility}>
                        <option value="public">Public</option>
                        <option value="threast">Threast-Only</option>
                      </select>
                      <div>
                        <small className="">Choose who can view your artwork.</small>
                      </div>
                    </label>
                  </div>
                  <div className="formField">
                    <div className="u-bold">Media</div>
                    <FileProcessor type={props.artwork.type} initialURL={downloadURL} updateFile={updateFile}/>
                  </div>
                  <div className="buttonContainer">
                    <button type="submit" className="">Save Art</button>
                    <button type="button" className="" onClick={deleteArtwork}>Delete Art</button>
                    <ArtworkStatus/>
                  </div>
                  { redirect ?
                    <Redirect to={redirect}/>
                    :
                    <></>
                  }
                </form>
                <div className="editorPreview">
                  <div className="u-bold">Thumbnail Preview</div>
                  <ArtThumbnail artwork={mockArtwork}/>
                </div>
              </>
            ) :
            (
              <>
                <div className="artworkText">
                  <div className="title">{title}</div>
                  <div className="description">{description}</div>
                  <div className="author">
                    <span>Posted by </span>
                    <Link to={"/people?id=" + props.artwork.profileId}>
                      {props.artwork.ownerName}
                    </Link>
                  </div>
                </div>
                <FileDisplay type={props.artwork.type} URL={props.artwork.downloadURL}/>
              </>
            )
        }
      </div>
    </>
  );
}

export default Artwork;