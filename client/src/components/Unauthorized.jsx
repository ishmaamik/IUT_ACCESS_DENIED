import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div>
      <h2>You are unauthorized! Please login or register!</h2>

      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/search">Search</Link>
        </li>
        <li>
          <Link to="/about-us">About Us</Link>
        </li>
      </ul>
    </div>
  );
};

export default Unauthorized;
