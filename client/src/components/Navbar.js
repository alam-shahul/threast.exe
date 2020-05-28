// Adapted from https://dev.to/nunocpnp/your-very-first-responsive-and-animated-navigation-bar-with-react-and-react-spring-17co
import React, { Component } from "react";
import { get, post } from "../utilities";
import { Link } from "react-router-dom";

import "../public/stylesheets/Navbar.css";

const Logo = () => {
  return (
    <>
      <div>threast.exe</div>
    </>
  )
}

function Navbar(props){

  return (
    <>
      <div className="navbar">
        <div className="flexcontainer">
          <Link to="/">
            <Logo/>
          </Link>
          <div className="navlinks">
            <Link to="/signin">Auth</Link>
            <Link to="/art">Art</Link>
            <Link to={`/profile?id=0`}>Profile</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
