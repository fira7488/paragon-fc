const isDevelopment = process.env.NODE_ENV === "development";
export const API_BASE_URL = isDevelopment
  ? "http://localhost:5000/api"
  : "https://your-backend.onrender.com/api"; // ← change to your live backend
