import React, { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import EditorDashboard from "./EditorDashboard";
import Unauthorized from "./Unauthorized";
import { getRole } from "../../utils/auth";
import LogoutButton from "./Logout";

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
    <div>
      <LogoutButton />
      {role === "Admin" && <AdminDashboard />}
      {role === "Editor" && <EditorDashboard />}
      {!["Admin", "Editor"].includes(role) && <Unauthorized />}
    </div>
  );
};

export default Dashboard;
