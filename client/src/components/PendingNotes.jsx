import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PendingNotes = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingNotes = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/quiz/pending-notes",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setNotes(data.notes);
        } else {
          setError(data.error || "Failed to fetch pending notes.");
        }
      } catch (err) {
        setError("Error fetching pending notes: " + err.message);
      }
    };

    fetchPendingNotes();
  }, []);

  return (
    <div>
      <h2>Pending Notes</h2>
      {error && <p>{error}</p>}
      {notes.length > 0 ? (
        <ul>
          {notes.map((note) => (
            <li key={note.fileId}>
              {note.filename}{" "}
              <button onClick={() => navigate(`/approve-pdf/${note.fileId}`)}>
                Approve
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending notes available.</p>
      )}
    </div>
  );
};

export default PendingNotes;
