import React, { useState } from "react";
import CommentForm from "./CommentForm.js";
import dayjs from "dayjs";
import { Link, Redirect } from "react-router-dom";

function SingleComment(props) {
  const firstPosted = dayjs(props.comment.firstPosted.toDate()).format("MMM DD, YYYY h:mm A");
  return (
    <div className="comment">
      <div className="commentInfo">
        <Link to={"/people?id=" + props.comment.ownerId}>
          <img
            className="profileIcon"
            src={props.photoURL}
            alt="囧"
          />
        </Link>
        <span className="commentAuthor">{props.comment.ownerName}</span> • <span>{firstPosted}</span>
      </div>
      <div>{props.comment.content}</div>
    </div>
  )
}

function ReplyDisplay(props) {
  const [showReplyBox, setShowReplyBox] = useState(false)
  const isLoggedIn = !!props.user;
  if (isLoggedIn)
    return (
        <>
          <div className="replyBox">
            {showReplyBox ? (
              <div>
                <button
                  className="btn bare"
                  onClick={() => setShowReplyBox(false)}
                >
                  Cancel
                </button>
                <CommentForm title="Your reply" user={props.user} slug={props.slug} parentId={props.comment.parentId} visibility={props.blogpost.visibility} replyId={props.comment.id} visualCleanup={() => setShowReplyBox(false)}/>
              </div>
            ) : (
              <button className="btn bare" onClick={() => setShowReplyBox(true)}>
                Reply
              </button>
            )}
          </div>
        </>
    )
  else
    return (<></>);
}

function Comment(props) {
  console.log(props);
  return (
    <div className="commentBox">
      <SingleComment photoURL={props.photoURLMap[props.comment.ownerId]}comment={props.comment} />
      { props.children.map(child => (
          <div key={child.id} className="commentReply">
            <SingleComment photoURL={props.photoURLMap[child.ownerId]} comment={child} />
          </div>
        )
      )}
      { props.children.length > 0 ?
        <>
          <div className="commentReply">
            <ReplyDisplay {...props}/>
          </div>
        </>
        :
        <ReplyDisplay {...props}/>
      }
    </div>
  )
}

export default Comment;
