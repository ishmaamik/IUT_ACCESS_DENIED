import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/ProfileDashboard.module.css";
import { toast } from "react-toastify";

const ProfileDashboard = () => {
  const [user, setUser] = useState({});
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [downloadedPdfs, setDownloadedPdfs] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/profile/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data.user);
        setUploadedPdfs(response.data.uploadedPdfs || []);
        setDownloadedPdfs(response.data.downloadedPdfs || []);
        setSocialLinks(response.data.user.socialLinks || {});
      } catch (err) {
        setError(`Error fetching user data: ${err.message}`);
      }
    };
    fetchUserData();
  }, []);

  // Toggle PDF privacy
  const handleTogglePrivacy = async (pdfId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/profile/pdfs/${pdfId}/toggle-privacy`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedPrivacy = response.data.privacy;

      // Update the local state
      setUploadedPdfs((prevPdfs) =>
        prevPdfs.map((pdf) =>
          pdf._id === pdfId ? { ...pdf, privacy: updatedPrivacy } : pdf
        )
      );

      toast.success(`Privacy updated to ${updatedPrivacy}!`);
    } catch (err) {
      console.error("Error toggling privacy:", err.message);
      toast.error("Failed to update privacy.");
    }
  };

  // Update username
  const handleUpdateUsername = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/profile/username",
        { username: newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, username: response.data.username });
      setNewUsername("");
      toast.success("Username updated successfully!");
    } catch (err) {
      setError(`Error updating username: ${err.message}`);
    }
  };

  // Update social links
  const handleSocialLinksUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/profile/social-links",
        { socialLinks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, socialLinks: response.data.socialLinks });
      toast.success("Social links updated successfully!");
    } catch (err) {
      setError(`Error updating social links: ${err.message}`);
    }
  };

  // Download PDF
  const handleDownloadPdf = async (fileId, filename) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/pdf/download/${fileId}`,
        { responseType: "blob", headers: { Authorization: `Bearer ${token}` } }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error(`Error downloading file: ${err.message}`);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.topbar}>
        <h1>Welcome, {user.username}</h1>
      </header>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <h3>Menu</h3>
          <ul>
            <li>Dashboard</li>
            <li>Profile</li>
            <li>Uploaded PDFs</li>
            <li>Downloaded PDFs</li>
          </ul>
        </aside>
        <main className={styles.mainContent}>
          <section className={styles.profileSection}>
            <h3>Profile Details</h3>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <div>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter new username"
                className={styles.input}
              />
              <button onClick={handleUpdateUsername} className={styles.button}>
                Update Username
              </button>
            </div>
            <div>
              <h4>Social Links</h4>
              <input
                type="text"
                value={socialLinks.facebook}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, facebook: e.target.value })
                }
                placeholder="Facebook"
                className={styles.input}
              />
              <input
                type="text"
                value={socialLinks.twitter}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, twitter: e.target.value })
                }
                placeholder="Twitter"
                className={styles.input}
              />
              <input
                type="text"
                value={socialLinks.linkedin}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                }
                placeholder="LinkedIn"
                className={styles.input}
              />
              <button
                onClick={handleSocialLinksUpdate}
                className={styles.button}
              >
                Update Links
              </button>
            </div>
          </section>
          <section className={styles.pdfSection}>
            <h3>Your PDFs</h3>
            <div className={styles.pdfLists}>
              <h4>Uploaded PDFs</h4>
              <ul>
                {uploadedPdfs.map((pdf) => (
                  <li key={pdf._id} className={styles.pdfItem}>
                    <div>
                      <p>
                        <strong>Title:</strong>{" "}
                        {pdf.aiGeneratedTitle || "Untitled"}
                      </p>
                      <p>
                        <strong>File Name:</strong> {pdf.pdfFileName}
                      </p>
                      <p>
                        <strong>Caption:</strong>{" "}
                        {pdf.aiGeneratedCaption || "No caption available"}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleDownloadPdf(pdf._id, pdf.pdfFileName)
                      }
                      className={styles.button}
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleTogglePrivacy(pdf._id)}
                      className={styles.button}
                    >
                      {pdf.privacy === "public"
                        ? "Public"
                        : pdf.privacy === "private"
                        ? "Private"
                        : "Public"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ProfileDashboard;
