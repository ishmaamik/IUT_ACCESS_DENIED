import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import WelcomeDashboard from "./components/WelcomeDashboard";
const getRole = () => {
  const token = localStorage.getItem("token");
  console.log("Token:", token); // Check if token exists
  if (!token) {
    console.log("No token found");
    return null;
  }

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    console.log("Decoded token:", decoded); // Check decoded payload
    return decoded.role;
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return null;
  }
};

// Protected route component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const role = getRole();
  console.log("Current role:", role);

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
