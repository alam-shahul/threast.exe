import React, { useState, useEffect } from "react";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Redirect } from "react-router-dom";

import { firebase } from '@firebase/app';
import { auth, firestore, storage } from "../../firebaseClient";

import "../../utilities.css";

import { get, post } from "../../utilities";

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
      ownerId: props.user.uid,
      profileId: props.user.profileId,
      visibility: visibility
    };

    firestore.collection("art").add(data)
      .then(artRef => {
        console.log("Art created. Redirecting...");
        setRedirect(`/art?id=${artRef.id}`);
      });
    return;
  }

  return (
    <>
      { redirect ?
        <Redirect to={redirect}/>
        : <></>
      }
      <form className="" onSubmit={handleSubmit}>
          <label className="">Title</label>
          <input required className="" type="text" onChange={updateTitle} value={title}/>
          <small className="">A title for your artwork.</small>
          <label className="">Art type</label>
          <select value={type} onChange={updateType}>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
          <label className="">Description</label>
          <input className="" type="text" onChange={updateDescription} value={description}/>
          <small className="">A description for your artwork.</small>
          <label className="">Visibility</label>
          <select value={visibility} onChange={updateVisibility}>
            <option value="public">Public</option>
            <option value="threast">Threast-Only</option>
          </select>
          <button type="submit" className="">Create Art</button>
          { saved ?
            <span className="dark-green">Art saved successfully.</span>
          :
            <span className="gold">The art has not been saved.</span>
          }
      </form>
    </>
  );
}

export default Create;
