import React, { useState, useEffect } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";

import Gallery from "../modules/Gallery.js";
import BlogGallery from "../modules/BlogGallery.js";
import "../../public/stylesheets/Profile.css";

function Profile(props) {

  return (
           <>
             <div className="profileContainer">
               <div className="profile">
                 { props.profile ? 
                   <>
                     <div className="textContainer">
                       <div className="name">{props.profile.displayName}</div>
                       <div className="class">{props.profile.class}</div>
                       <div className="blurb">{props.profile.blurb}</div>
                     </div>
                     <img src={props.profile.photoURL}/>
                   </>
                   :
                   <div>Not a valid profile!</div>
                 }
               </div>
               { props.profile ?
                 <>
                   <Gallery startQuery={props.artStartQuery} title={`${props.profile.displayName}'s Art`}/>      
                   <BlogGallery startQuery={props.blogStartQuery} title={`${props.profile.displayName}'s Blogposts`}/>
                 </>      
                 :
                 <></>
               }
             </div>
           </>
         )
}

export default Profile;
