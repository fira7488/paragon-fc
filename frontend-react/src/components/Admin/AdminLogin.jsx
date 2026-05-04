import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login } from "../../services/api";

const AdminLogin = () => {
  const [username, setUsername] = useState("superadmin");
  const [password, setPassword] = useState("SuperAdmin2025!");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Checking server...");
  const navigate = useNavigate();
  const { login: authLogin, isAuthenticated } = useAuth();

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  // Optional: check server status on mount (like your original admin.html)
  // You can keep it simple or implement a status check.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(username, password);
      if (data.token) {
        authLogin(data.user, data.token);
        navigate("/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Cannot connect to server. Is backend running?");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>PARAGON FC ADMIN</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {error && <p className="error-msg">{error}</p>}
        </form>
        <div className="status">{status}</div>
      </div>
    </div>
  );
};

export default AdminLogin;
