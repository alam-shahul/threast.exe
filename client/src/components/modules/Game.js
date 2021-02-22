import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";

import Whiteboard from "./Whiteboard.js";

function Game(props) {
  const gameMap = {
    whiteboard: <Whiteboard {...props} / >
  }

  return (
    <>
      <div>
        {gameMap[props.game.title]}
      </div>
    </>
  );
}

export default Game;
