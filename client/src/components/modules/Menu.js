import React, { useState } from "react";
import { Link } from "react-router-dom";

export function Links(props) {
  return (
           <>
             <Link to="/art">Art</Link>
             <Link to="/people">People</Link>
             { (props.isLoggedIn) ?
               (
                 <>
                   <Link to="/account">Profile</Link>
                   <Link to="/create">Create</Link>
                 </>
               ) :
               <>
                 <Link to="/account">Authenticate</Link>
               </>
             }
           </>
         )
}

export function BurgerMenu(props) {
  return (
           <div className="burgerLinks">
             <Links isLoggedIn={props.isLoggedIn} />
           </div>
         )
}
