const PlayerCard = ({ player }) => {
  return (
    <div className="player-card">
      <div className="player-number">#{player.number}</div>
      <div className="player-name">{player.name}</div>
      <div className="player-position">{player.position}</div>
      <div className="player-stats">
        <div className="player-stat">
          <div className="player-stat-value">{player.goals || 0}</div>
          <div className="player-stat-label">GOALS</div>
        </div>
        <div className="player-stat">
          <div className="player-stat-value">{player.assists || 0}</div>
          <div className="player-stat-label">ASSISTS</div>
        </div>
        <div className="player-stat">
          <div className="player-stat-value">{player.appearances || 0}</div>
          <div className="player-stat-label">APPS</div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
