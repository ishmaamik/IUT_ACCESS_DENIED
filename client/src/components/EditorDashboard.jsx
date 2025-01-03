import React from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";

const EditorDashboard = () => {
  return (
    <div>
      <h2>Editor Dashboard</h2>

      <ul>
        <li>
          <Link to="/text-editor">Text Editor</Link>
        </li>
        <li>
          <Link to="/upload-pdfs">Upload PDFs</Link>
        </li>
        <li>
          <Link to="/approved-pdfs">View Approved PDFs</Link>
        </li>
        <li>
          <Link to="/chatbot">Banglish Chatbot</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
      <Logout />
    </div>
  );
};

export default EditorDashboard;
