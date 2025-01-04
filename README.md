# Banglish to Bangla Conversion App

## Overview
In today’s world, communication plays a vital role in connecting people. This project aims to empower communication in Bangla by creating a seamless Banglish-to-Bangla conversion experience. This application allows users to write in Banglish (Bengali written in English letters) and converts it into accurate Bangla. It offers additional features such as content management, chatbot integration, PDF exports, and user personalization, making it a powerful tool for writers, students, and professionals.

---

## Features

### Core Features
1. **Authentication**
   - Secure login and registration using JWT for authentication.
   - API endpoints are protected to ensure only authorized access.

2. **Banglish-to-Bangla Conversion**
   - Uses a custom-trained translation model.
   - Converts Banglish text into natural and grammatically accurate Bangla.

3. **Content Management**
   - Interactive text editor to create and edit content in Banglish.
   - Export the content into PDFs with customizable fonts.
   - Public/private settings for PDFs via the user dashboard.
   - AI-generated titles and captions for all exported content.

4. **Search Functionality**
   - Search for user profiles and PDFs using Banglish or Bangla queries.

5. **Chatbot Integration**
   - Conversational chatbot capable of understanding and responding in Banglish and Bangla.
   - Queries are enriched with content-based references from user-uploaded PDFs.

6. **Translation System Improvement**
   - Continuous learning framework where users can contribute new data.
   - Admin verification ensures the quality of training data before integration.

7. **User Interface**
   - Clean, modern, and intuitive UI/UX built with React.js and Tailwind CSS.

8. **Backend and Infrastructure**
   - Scalable backend with MongoDB for efficient data handling.
   - Environment file (.env) for managing sensitive configurations.


### Bonus Features
- **Voice Interaction**
  - Voice input and Bangla voice assistant.
- **Customizable Fonts**
  - Bangla font selection for PDFs.
- **Dockerization**
  - Containerized deployment for consistent environments.

---

## Directory Structure
```
IUT_ACCESS_DENIED/
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
5. Run using Docker:
   ```bash
   docker-compose up
   ```
   
---

## Usage
- Access the application at `http://localhost:5000` on server side
    `http://localhost:5173` on client side.
- Register as a new user and log in.
- Use the text editor to input Banglish text and convert it to Bangla.
- Export content as PDFs and share.
- Interact with the chatbot for Bangla queries.

---

## Technologies Used
- **Frontend**: React.js, Vite, Tailwind CSS.
- **Backend**: Node.js, Express.js, MongoDB.
- **AI/ML**: Pre-trained Banglish-to-Bangla translation models.
- **Other Tools**: Docker, JWT for deployment.

---

## API Details

### Authentication Endpoints
- **POST /api/auth/register**
  - Registers a new user.
  - Request body: `{ "username": "string", "email": "string", "password": "string" }`
  - Response: `{ "message": "Registration successful", "userId": "string" }`

- **POST /api/auth/login**
  - Authenticates a user and returns a JWT.
  - Request body: `{ "email": "string", "password": "string" }`
  - Response: `{ "token": "string", "user": { "id": "string", "username": "string" } }`

### Banglish-to-Bangla Translation Endpoints
- **POST /api/translate**
  - Converts Banglish text to Bangla.
  - Request body: `{ "text": "string" }`
  - Response: `{ "translatedText": "string" }`

### Content Management Endpoints
- **POST /api/content/create**
  - Creates and saves new content.
  - Request body: `{ "title": "string", "content": "string" }`
  - Response: `{ "message": "Content saved successfully", "contentId": "string" }`

- **GET /api/content/:id**
  - Retrieves content by ID.
  - Response: `{ "title": "string", "content": "string", "author": "string" }`

- **POST /api/content/export**
  - Exports content as a PDF.
  - Request body: `{ "contentId": "string", "font": "string" }`
  - Response: `{ "message": "PDF generated successfully", "pdfUrl": "string" }`

### Chatbot Endpoints
- **POST /api/chat/query**
  - Sends a query to the chatbot.
  - Request body: `{ "message": "string" }`
  - Response: `{ "response": "string" }`

### Admin-Specific Endpoints
- **POST /api/admin/verify**
  - Verifies user-submitted translations for model training.
  - Requires admin authentication.
---

## Contribution Guidelines
1. Fork the repository and create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
2. Commit changes and create a pull request with detailed explanations.
3. Ensure all new features include unit tests.

---

## Contact
For inquiries, feedback, or support, contact:
- Email: [bhuiyansiyam294@gmail.com](mailto:bhuiyansiyam294@gmail.com)
- GitHub: [Siyam-Bhuiyan](https://github.com/Siyam-Bhuiyan)

---

## Acknowledgments
Special thanks to all contributors, KUET CSE community and the people behind the box to make this such models and datasets to access Bangla language that much eas/'
/y.Op
