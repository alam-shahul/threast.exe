import React, { useState, useEffect } from "react";

import { firebase } from '@firebase/app';
import { auth, firestore, storage} from "../../firebaseClient";

import Comment from "./Comment.js"
import CommentForm from "./CommentForm.js"

function CommentSection(props){
  const [comments, setComments] = useState([]);
  const [photoURLMap, setPhotoURLMap] = useState({});

  useEffect(() => {
      let commentCleanup = firestore
        .collection("comments")
        .orderBy("firstPosted", "asc").where("parentId", "==", props.parentId)
        .onSnapshot(snapshot => {
          const posts = snapshot.docs
          .map(doc => {
            return { id: doc.id, ...doc.data({ serverTimestamps: 'estimate' }) }
          })
          console.log(posts);
          setComments(posts)
        })

      return () => {
        commentCleanup();
      }

  }, [props.id])

  useEffect(() => {
    comments
      .map(comment => {
        firestore
        .collection("profiles")
        .doc(comment.ownerId)
        .onSnapshot(profileSnapshot => {
          setPhotoURLMap({
            ...photoURLMap,
            [comment.ownerId]: profileSnapshot.data().photoURL
          });
        })
      })
  }, [comments])

  return (
    <div className="commentSection">
      <div className="title">Comments</div>
      { props.user ?
        <CommentForm title="Start a new thread" user={props.user} slug={props.id} parentId={props.parentId} subject={props.subject} replyId={null} visualCleanup={() => null}/>
        :
        <></>
      }
        {comments &&
          comments
            .filter(comment => !comment.replyId)
            .map(comment => {
              let children;
              if (comment.id) {
                children = comments.filter(c => (comment.id === c.replyId))
              }
              return (
                <Comment
                  key={comment.id}
                  children={children}
                  photoURLMap={photoURLMap}
                  comment={comment}
                  subject={props.subject}
                  slug={props.id}
                  user={props.user}
                />
              )
            })}
    </div>
  )
}

export default CommentSection;
