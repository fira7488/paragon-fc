import axios from "axios";
import { API_BASE_URL } from "../config.js";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// --- Players ---
export const fetchPlayers = () => api.get("/players").then((res) => res.data);
export const addPlayer = (playerData, token) =>
  api
    .post("/players", playerData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);
export const deletePlayer = (id, token) =>
  api.delete(`/players/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// --- Standings ---
export const fetchStandings = () =>
  api.get("/standings").then((res) => res.data);

// --- Gallery ---
export const fetchGallery = () => api.get("/gallery").then((res) => res.data);
export const uploadImage = (formData) =>
  api
    .post("/gallery/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
export const likeImage = (id) =>
  api.post(`/gallery/${id}/like`).then((res) => res.data);

// --- Auth ---
export const login = (username, password) =>
  api.post("/auth/login", { username, password }).then((res) => res.data);

// --- Stats ---
export const fetchStats = () => api.get("/stats").then((res) => res.data);
