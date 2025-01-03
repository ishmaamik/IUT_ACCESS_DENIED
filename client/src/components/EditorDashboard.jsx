import React from "react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  return (
    <div>
      <h2>Student Dashboard</h2>

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
      </ul>
    </div>
  );
};

export default StudentDashboard;
