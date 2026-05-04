import { useState, useEffect } from "react";
import { fetchPlayers } from "../../services/api";
import PlayerCard from "./PlayerCard";

const PlayerGrid = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers()
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Failed to load players", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader"></div>;
  if (!players.length) return <p className="loading-text">No players found.</p>;

  return (
    <div className="players-grid">
      {players.map((player) => (
        <PlayerCard key={player._id} player={player} />
      ))}
    </div>
  );
};

export default PlayerGrid;
