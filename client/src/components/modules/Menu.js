import React, { useState } from "react";
import { Link } from "react-router-dom";

export function Links(props) {
  return (
           <>
             <Link to="/art" onClick={props.handleClick}>Art</Link>
             <Link to="/people" onClick={props.handleClick}>People</Link>
             { (props.isLoggedIn) ?
               (
                 <>
                   <Link to="/account" onClick={props.handleClick}>Profile</Link>
                   <Link to="/create" onClick={props.handleClick}>Create</Link>
                 </>
               ) :
               <>
                 <Link to="/account" onClick={props.handleClick}>Authenticate</Link>
               </>
             }
           </>
         )
}

export function BurgerMenu(props) {
  return (
           <div className="burgerLinks">
             <Links isLoggedIn={props.isLoggedIn} handleClick={props.handleClick}/>
           </div>
         )
}
