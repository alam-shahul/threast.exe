// Adapted from https://dev.to/nunocpnp/your-very-first-responsive-and-animated-navigation-bar-with-react-and-react-spring-17co
import React, { Component } from "react";
import { get, post } from "../utilities";
import { Link } from "react-router-dom";

import "../public/stylesheets/Navbar.css";
import logo_image from "../public/images/danger.svg";

const Logo = () => {
  return (
    <>
    </>
  )
}

function Navbar(props){
  return (
    <>
      <div className="navbar">
        <div className="flexcontainer">
          <div className="logo">
            <Link to="/">
              <img src={logo_image}/>
            </Link>
            <Link to="/">
              <span>threast</span>  
            </Link>
          </div>
          <div className="navlinks">
            <Link to="/art">Art</Link>
            <Link to="/people">People</Link>
            { (props.user) ?
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
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
