import React, { useState } from "react";
import TextareaAutosize from 'react-autosize-textarea';

import { firebase } from '@firebase/app';
import { auth, firestore, storage} from "../../firebaseClient";

function CommentForm(props) {
  const [content, setContent] = useState("");

  function handleCommentSubmission(e){
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    e.preventDefault();
    let comment = {
      ownerId: props.user.uid,
      ownerName: props.user.displayName,
      content: content,
      parentId: props.parentId,
      replyId: props.replyId,
      firstPosted: timestamp,
      lastUpdated: timestamp,
      visibility: props.visibility
    }

    firestore.collection("comments").add(comment)
      .then(commentRef => {
        setContent("");
        console.log(commentRef)
      });

    props.visualCleanup();
  }

  return (
    <div className="commentBox">
      <form className="commentForm" onSubmit={handleCommentSubmission}>
        <label htmlFor="comment">
          <div className="title">{props.title}</div>
          <TextareaAutosize required className="" onChange={e => setContent(e.target.value)} value={content}/>
        </label>
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </div>
  )
}

export default CommentForm;
