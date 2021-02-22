import React, { useState } from "react";
import CommentForm from "./CommentForm.js";
import ContributionInfo from "./ContributionInfo.js";

function SingleComment(props) {
  return (
    <div className="comment">
      <ContributionInfo ownerId={props.comment.ownerId} contributionDate={props.comment.firstPosted.toDate()} ownerName={props.comment.ownerName} photoURL={props.photoURL} format={"MMM DD, YYYY h:mm A"}/>
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
                <CommentForm title="Your reply" user={props.user} slug={props.slug} parentId={props.comment.parentId} subject={props.subject} replyId={props.comment.id} visualCleanup={() => setShowReplyBox(false)}/>
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
