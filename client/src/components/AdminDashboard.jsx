import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <ul>
        <li>
          <Link to="/pending-pdfs">View Pending PDFs</Link>
        </li>
        <li>
          <Link to="/approved-pdfs">Approved PDFs</Link>
        </li>
        <li>
          <Link to="/chatbot">Banglish Chatbot</Link>
        </li>
        <li>
          <Link to="/upload-pdfs">Upload PDFs</Link>
        </li>
        <li>
          <Link to="/analytics">Analytics</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
