import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';

import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import Tex from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';
import math from 'remark-math';


import MarkdownEditor from './MarkdownEditor.js';

import { firebase } from '@firebase/app';
import { auth, firestore, storage} from "../../firebaseClient";

import "../../utilities.css";
import { deleteMediaByURL, uploadToFirestore } from "../../utilities";
import "../../public/stylesheets/Blog.css";
import { FileDisplay, FileProcessor } from "./FileProcessor.js";

import BlogpostViewer from "./BlogpostViewer.js";

function BlogpostEditor(props) {
  const [redirect, setRedirect] = useState(null);
  const [title, setTitle] = useState(props.blogpost.title);
  const [tagline, setTagline] = useState(props.blogpost.tagline);
  const [content, setContent] = useState(props.blogpost.content);
  const [file, setFile] = useState(null);
  const [thumbnailURL, setThumbnailURL] = useState(props.blogpost.thumbnailURL);
  const [visibility, setVisibility] = useState(props.blogpost.visibility);
  const [savedBlog, setSavedBlog] = useState(props.blogpost);
  
  // The dataStatus state has five possible values: "saved", "unsaved", "saving", "deleting" and "deleted"
  const [dataStatus, setDataStatus] = useState("saved");
  
  var mockBlogpost = {
    title: title,
    tagline: tagline,
    content: content,
    thumbnailURL: thumbnailURL
  }

  // This effect is necessary to sync the state change with the upload
  // (although it isn't done perfectly)
  useEffect(() => {
    if (dataStatus == "saving") {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      saveBlogpost(timestamp);
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
  
  function updateTagline(e) {
    setTagline(e.target.value);
    setDataStatus("unsaved");
  }

  function updateContent(content) {
    setContent(content);
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
        mockBlogpost = {
          title: title,
          tagline: tagline,
          content: content,
          thumbnailURL: e.target.result
        }
        console.log(mockBlogpost);
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
        const filepath = `${"blogpostThumbnails"}/${Date.now()}`;
        let uploadTask = uploadToFirestore(filepath, file, props.blogpost.ownerId);
        
        uploadTask.then(function(snapshot) {
          snapshot.ref.getDownloadURL().then(function(newThumbnailURL) {
            if (thumbnailURL)
              deleteMediaByURL(thumbnailURL);
 
            setThumbnailURL(newThumbnailURL);
            console.log('File available at', newThumbnailURL);
            setDataStatus("saving");
          });
        });
      }
      else {
        setDataStatus("saving");
      }
    }
  }
 
  function saveBlogpost(timestamp) {
    const blogName = `${props.id}`;
    let blogRef = firestore.collection("blogs").doc(blogName);
    let data = {
      lastUpdated: timestamp,
      title: title,
      tagline: tagline,
      content: content,
      thumbnailURL: thumbnailURL,
      ownerName: props.blogpost.ownerName,
      ownerId: props.blogpost.ownerId,
      profileId: props.blogpost.profileId,
      visibility: visibility
    };
    setSavedBlog(data);
    let blog = blogRef.set(data)
      .then(blogSnapshot => {
        console.log("Blog saved.");
        setDataStatus("saved");
      });

    if (visibility != props.blogpost.visibility) {
      const newVisibility = {
        visibility: visibility
      }
      
      firestore.collection("comments").where("parentId", '==', props.id).get().then(response => {
        let batch = firestore.batch();
        response.docs.forEach((doc) => {
          const docRef = firestore.collection("comments").doc(doc.id);
          batch.update(docRef, newVisibility);
        })
        batch.commit().then(() => {
          console.log(`updated all comments`);
        })
      })
    }
  }
  
  function deleteBlogpost() {
    if (!props.id)
      return;

    const blogName = `${props.id}`;
    let blogRef = firestore.collection("blogs").doc(blogName);
   
    if (thumbnailURL)
      deleteMediaByURL(thumbnailURL);
 
    // Delete the file
    setDataStatus("deleting");
    blogRef.delete().then(function() {
      // File deleted successfully
      console.log("Blogpost deleted!");
      setDataStatus("deleted");
      setRedirect("/account");
    }).catch(function(error) {
      // Uh-oh, an error occurred!
      console.log(error);
    }); 
  } 

  function BlogpostStatus() {
    if (dataStatus == "saved")
      return (<div className="dark-green">Blogpost saved successfully.</div>);
    else if (dataStatus == "saving")
      return (<div className="dark-green">Blogpost is being saved...</div>);
    else if (dataStatus == "deleting")
      return (<div>Blogpost is being deleted...</div>)
    else if (dataStatus == "deleted")
      return (<div>Blogpost has been deleted.</div>)
    else
      return (<div className="gold">The blogpost has not been saved.</div>);
  }

  function renderParagraph(props) {
    const { children } = props;
  
    if (children && children[0]
      && children.length === 1
      && children[0].props
      && children[0].props.src) { // rendering media without p wrapper
  
      return children;
    }
  
    return <p>{children}</p>;
  }

  function renderImage(props) {
    return <img {...props} style={{maxWidth: '100%'}} />
  }

  return (
    <>
      <form className="blogpostEditor" onSubmit={handleSubmit}>
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
            <TextareaAutosize required className="" onChange={updateTagline} value={tagline}/>
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
        <div className="formField">
          <div className="u-bold">Thumbnail</div>
          <FileProcessor type="image" initialURL={thumbnailURL} updateFile={updateFile}/>
        </div>
        <div className="formField">
          <label>
            <div className="u-bold">Content Editor and Live Preview</div>
            <div className="editorWrapper">
              <div className="monacoWrapper">
                <MarkdownEditor
                  content={content}
                  onChange={updateContent}
                />
              </div>
              <div className="monacoPreview">
                <ReactMarkdown
                  plugins={[gfm, math]}
                  children={content}
                  renderers={{
                    paragraph: renderParagraph,
                    image: renderImage,
                    inlineMath: ({value}) => <Tex math={value} />,
                    math: ({value}) => <Tex block math={value} />
                  }}
                  skipHtml={false}
                  escapeHtml={true}
                />
              </div>
            </div>
          </label>
        </div>
        <div className="buttonContainer">
          <button type="submit" className="">Save Blog</button>
          <button type="button" className="" onClick={deleteBlogpost}>Delete Blog</button>
          <BlogpostStatus/>
        </div>
        <div className="u-bold">Blogpost Preview</div>
        <BlogpostViewer id={props.id} blogpost={savedBlog}/>
        { redirect ?
          <Redirect to={redirect}/>
          :
          <></>
        }
      </form>
    </>
  );
}

export default BlogpostEditor;
