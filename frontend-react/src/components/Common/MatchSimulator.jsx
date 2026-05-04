import { useState } from "react";

const MatchSimulator = () => {
  const [opponent, setOpponent] = useState("Falcons");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [result, setResult] = useState("");

  const simulate = () => {
    const h = Math.floor(Math.random() * 5);
    const a = Math.floor(Math.random() * 4);
    setHomeScore(h);
    setAwayScore(a);
    if (h > a) setResult("🏆 WIN 🏆");
    else if (h < a) setResult("😔 LOSS 😔");
    else setResult("🤝 DRAW 🤝");
    setTimeout(() => setResult(""), 5000);
  };

  return (
    <div className="match-simulator">
      <div className="match-teams">
        <div className="team-badge">
          <div className="team-name">PARAGON FC</div>
          <div className="team-score">{homeScore}</div>
        </div>
        <div className="vs">VS</div>
        <div className="team-badge">
          <select
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
          >
            <option value="Falcons">Falcons</option>
            <option value="Vanguard">Vanguard</option>
            <option value="Zenora">Zenora</option>
            <option value="Pioneer">Pioneer</option>
            <option value="Scholar">Scholar</option>
          </select>
          <div className="team-score">{awayScore}</div>
        </div>
      </div>
      <button className="simulate-btn" onClick={simulate}>
        SIMULATE MATCH
      </button>
      {result && <div className="simulation-result">{result}</div>}
    </div>
  );
};

export default MatchSimulator;
