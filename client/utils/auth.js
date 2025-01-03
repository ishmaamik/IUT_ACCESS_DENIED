export const getRole = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      return null;
    }
  
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.role;
    } catch (error) {
      console.error("Error decoding token:", error.message);
      return null;
    }
  };
  