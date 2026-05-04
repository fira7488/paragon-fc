import { useState, useEffect } from "react";
import { fetchStandings } from "../../services/api";

const StandingsTable = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStandings()
      .then((data) => setStandings(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader"></div>;

  return (
    <div className="standings-container">
      <div className="standings-header">
        <div>#</div>
        <div>TEAM</div>
        <div>P</div>
        <div>W</div>
        <div>D</div>
        <div>L</div>
      </div>
      {standings.map((team, idx) => (
        <div
          key={team._id}
          className={`standings-row ${team.teamName === "Paragon" ? "highlight" : ""}`}
        >
          <div>{idx + 1}</div>
          <div>
            <strong>{team.teamName}</strong>{" "}
            {team.teamName === "Paragon" && "🏆"}
          </div>
          <div>{team.played}</div>
          <div>{team.wins}</div>
          <div>{team.draws}</div>
          <div>{team.losses}</div>
        </div>
      ))}
    </div>
  );
};

export default StandingsTable;
