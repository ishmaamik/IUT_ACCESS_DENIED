import React, { useEffect, useState } from "react";

const ApprovedNotes = () => {
  const [notes, setNotes] = useState([]); // State for approved notes
  const [error, setError] = useState(""); // State for errors

  useEffect(() => {
    // Function to fetch approved notes from the backend
    const fetchApprovedNotes = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/quiz/approved-notes",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authorization
            },
          }
        );

        const data = await response.json(); // Parse the JSON response

        if (response.ok) {
          setNotes(data.notes); // Set the notes if the response is OK
        } else {
          setError(data.error || "Failed to fetch approved notes."); // Handle errors from the server
        }
      } catch (err) {
        setError("Error fetching approved notes: " + err.message); // Handle network or other errors
      }
    };

    fetchApprovedNotes(); // Call the function immediately when the component is mounted
  }, []); // Empty dependency array ensures the effect runs only once when the component is mounted

  const handleDownload = async (fileId, filename) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/quiz/download-note/${fileId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Include token for authorization
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download the file."); // Handle server errors
      }

      const blob = await response.blob(); // Get the file blob
      const url = window.URL.createObjectURL(blob); // Create a URL for the blob
      const a = document.createElement("a"); // Create a temporary anchor tag
      a.href = url;
      a.download = filename; // Set the filename
      document.body.appendChild(a);
      a.click(); // Trigger the download
      a.remove(); // Remove the anchor tag
    } catch (err) {
      alert("Error downloading file: " + err.message); // Alert the user on error
    }
  };

  return (
    <div>
      <h2>Approved Notes</h2>
      {error && <p>{error}</p>} {/* Display error if any */}
      {notes.length > 0 ? (
        <ul>
          {notes.map((note) => (
            <li key={note.fileId}>
              {note.filename}{" "}
              <button
                onClick={() => handleDownload(note.fileId, note.filename)}
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No approved notes available.</p> // Message if no notes are found
      )}
    </div>
  );
};

export default ApprovedNotes;
