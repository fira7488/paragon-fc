import StandingsTable from "../components/Common/StandingsTable";

const StandingsPage = () => {
  return (
    <section id="standings" style={{ background: "rgba(0,0,0,0.3)" }}>
      <h2 className="section-title">ASTU BATCH CUP 2025</h2>
      <div className="section-subtitle">TOURNAMENT STANDINGS</div>
      <StandingsTable />
    </section>
  );
};

export default StandingsPage;
