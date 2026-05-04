import { useState, useEffect } from "react";
import { fetchPlayers, addPlayer, deletePlayer } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const [players, setPlayers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPosition, setNewPosition] = useState("FWD");
  const [newNumber, setNewNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const loadPlayers = () => {
    fetchPlayers()
      .then(setPlayers)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName || !newNumber) return;
    const playerData = {
      name: newName,
      position: newPosition,
      number: parseInt(newNumber),
      goals: 0,
      assists: 0,
      appearances: 0,
    };
    await addPlayer(playerData, token);
    loadPlayers();
    setNewName("");
    setNewNumber("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this player?")) {
      await deletePlayer(id, token);
      loadPlayers();
    }
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="add-player-form">
        <h3>Add New Player</h3>
        <form onSubmit={handleAdd}>
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
      </div>

      <div className="players-list">
        <h3>Current Squad</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p._id}>
                <td>{p.number}</td>
                <td>{p.name}</td>
                <td>{p.position}</td>
                <td>
                  <button
                    onClick={() => handleDelete(p._id)}
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
    </div>
  );
};

export default AdminDashboard;
