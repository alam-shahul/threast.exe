import React, { useState, useEffect } from "react";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Redirect } from "react-router-dom";

import { firebase } from '@firebase/app';
import { auth, firestore, storage } from "../../firebaseClient";

import "../../utilities.css";

import { get, post } from "../../utilities";

function Create(props) {
  const [name, setName] = useState("");
  const [redirect, setRedirect] = useState(null);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("image");
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState(null);
 
  if (!user) { 
    get("/api/whoami").then((user) => {
      setUser(user);
    });
  }

  function updateName(e) {
    setName(e.target.value);
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

  function handleSubmit(e) {
    e.preventDefault();
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    
    let data = {
      lastUpdated: timestamp,
      title: name,
      type: type,
      description: description,
      downloadURL: null,
      ownerId: user.uid
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
        <div className="">
          <label className="">Title</label>
          <input required className="" type="text" onChange={updateName} value={name}/>
          <small className="">A title for your artwork.</small>
          <label className="">Art type</label>
          <select value={type} onChange={updateType}>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
          <label className="">Description</label>
          <input required className="" type="text" onChange={updateDescription} value={description}/>
          <small className="">A description for your artwork.</small>
          <button type="button" className="" onClick={handleSubmit}>Save Art</button>
          { saved ?
            <span className="dark-green">Art saved successfully.</span>
          :
            <span className="gold">The art has not been saved.</span>
          }
        </div>
      </form>
    </>
  );
}

export default Create;
