import LastBattleCard from "./LastBattleCard";

export default function HistoricalCard({ historicalData }) {
    if (!historicalData) {
        return <p className="loading-message">Carregando dados históricos...</p>;
    }

    // Correção: tinha erros de digitação nos nomes das propriedades
    const contabilization = historicalData.contabilization || { victories: 0, defeats: 0 };
    const lastBattles = historicalData.lastBattles || [];

    return (
        <div className="contabilization-section">
            <div className="result-header">
                <h2>Histórico de Batalhas</h2>
                <div className="result-box">
                    <p>Vitórias: {contabilization.victories ?? 0}</p>
                    <p>Derrotas: {contabilization.defeats ?? 0}</p>
                </div>
            </div>

            <div className="historical-section">
                {lastBattles.length > 0 ? (
                    lastBattles.map((battle, index) => (
                        <LastBattleCard key={`battle-${index}`} battle={battle} />
                    ))
                ) : (
                    <p className="no-battles-message">Nenhuma batalha registrada</p>
                )}
            </div>
        </div>
    );
}