import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StackGrid, { transitions , easings } from "react-stack-grid";
const { fadeDown, flip } = transitions;

import { firebase } from '@firebase/app';

import ProfileThumbnail from "./ProfileThumbnail.js";
import "../../public/stylesheets/People.css";


function PeopleGallery(props) {
  // Make list of unique classes

  const uniqueClasses = [...new Set(props.peopleGallery.map(profile => profile.data().class))].sort().reverse();
  const initialSelectedClass = uniqueClasses[0];

  function filterByClass(peopleGallery, selectedClass) {
    return peopleGallery.filter(profile => (profile.data().class === selectedClass));
  }

  const [selectedClass, setSelectedClass] = useState(initialSelectedClass);
  const [subgallery, setSubgallery] = useState(filterByClass(props.peopleGallery, initialSelectedClass));

  function changeClass(event) {
    setSelectedClass(event.target.value);
    setSubgallery(filterByClass(props.peopleGallery, event.target.value));
  }

  return (
    <>
      <div className="peopleContainer">
        { (selectedClass && uniqueClasses) ?
          <div className="classSelector">
            <span>Class of </span>
            <select value={selectedClass} onChange={changeClass}>
              { uniqueClasses.map((classOption) =>
                  (<option key={classOption} value={classOption}>{classOption}</option>)
                )
              }
            </select>
          </div>
          :
          <></>
        }
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
          {subgallery ?
            subgallery.map((profileSnapshot) => {
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
