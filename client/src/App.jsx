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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
