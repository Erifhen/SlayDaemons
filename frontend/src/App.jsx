import { useEffect, useState } from "react";
import "./Styles.css";
import {
  initLocalStorage,
  updateXP,
  applyDecayNow,
  getData,
  applyQuestReward,
  resetStorage,
  setData
} from "./storage/LocalStorage";

import StatusCard from "./components/StatusCard";
import PowerStatusCard from "./components/PowerStatusCard";
import HistoricalCard from "./components/HistoricalCard";
import AchievCard from "./components/AchievCard";
import BossArea from "./components/BossArea";
import NavFeed from "./components/NavFeed";

function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [historical, setHistorical] = useState(null);
  const [achievements, setAchievements] = useState(null);
  const [bossData, setBossData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFeed, setActiveFeed] = useState("batalhas");

  const refreshBossData = () => {
    const updatedBossData = getData("bossBattles");
    setBossData(updatedBossData);
  };

  useEffect(() => {
    const initializeApp = () => {
      initLocalStorage();
      resetStorage();
      applyDecayNow();

      const userData = getData("userProfile");
      setUserProfile(userData);

      refreshBossData();

      const historicalData = getData("historical") || {
        contabilization: { victories: 0, defeats: 0 },
        lastBattles: [],
      };
      setHistorical(historicalData);

      const achievementData = userData?.achievements || {
        contabilization: { achieves: 0 },
        lastAchievs: [],
      };
      setAchievements(achievementData);

      setIsLoading(false);
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        finalizeDailyBosses();
        refreshBossData();
        setHistorical(getData("historical"));
      }
    };

    const interval = setInterval(checkMidnight, 60000);
    return () => clearInterval(interval);
  }, []);

  const refreshUserProfile = () => {
    setUserProfile(getData("userProfile"));
  };

  const handleSaveProfile = (updatedProfileData) => {
  const updatedUserProfile = {
    ...userProfile,
    profile: {
      ...userProfile.profile,
      ...updatedProfileData,
    }
  };

  setUserProfile(updatedUserProfile);
  setData("userProfile", updatedUserProfile);
};

  const onGainXP = (category, amount) => {
    updateXP(category, amount);
    refreshUserProfile();
  };

  const onApplyReward = (quest) => {
    applyQuestReward(quest);
    refreshUserProfile();
  };

  if (isLoading) {
    return <div className="loading-screen">Carregando...</div>;
  }

  return (
    <div className="app-design">
      <h1 className="main-title">Slay the Daemons</h1>

      <StatusCard userProfile={userProfile} onSaveProfile={handleSaveProfile}/>
      <PowerStatusCard />

      <NavFeed activeFeed={activeFeed} setActiveFeed={setActiveFeed} />

      <div className="feed-content">
        {activeFeed === "batalhas" && (
          <BossArea bossData={bossData} refreshBossData={refreshBossData} />
        )}
        {activeFeed === "historico" && historical && (
          <HistoricalCard historicalData={historical} />
        )}
        {activeFeed === "conquistas" && achievements && (
          <AchievCard achievementData={achievements} />
        )}
      </div>
    </div>
  );
}

export default App;
