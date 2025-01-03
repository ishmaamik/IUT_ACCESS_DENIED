import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import WelcomeDashboard from "./components/WelcomeDashboard";
import { getRole } from "../utils/auth";
import Chatbot from "./components/Chatbot";
import UploadNotes from "./components/UploadNotes";
import ApproveNote from "./components/ApproveNote";
import ApprovedNotes from "./components/ApprovedNotes";
import PendingNotes from "./components/PendingNotes";
import Editor from "./components/Editor";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const role = getRole();

  if (!role) {
    console.log("Redirecting to login...");
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    console.log("Role not authorized. Redirecting to home...");
    return <Navigate to="/" />;
  }

  return element;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeDashboard />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={<Dashboard />}
              allowedRoles={["Admin", "Editor"]}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/upload-pdfs" element={<UploadNotes />} />

        <Route path="/text-editor" element={<Editor />} />
        <Route
          path="/approved-pdfs"
          element={
            <ProtectedRoute
              element={<ApprovedNotes />}
              allowedRoles={["Editor", "Admin"]}
            />
          }
        />
        <Route
          path="/pending-pdfs"
          element={
            <ProtectedRoute
              element={<PendingNotes />}
              allowedRoles={["Admin"]}
            />
          }
        />

        <Route
          path="/approve-pdf/:id"
          element={
            <ProtectedRoute
              element={<ApproveNote />}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
