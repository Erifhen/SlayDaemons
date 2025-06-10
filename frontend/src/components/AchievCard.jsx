import LastAchievCard from "./lastAchievCard";

export default function AchievCard({ achievementData }) {
    if (!achievementData) {
        return <p className="loading-message">Erro ao carregar dados de Conquistas...</p>;
    }

    const contabilization = achievementData.contabilization || { achieves: 0 };
    const lastAchievs = achievementData.lastAchievs || [];

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
                        <LastAchievCard key={`battle-${index}`} achieves={achiev} />
                    ))
                ) : (
                    <p className="no-battles-message">Nenhuma conquista ativa</p>
                )}
            </div>
        </div>
    );
}