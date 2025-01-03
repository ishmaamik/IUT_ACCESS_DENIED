import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div>
      <h2>Student Dashboard</h2>

      <ul>
        <li>
          <Link to="/text-editor">Login</Link>
        </li>
        <li>
          <Link to="/upload-pdfs">Register</Link>
        </li>
        <li>
          <Link to="/approved-pdfs">Search</Link>
        </li>
        <li>
          <Link to="/chatbot">About Us</Link>
        </li>
      </ul>
    </div>
  );
};

export default Unauthorized;
