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
// ---- Matches ----
export const fetchMatches = () => api.get("/matches").then((res) => res.data);
export const addMatch = (matchData, token) =>
  api
    .post("/matches", matchData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);
export const updateMatchResult = (id, resultData, token) =>
  api
    .put(`/matches/${id}/result`, resultData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);

// ---- Gallery Admin ----
export const deleteGalleryImage = (id, token) =>
  api
    .delete(`/gallery/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data);

// ---- Registrations Admin ----
export const fetchRegistrations = (token) =>
  api
    .get("/registrations", { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data);
export const updateRegistrationStatus = (id, status, token) =>
  api
    .put(
      `/registrations/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    .then((res) => res.data);
