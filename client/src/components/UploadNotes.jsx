import React, { useState } from "react";
import styles from "../css/UploadNotes.module.css";

const UploadNotes = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/uploads/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Display the message returned by the backend
        setError("");
      } else {
        setError(data.error || "Failed to upload file.");
      }
    } catch (err) {
      setError("Error uploading file: " + err.message);
    }
  };

  return (
    <div className={styles.uploadNotesContainer}>
      <h2>Upload Notes</h2>
      {message && <p className={styles.successMessage}>{message}</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleUpload}>
        <div className={styles.fileInput}>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadNotes;
