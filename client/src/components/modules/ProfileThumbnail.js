import React, { useState, useEffect } from "react";

import "../../public/stylesheets/People.css";

function ProfileThumbnail(props) {
  const defaultSrc = "https://firebasestorage.googleapis.com/v0/b/threast-website.appspot.com/o/image%2F1589497383829?alt=media&token=4ceb9720-ff80-4d77-8cef-78e2186e7bb6";

  return (
    <div className="profileFrame">
      <div className="profilePhoto">
        <img src={props.profile.photoURL}/>
      </div>
      <div className="name">{props.profile.displayName}</div>
      <div className="class">{props.profile.class}</div>
      <div className="blurb">{props.profile.blurb}</div>
    </div>
  );
}

export default ProfileThumbnail;
