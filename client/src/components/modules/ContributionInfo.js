import React, { useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

function ContributionInfo(props) {
  const contributionDate = dayjs(props.contributionTime.toDate()).format(props.format);
  return (
        <div className="commentInfo">
          <Link to={"/people?id=" + props.ownerId}>
            <img
              className="profileIcon"
              src={props.photoURL}
              alt="囧"
            />
          </Link>
          <span className="commentAuthor">{props.ownerName}</span> • <span>{contributionDate}</span>
        </div>
  )
}

export default ContributionInfo;
