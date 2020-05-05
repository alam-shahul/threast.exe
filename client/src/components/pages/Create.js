import React, { useState, useEffect } from "react";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Redirect } from "react-router-dom";

import { firebase } from '@firebase/app';
import { auth, firestore, storage } from "../../firebaseClient";

import "../../utilities.css";

import { get, post } from "../../utilities";

function Create(props) {
  get("/api/whoami").then((user) => {
    console.log(user);
  });

  const [name, setName] = useState("");
  const [redirect, setRedirect] = useState(null);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("image");
  const [saved, setSaved] = useState(false);

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
      downloadURL: null
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
      <form className="pa4 black-80" onSubmit={handleSubmit}>
        <div className="measure">
          <label className="f6 b db mb2">Title</label>
          <input required className="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" onChange={updateName} value={name}/>
          <small className="f6 black-60 db mb2">A title for your artwork.</small>
          <label className="f6 b db mb2">Art type</label>
          <select value={type} onChange={updateType}>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
          <label className="f6 b db mb2">Description</label>
          <input required className="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" onChange={updateDescription} value={description}/>
          <small className="f6 black-60 db mb2">A description for your artwork.</small>
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
