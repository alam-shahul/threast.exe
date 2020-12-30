import React, { useState, useEffect } from "react";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Redirect } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';

import { firebase } from '@firebase/app';
import { auth, firestore, storage } from "../../firebaseClient";

import "../../utilities.css";
import "../../public/stylesheets/Create.css";

function Create(props) {
  const [title, setTitle] = useState("");
  const [redirect, setRedirect] = useState(null);
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("blogpost");
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

  function updateTagline(e) {
    setTagline(e.target.value);
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
   
    if (type === "blogpost") { 
      let data = {
        lastUpdated: timestamp,
        title: title,
        tagline: tagline,
        thumbnailURL: null,
        ownerName: props.user.displayName,
        ownerId: props.user.uid,
        profileId: props.user.profileId,
        visibility: visibility
      };
      
      firestore.collection("blogs").add(data)
        .then(blogpostRef => {
          console.log("Blogpost created. Redirecting...");
          setSaved(true);
          setRedirect(`/blog?id=${blogpostRef.id}`);
        });
      return;
    }
    else if (["image", "audio", "video"].includes(type)) {
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
  }

  function CreateStatus() {
    if (saved)
      return (<div className="dark-green">Artwork created successfully.</div>);
    else
      return null;
  }

  function renderForm() {
    console.log(type);
    switch (type) {
      case 'blogpost':
        return (
          <>
            <div className="formField">
              <label>
                <div className="u-bold">Title</div> 
                <input required="required" className="" type="text" onChange={updateTitle} value={title}/>
                <div>
                  <small className="">A title for your blogpost.</small>
                </div>
              </label>
            </div>
            <div className="formField">
              <label>
                <div className="u-bold">Tagline</div>
                <TextareaAutosize required className="" onChange={updateDescription} value={description}/>
                <div>
                  <small className="">A tagline for your blogpost.</small>
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
                  <small className="">Choose who can view your blogpost.</small>
                </div>
              </label>
            </div>
            <button type="submit" className="">Create Blogpost</button>
            <CreateStatus/>
          </>
        );
      case '' : return (<></>);
      break;
      default:
        return (
          <>
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
            <button type="submit" className="">Create Artwork</button>
            <CreateStatus/>
          </>
        );
    }
  }

  return (
    <>
      { redirect ?
        <Redirect to={redirect}/>
        : <></>
      }
      <form className="mediaCreator" onSubmit={handleSubmit}>
        <div className="formField">
          <label>
            <div className="u-bold">Media Type</div>
            <select value={type} onChange={updateType}>
              <option value="blogpost">Blogpost</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
            <div>
              <small className="">The type of media that you want to publish.</small>
            </div>
          </label>
        </div>
        {renderForm()}
      </form>
    </>
  );
}

export default Create;
