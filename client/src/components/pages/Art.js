import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import StackGrid, { transitions } from "react-stack-grid";
import queryString from 'query-string'

const { scaleDown } = transitions;

import { firebase } from '@firebase/app';
import { auth, firestore, storage } from "../../firebaseClient";

import "../../utilities.css";
import "../../public/Art.css";

import { get, post } from "../../utilities";

function Art(props) {
  const url = useLocation().search;
  const parsed = queryString.parse(url);

  const [id, setId] = useState(null);
  const [artwork, setArtwork] = useState(null);
  const [gallery, setGallery] = useState(null);

  // TODO: All of this seems a bit hacky... you have basically implemented a state machine. Is that necessary?
  if (parsed.id) {
    if(!artwork || (parsed.id != id)) {
      firestore.collection("art").doc(parsed.id).get()
        .then((artSnapshot) => {
          //console.log(artSnapshot.data());
          setArtwork(artSnapshot.data());
          setId(parsed.id);
        });
    }
  }
  else {
    if(!gallery || id) {
      console.log(gallery);
      firestore.collection("art").get()
        .then((gallerySnapshot) => {
          //gallerySnapshot.forEach(doc => {
          //  console.log(doc.id, '=>', doc.data().downloadURL);
          //});
          setGallery(gallerySnapshot.docs);
          setId(null);
        });
    }
  }

  return (
    <>
      { id ?
        (artwork ? <Artwork artwork={artwork} id={id} /> : <div>Loading...</div>):
        <Gallery gallery={gallery}/> 
      }     
    </>
  );

}

function Artwork(props) {
  const [name, setName] = useState(props.artwork.title);
  const [description, setDescription] = useState(props.artwork.description);
  const [type, setType] = useState(props.artwork.type);
  const [downloadURL, setDownloadURL] = useState(props.artwork.downloadURL);
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
    
    const artName = `${props.id}`;
    let artRef = firestore.collection("art").doc(artName);
    let data = {
      lastUpdated: timestamp,
      title: name,
      type: type,
      description: description,
      downloadURL: downloadURL
    };
    let art = artRef.set(data)
      .then(artSnapshot => {
        console.log("Art saved.");
      });
          
    return;
  }

  function updateImage(e) {
    var storageRef = storage.ref();
    
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
          setDownloadURL(downloadURL);
          console.log('File available at', downloadURL);
        });
      });
    } 
    return;
  }

  return (
    <>
      <Link to="/art">Back To Art</Link>
      <form className="pa4 black-80" onSubmit={handleSubmit}>
        <div className="measure">
          <label className="f6 b db mb2">Title</label>
          <input required className="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" onChange={updateName} value={name}/>
          <small className="f6 black-60 db mb2">A title for your artwork.</small>
          <label className="f6 b db mb2">Description</label>
          <input required className="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" onChange={updateDescription} value={description}/>
          <small className="f6 black-60 db mb2">A description for your artwork.</small>
          <input required type="file" accept="image/png, image/jpeg, image/gif" onChange={updateImage}/>
          <img src={downloadURL}/>
          <button type="button" className="f6 link br2 ph3 pv2 mb2 dib white bg-dark-green mr2" onClick={handleSubmit}>Save Art</button>
          { saved ?
            <span className="dark-green">Artwork saved successfully.</span>
          :
            <span className="gold">The artwork has not been saved.</span>
          }
        </div>
      </form>
    </>
  );
}

function ArtThumbnail(props) {
  const defaultSrc = "https://firebasestorage.googleapis.com/v0/b/threast-website.appspot.com/o/images%2F1587943181851-test?alt=media&token=6b8a94eb-39bb-4869-bfdd-efa736b14bcb";
  let imageSource;

  //console.log(props.artwork);
  switch (props.artwork.type) {
    case "image":
      imageSource = props.artwork.downloadURL;
      break;
    default:
      imageSource = defaultSrc;
  }

  return (
    <div className="polaroidFrame">
      <div className="polaroidImage">
        <img src={imageSource} />
      </div>
      <div className="title">{props.artwork.title}</div>
      <div className="description">{props.artwork.description}</div>
    </div>
  );
}

function Gallery(props) {
  //const [display, setDisplay] = useState(null);
  //function handleClick() {
  //  console.log("clicked");
  //  setDisplay("none");
  //}
  return (
    <>
      <StackGrid
        appear={scaleDown.appear}
        appeared={scaleDown.appeared}
        enter={scaleDown.enter}
        entered={scaleDown.entered}
        leaved={scaleDown.leaved}
        monitorImagesLoaded={true}
        horizontal={true}
        columnWidth={300}
        gutterWidth={15}
        gutterHeight={15}
      >
        {props.gallery ?
          props.gallery.map((artworkSnapshot) => {
            const artwork = artworkSnapshot.data();
            return <Link
                     style={{textDecoration: 'none'}}
                     key={artworkSnapshot.id}
                     to={"/art?id=" + artworkSnapshot.id}  
                   >
                     <ArtThumbnail
                        key={artworkSnapshot.id}
                        artwork={artwork}
                     />
                   </Link>
            })
          :
          <div></div>
        }
      </StackGrid>
    </>
  );
}

export default Art;
