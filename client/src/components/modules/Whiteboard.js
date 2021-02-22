import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import CanvasDraw from "react-canvas-draw";

function Whiteboard(props) {
  const [canvasRef, setCanvasRef] = useState(null);

  return (
    <>
      <CanvasDraw
        ref={canvasDraw => (setCanvasRef(canvasDraw))}
        brushColor={"red"}
        brushRadius={10}
        lazyRadius={10}
        canvasWidth={400}
        canvasHeight={400}
      />
      <button
        onClick={() => {
            let savedCanvas = canvasRef.getSaveData();
            console.log(savedCanvas);
        }}
      />
    </>
  );
}

export default Whiteboard;
