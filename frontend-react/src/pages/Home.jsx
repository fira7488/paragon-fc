import Hero from "../components/Common/Hero";
import ChampionshipBanner from "../components/Common/ChampionshipBanner";
import PlayerGrid from "../components/Common/PlayerGrid";
import MatchSimulator from "../components/Common/MatchSimulator";

const Home = () => {
  return (
    <>
      <Hero />
      <ChampionshipBanner />
      <section id="players">
        <h2 className="section-title">THE ELITE SQUAD</h2>
        <div className="section-subtitle">22 PLAYERS • 1 TEAM • 1 DREAM</div>
        <PlayerGrid />
      </section>
      <section>
        <h2 className="section-title">MATCH SIMULATOR</h2>
        <MatchSimulator />
      </section>
    </>
  );
};

export default Home;
