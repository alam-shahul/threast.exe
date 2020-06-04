import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StackGrid, { transitions } from "react-stack-grid";
const { scaleDown } = transitions;

import { firebase } from '@firebase/app';

import ProfileThumbnail from "./ProfileThumbnail.js";
import "../../public/stylesheets/People.css";


function PeopleGallery(props) {
  //const [mode, setMode] = useState(null);
  return (
    <>
      <StackGrid
        appear={scaleDown.appear}
        appeared={scaleDown.appeared}
        enter={scaleDown.enter}
        entered={scaleDown.entered}
        leaved={scaleDown.leaved}
        monitorImagesLoaded={true}
        horizontal={false}
        columnWidth={300}
        gutterWidth={15}
        gutterHeight={15}
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
    </>
  );
}

export default PeopleGallery;
