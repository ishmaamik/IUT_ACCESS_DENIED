import { useState } from "react";
import axios from "axios";
const Editor = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const handleTranslate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/editor/translate",
        {
          text,
          targetLanguage: "Bangla",
        }
      );
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error("Error translating text:", error.message);
    }
  };

  const handleDownloadAndUploadPdf = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
  
      if (!token) {
        alert("Unauthorized: Please log in.");
        return;
      }
  
      const response = await axios.post(
        "http://localhost:5000/api/editor/convert-to-pdf",
        { text: translatedText },
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        }
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "translated.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      alert("PDF successfully generated, uploaded, and downloaded.");
    } catch (error) {
      console.error("Error generating and downloading PDF:", error.message);
      if (error.response && error.response.status === 403) {
        alert("Unauthorized: Please check your login status.");
      }
    }
  };
  
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "1000px",
        maxHeight: "3000px",
        margin: "auto",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Banglish to Bangla Translator</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <textarea
          placeholder="Enter Banglish text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            height: "200px",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={handleTranslate}
          style={{
            padding: "10px 15px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Translate
        </button>
        <div
          style={{
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
            minHeight: "300px",
          }}
        >
          <strong>Translated Text:</strong>
          <p style={{ margin: "10px 0 0", whiteSpace: "pre-wrap" }}>
            {translatedText}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleDownloadAndUploadPdf}>Download PDF</button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
