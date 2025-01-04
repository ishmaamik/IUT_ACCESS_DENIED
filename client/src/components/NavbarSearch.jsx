import React, { useState } from "react";
import "../css/Navbar.module.css";

const NavbarSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState({ pdfs: [], users: [] });

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/search?term=${encodeURIComponent(
          searchTerm
        )}`
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults({ pdfs: [], users: [] });
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search PDFs or users..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      <div className="search-results">
        <div className="pdf-results">
          <h3>PDFs</h3>
          {Array.isArray(searchResults.pdfs) &&
          searchResults.pdfs.length > 0 ? (
            searchResults.pdfs.map((pdf) => (
              <div key={pdf._id} className="result-item">
                <p>Title: {pdf.aiGeneratedTitle}</p>
                <p>Filename: {pdf.pdfFileName}</p>
                <p>Uploader: {pdf.userId}</p>
              </div>
            ))
          ) : (
            <p>No PDFs found.</p>
          )}
        </div>

        <div className="user-results">
          <h3>Users</h3>
          {Array.isArray(searchResults.users) &&
          searchResults.users.length > 0 ? (
            searchResults.users.map((user) => (
              <div key={user._id} className="result-item">
                <p> Username: {user.username}</p>
                <p>Role: {user.role}</p>
              </div>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarSearch;
