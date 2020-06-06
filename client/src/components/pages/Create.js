import React, { useState, useEffect } from "react";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Redirect } from "react-router-dom";

import { firebase } from '@firebase/app';
import { auth, firestore, storage } from "../../firebaseClient";

import "../../utilities.css";
import "../../public/stylesheets/Create.css";

function Create(props) {
  const [title, setTitle] = useState("");
  const [redirect, setRedirect] = useState(null);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("image");
  const [visibility, setVisibility] = useState("threast");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!props.user) {
      setRedirect("/signin");
    }
  }, []);

  function updateTitle(e) {
    setTitle(e.target.value);
    setSaved(false);
    if (!e.target.value) {
      e.target.setCustomValidity("Please enter a title."); 
    } else {
      e.target.setCustomValidity("");
    }
  }

  function updateDescription(e) {
    setDescription(e.target.value);
    setSaved(false);
  }

  function updateType(e) {
    setType(e.target.value);
    setSaved(false);
  }

  function updateVisibility(e) {
    setVisibility(e.target.value);
    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(e.target.checkValidity());
    if (!e.target.checkValidity())
      return;

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    
    let data = {
      lastUpdated: timestamp,
      title: title,
      type: type,
      description: description,
      downloadURL: null,
      ownerName: props.user.displayName,
      ownerId: props.user.uid,
      profileId: props.user.profileId,
      visibility: visibility
    };

    firestore.collection("art").add(data)
      .then(artRef => {
        console.log("Art created. Redirecting...");
        setSaved(true);
        setRedirect(`/art?id=${artRef.id}`);
      });
    return;
  }

  function CreateStatus() {
    if (saved)
      return (<div className="dark-green">Artwork created successfully.</div>);
    else
      return null;
  }

  return (
    <>
      { redirect ?
        <Redirect to={redirect}/>
        : <></>
      }
      <div className="artworkCreator">
        <form className="creatorText" onSubmit={handleSubmit}>
          <div className="formField">
            <label>
              <div className="u-bold">Media Type</div>
              <select value={type} onChange={updateType}>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
              <div>
                <small className="">The type of media that your artwork will use.</small>
              </div>
            </label>
          </div>
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
              <input required className="" type="text" onChange={updateDescription} value={description}/>
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
          <button type="submit" className="">Create Art</button>
          <CreateStatus/>
        </form>
      </div>
    </>
  );
}

export default Create;
