import { useState } from "react";
import LastAchievCard from "./lastAchievCard";
import { getData, setData } from "../storage/LocalStorage";

export default function AchievCard() {
  const [userProfile, setUserProfile] = useState(() => getData("userProfile"));
  const [forceUpdate, setForceUpdate] = useState(false);

  if (!userProfile) {
    return <p className="loading-message">Erro ao carregar dados de Conquistas...</p>;
  }

  const achievementData = userProfile.achievements;
  const contabilization = achievementData.contabilization || { achieves: 0 };
  const lastAchievs = achievementData.lastAchievs || [];

  const handleEditAchievement = (editedAchiev) => {
    const updatedProfile = {
      ...userProfile,
      achievements: {
        ...userProfile.achievements,
        lastAchievs: userProfile.achievements.lastAchievs.map(achv => 
          achv.id === editedAchiev.id ? editedAchiev : achv
        )
      }
    };

    setUserProfile(updatedProfile);
    setData("userProfile", updatedProfile);
    setForceUpdate(prev => !prev); // Força a atualização do componente
  };

  const handleDeleteAchievement = (id) => {
    const updatedProfile = {
      ...userProfile,
      achievements: {
        ...userProfile.achievements,
        lastAchievs: userProfile.achievements.lastAchievs.filter(
          achv => achv.id !== id
        ),
        contabilization: {
          achieves: userProfile.achievements.contabilization.achieves - 1
        }
      }
    };

    setUserProfile(updatedProfile);
    setData("userProfile", updatedProfile);
    setForceUpdate(prev => !prev);
  };

  return (
    <div className="contabilization-section">
      <div className="result-header">
        <h2>Conquistas adquiridas:</h2>
        <div className="result-box">
          <p>número de Conquistas: {contabilization.achieves ?? 0}</p>
        </div>
      </div>

      <div className="achievement-section"> 
        {lastAchievs.length > 0 ? (
          lastAchievs.map((achiev, index) => (
            <LastAchievCard 
              key={`achievement-${achiev.id || index}`} 
              achieves={achiev}
              onEdit={handleEditAchievement}
              onDelete={handleDeleteAchievement}
            />
          ))
        ) : (
          <p className="no-battles-message">Nenhuma conquista ativa</p>
        )}
      </div>
    </div>
  );
}