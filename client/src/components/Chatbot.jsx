import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/Chatbot.module.css";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [query, setQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch notes on component load
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized. Please log in.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/quiz/approved-notes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setNotes(response.data.notes || []);
        } else {
          setError(response.data.error || "Failed to fetch notes.");
        }
      } catch (err) {
        setError("Error fetching notes: " + err.message);
      }
    };

    fetchNotes();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter a valid question.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const endpoint = selectedNote
        ? "http://localhost:5000/api/quiz/chat-about-note"
        : "http://localhost:5000/api/quiz/chat";

      const payload = selectedNote
        ? { fileId: selectedNote.fileId, question: query }
        : { question: query };

      const res = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newConversation = {
        question: query,
        answer: res.data.answer || "No answer available.",
      };
      setConversations([...conversations, newConversation]);
      setQuery("");
    } catch (error) {
      console.error("Error asking question:", error);
      setConversations([
        ...conversations,
        {
          question: query,
          answer: "Sorry, there was an error answering your question.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Interactive Chatbot</h1>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.notesSelector}>
        <h3>Available Notes</h3>
        {notes.length > 0 ? (
          <ul>
            {notes.map((note) => (
              <li key={note.fileId}>
                <button
                  className={
                    selectedNote?.fileId === note.fileId ? styles.selected : ""
                  }
                  onClick={() => setSelectedNote(note)}
                >
                  {note.pdfFileName}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notes available.</p>
        )}
      </div>

      <div className={styles.chatSection}>
        <h4>
          {selectedNote
            ? `Selected Note: ${selectedNote.filename}`
            : "General Chat"}
        </h4>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            className={styles.input}
            disabled={loading}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Processing..." : "Ask"}
          </button>
        </form>
      </div>

      <div className={styles.conversationsContainer}>
        {conversations.map((conv, index) => (
          <div key={index} className={styles.conversation}>
            <p>
              <strong>You:</strong> {conv.question}
            </p>
            <p>
              <strong>Bot:</strong> {conv.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chatbot;
