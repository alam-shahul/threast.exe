import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StackGrid, { transitions , easings } from "react-stack-grid";
const { fadeDown, flip } = transitions;

import { firebase } from '@firebase/app';

import ProfileThumbnail from "./ProfileThumbnail.js";
import "../../public/stylesheets/People.css";


function PeopleGallery(props) {
  //const [mode, setMode] = useState(null);
  return (
    <>
      <div className="peopleContainer">
        <StackGrid
          appear={fadeDown.appear}
          appeared={fadeDown.appeared}
          appearDelay={600}
          enter={fadeDown.enter}
          entered={fadeDown.entered}
          leaved={fadeDown.leaved}
          duration={600}
          monitorImagesLoaded={true}
          horizontal={false}
          columnWidth={300}
          gutterWidth={15}
          gutterHeight={15}
          className="peopleGallery"
        >
          {props.peopleGallery ?
            props.peopleGallery.map((profileSnapshot) => {
              const profile = profileSnapshot.data();
              return <Link
                       style={{textDecoration: 'none'}}
                       key={profileSnapshot.id}
                       to={"/people?id=" + profileSnapshot.id}  
                     >
                       <ProfileThumbnail
                          key={profileSnapshot.id}
                          profile={profile}
                       />
                     </Link>
              })
            :
            <></>
          }
        </StackGrid>
      </div>
    </>
  );
}

export default PeopleGallery;
