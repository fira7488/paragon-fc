import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  fetchPlayers,
  addPlayer,
  deletePlayer,
  fetchMatches,
  addMatch,
  updateMatchResult,
  fetchGallery,
  deleteGalleryImage,
  fetchRegistrations,
  updateRegistrationStatus,
  fetchStats,
} from "../../services/api";

const AdminDashboard = () => {
  const { token } = useAuth();
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState("players");
  const [loading, setLoading] = useState(true);

  // Form states
  const [newName, setNewName] = useState("");
  const [newPosition, setNewPosition] = useState("FWD");
  const [newNumber, setNewNumber] = useState("");
  const [newMatch, setNewMatch] = useState({
    opponent: "",
    date: "",
    venue: "Home",
    competition: "League",
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [playersRes, matchesRes, galleryRes, registrationsRes, statsRes] =
        await Promise.all([
          fetchPlayers(),
          fetchMatches(),
          fetchGallery(),
          fetchRegistrations(token),
          fetchStats(),
        ]);
      setPlayers(playersRes);
      setMatches(matchesRes);
      setGallery(galleryRes.data || galleryRes);
      setRegistrations(registrationsRes);
      setStats(statsRes);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  // ---- Player actions ----
  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!newName || !newNumber) return;
    const playerData = {
      name: newName,
      position: newPosition,
      number: parseInt(newNumber),
      goals: 0,
      assists: 0,
      appearances: 0,
      averageRating: 6.5,
    };
    await addPlayer(playerData, token);
    loadAllData();
    setNewName("");
    setNewNumber("");
  };

  const handleDeletePlayer = async (id) => {
    if (window.confirm("Delete this player?")) {
      await deletePlayer(id, token);
      loadAllData();
    }
  };

  // ---- Match actions ----
  const handleAddMatch = async (e) => {
    e.preventDefault();
    await addMatch(newMatch, token);
    loadAllData();
    setNewMatch({
      opponent: "",
      date: "",
      venue: "Home",
      competition: "League",
    });
  };

  const handleUpdateMatchResult = async (id, result, homeScore, awayScore) => {
    await updateMatchResult(
      id,
      { result, score: { home: homeScore, away: awayScore } },
      token,
    );
    loadAllData();
  };

  // ---- Gallery moderation ----
  const handleDeleteImage = async (id) => {
    if (window.confirm("Delete this image?")) {
      await deleteGalleryImage(id, token);
      loadAllData();
    }
  };

  // ---- Registration actions ----
  const handleUpdateRegistrationStatus = async (id, status) => {
    await updateRegistrationStatus(id, status, token);
    loadAllData();
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Control Center</h1>
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-value">{stats.players?.total || 0}</div>
          <div className="stat-label">Total Players</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.matches?.total || 0}</div>
          <div className="stat-label">Matches</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {stats.players?.topScorer?.goals || 0}
          </div>
          <div className="stat-label">Top Scorer Goals</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{gallery.length}</div>
          <div className="stat-label">Gallery Items</div>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === "players" ? "active" : ""}
          onClick={() => setActiveTab("players")}
        >
          Players
        </button>
        <button
          className={activeTab === "matches" ? "active" : ""}
          onClick={() => setActiveTab("matches")}
        >
          Matches
        </button>
        <button
          className={activeTab === "gallery" ? "active" : ""}
          onClick={() => setActiveTab("gallery")}
        >
          Gallery
        </button>
        <button
          className={activeTab === "registrations" ? "active" : ""}
          onClick={() => setActiveTab("registrations")}
        >
          Registrations
        </button>
      </div>

      {/* Players Tab */}
      {activeTab === "players" && (
        <div className="admin-section">
          <h2>Add New Player</h2>
          <form onSubmit={handleAddPlayer} className="add-player-form">
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <select
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
            >
              <option value="GK">Goalkeeper</option>
              <option value="DEF">Defender</option>
              <option value="MID">Midfielder</option>
              <option value="FWD">Forward</option>
            </select>
            <input
              type="number"
              placeholder="Jersey Number"
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              required
            />
            <button type="submit">Add Player</button>
          </form>

          <h2>Current Squad</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Position</th>
                <th>Goals</th>
                <th>Assists</th>
                <th>Apps</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p._id}>
                  <td>{p.number}</td>
                  <td>{p.name}</td>
                  <td>{p.position}</td>
                  <td>{p.goals}</td>
                  <td>{p.assists}</td>
                  <td>{p.appearances}</td>
                  <td>{p.averageRating}</td>
                  <td>
                    <button
                      onClick={() => handleDeletePlayer(p._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === "matches" && (
        <div className="admin-section">
          <h2>Add New Match</h2>
          <form onSubmit={handleAddMatch} className="add-match-form">
            <input
              type="text"
              placeholder="Opponent"
              value={newMatch.opponent}
              onChange={(e) =>
                setNewMatch({ ...newMatch, opponent: e.target.value })
              }
              required
            />
            <input
              type="date"
              value={newMatch.date}
              onChange={(e) =>
                setNewMatch({ ...newMatch, date: e.target.value })
              }
              required
            />
            <select
              value={newMatch.venue}
              onChange={(e) =>
                setNewMatch({ ...newMatch, venue: e.target.value })
              }
            >
              <option value="Home">Home</option>
              <option value="Away">Away</option>
            </select>
            <input
              type="text"
              placeholder="Competition"
              value={newMatch.competition}
              onChange={(e) =>
                setNewMatch({ ...newMatch, competition: e.target.value })
              }
            />
            <button type="submit">Add Match</button>
          </form>

          <h2>Upcoming & Past Matches</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Opponent</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Result</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m) => (
                <tr key={m._id}>
                  <td>{m.opponent}</td>
                  <td>{new Date(m.date).toLocaleDateString()}</td>
                  <td>{m.venue}</td>
                  <td>{m.result}</td>
                  <td>
                    {m.score?.home} - {m.score?.away}
                  </td>
                  <td>
                    {m.result === "UPCOMING" && (
                      <button
                        onClick={() => {
                          const home = prompt("Home score?", "0");
                          const away = prompt("Away score?", "0");
                          if (home !== null && away !== null) {
                            const res =
                              parseInt(home) > parseInt(away)
                                ? "W"
                                : parseInt(home) < parseInt(away)
                                  ? "L"
                                  : "D";
                            handleUpdateMatchResult(
                              m._id,
                              res,
                              parseInt(home),
                              parseInt(away),
                            );
                          }
                        }}
                      >
                        Set Result
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gallery Moderation Tab */}
      {activeTab === "gallery" && (
        <div className="admin-section">
          <h2>Moderate Gallery</h2>
          <div className="gallery-moderation-grid">
            {gallery.map((img) => (
              <div key={img._id} className="gallery-mod-card">
                <img
                  src={`http://localhost:5000${img.imageUrl}`}
                  alt={img.title}
                  style={{ width: "100%", height: "150px", objectFit: "cover" }}
                />
                <div className="card-info">
                  <h4>{img.title}</h4>
                  <p>Uploaded by: {img.uploadedBy}</p>
                  <p>
                    Likes: {img.likes} | Views: {img.views}
                  </p>
                  <button
                    onClick={() => handleDeleteImage(img._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registrations Tab */}
      {activeTab === "registrations" && (
        <div className="admin-section">
          <h2>Player Registrations</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Student ID</th>
                <th>Email</th>
                <th>Position</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r._id}>
                  <td>
                    {r.firstName} {r.lastName}
                  </td>
                  <td>{r.studentId}</td>
                  <td>{r.email}</td>
                  <td>{r.preferredPosition}</td>
                  <td>
                    <span
                      className={`status-badge status-${r.status.toLowerCase()}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <select
                      defaultValue={r.status}
                      onChange={(e) =>
                        handleUpdateRegistrationStatus(r._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
