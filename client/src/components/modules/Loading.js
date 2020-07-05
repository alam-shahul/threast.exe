import React, { useState, useEffect } from "react";
import "../../public/stylesheets/Loading.css";
import loading_gif from "../../public/images/loading.gif";

function Loading() {

  return (
    <div className="loading">
      <img src={loading_gif}/>
    </div>
  )
}

export default Loading;
