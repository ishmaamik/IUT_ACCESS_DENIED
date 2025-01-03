import React, { useState, useEffect } from "react";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";
import Unauthorized from "./Unauthorized";

const getRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.role;
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return null;
  }
};

const Dashboard = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole = getRole();
    setRole(userRole);
  }, []);

  if (!role) {
    return <Unauthorized />;
  }

  return (
    <>
      {role === "teacher" && <TeacherDashboard />}
      {role === "student" && <StudentDashboard />}
      {!["teacher", "student"].includes(role) && <Unauthorized />}
    </>
  );
};

export default Dashboard;
