# Banglish to Bangla Conversion App

## Overview
In today’s world, communication plays a vital role in connecting people. This project aims to empower communication in Bangla by creating a seamless Banglish-to-Bangla conversion experience. This application allows users to write in Banglish (Bengali written in English letters) and converts it into accurate Bangla. It offers additional features such as content management, chatbot integration, PDF exports, and user personalization, making it a powerful tool for writers, students, and professionals.

---

## Features

### Core Features
1. **Authentication**
   - Secure login and registration system.
   - Protected API endpoints with authorization mechanisms.

2. **Banglish-to-Bangla Conversion**
   - High-accuracy translation engine for converting Banglish text into Bangla.

3. **Content Management**
   - Text editor for creating content in Banglish and converting it to Bangla.
   - Export functionality for saving content as PDFs.
   - Public or private PDF settings and profile dashboards.
   - AI-generated titles and captions for PDFs.

4. **Search Functionality**
   - App-wide search for profiles and user-uploaded PDFs in both Banglish and Bangla.

5. **Chatbot Integration**
   - Chatbot that understands and responds in Bangla or Banglish.
   - PDF-based query handling.

6. **Translation System Improvement**
   - Continuous learning through user input.
   - Admin verification for training data.

7. **User Interface**
   - Intuitive UI/UX to ensure ease of navigation and interaction.

8. **Backend and Infrastructure**
   - Scalable database integration.
   - Environment variables for streamlined deployment.

### Bonus Features
- **Voice Interaction**
  - Voice input and Bangla voice assistant.
- **Smart Editor**
  - Auto-correction for Banglish typos.
- **Real-Time Collaboration**
  - Collaborative content creation.
- **Analytics Dashboard**
  - Metrics for user engagement.
- **Customizable Fonts**
  - Bangla font selection for PDFs.
- **Dockerization**
  - Containerized deployment for consistent environments.

---

## Directory Structure
```
.
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chatbot.jsx
│   │   │   ├── Editor.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ...
│   │   ├── css/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── model/
│   │   ├── User.js
│   │   ├── pdf.js
│   ├── middlewares/
│   └── index.js
├── fonts/
│   ├── kalpurush.ttf
│   ├── AdorshoLipi.ttf
│   └── ...
├── .env
├── README.md
└── package.json
```

---

## Installation

### Prerequisites
- Node.js and npm installed.
- MongoDB server running locally or on the cloud.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/banglish-to-bangla-app.git
   ```

2. Navigate to the client and server directories to install dependencies:
   ```bash
   cd client
   npm install

   cd ../server
   npm install
   ```

3. Set up environment variables in `.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the application:
   ```bash
   cd server
   npm start

   cd ../client
   npm run dev
   ```

---

## Usage
- Access the application at `http://localhost:3000`.
- Register as a new user and log in.
- Use the text editor to input Banglish text and convert it to Bangla.
- Export content as PDFs and share.
- Interact with the chatbot for Bangla queries.

---

## Technologies Used
- **Frontend**: React.js, Vite, Tailwind CSS.
- **Backend**: Node.js, Express.js, MongoDB.
- **AI/ML**: Pre-trained Banglish-to-Bangla translation models.
- **Other Tools**: Docker, JWT, Vercel for deployment.

---

## Contribution
- Fork the repository and create a new branch.
- Commit your changes and create a pull request.
- Ensure your code adheres to the project’s coding standards.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Contact
For inquiries or support, contact us at [your-email@example.com](mailto:your-email@example.com).

---

## Acknowledgments
Special thanks to the contributors and the community for their continuous support in making this project a success.
