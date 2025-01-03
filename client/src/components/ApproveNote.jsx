import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const ApproveNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleApprove = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/quiz/approve-note/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.ok) {
        alert("Note approved successfully!");
        navigate("/pending-notes");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to approve note.");
      }
    } catch (err) {
      alert("Error approving note: " + err.message);
    }
  };

  return (
    <div>
      <h2>Approve Note</h2>
      <p>Are you sure you want to approve this note?</p>
      <button onClick={handleApprove}>Yes, Approve</button>
      <button onClick={() => navigate("/pending-notes")}>Cancel</button>
    </div>
  );
};

export default ApproveNote;
