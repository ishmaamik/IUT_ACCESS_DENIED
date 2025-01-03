import React, { useState } from 'react';
import axios from 'axios';
import styles from '../css/Chatbot.module.css';

function Chatbot() {
  const [query, setQuery] = useState('');  // User's input question
  const [conversations, setConversations] = useState([]);  // Store conversation rounds (question and answer)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (query.trim() === "") return;

    try {
      const res = await axios.post('http://localhost:5000/api/quiz/ask-question', { question: query });
      const newConversation = { question: query, answer: res.data.answer };
      setConversations([...conversations, newConversation]);  // Add the new round of Q&A
      setQuery('');  // Clear the input field after submitting
    } catch (error) {
      console.error("Error asking question", error);
      setConversations([...conversations, { question: query, answer: "Sorry, there was an error answering your question." }]);
      setQuery('');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Interactive Chatbot</h1>
      <div className={styles.conversationsContainer}>
        {/* Display all rounds of questions and answers */}
        {conversations.map((conv, index) => (
          <div key={index} className={styles.conversation}>
            <div className={styles.userQuestion}>
              <strong>You:</strong> {conv.question}
            </div>
            <div className={styles.botAnswer}>
              <strong>Bot:</strong> {conv.answer}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question..."
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Ask</button>
      </form>
    </div>
  );
}

export default Chatbot;
