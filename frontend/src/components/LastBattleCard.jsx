export default function LastBattleCard({ battle }) {
    if (!battle) {
        return <div className="battle-error">Dados da batalha inválidos</div>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return "Data não registrada";
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return "Data inválida";
            }
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        } catch (error) {
            console.error("Erro ao formatar data:", error);
            return "Erro na data";
        }
    };

    const getResultText = () => {
        if (!battle.result) return "Resultado desconhecido";
        
        return {
            victory: "Vitória",
            defeat: "Derrota"
        }[battle.result] || battle.result;
    };

    return (
        <div className="battle-card-box">
            <div className="battle-left">
                <h2>Resultado: {getResultText()}</h2>
                <p>Data: {formatDate(battle.date)}</p>
                {battle.bossName && <p>Boss: {battle.bossName}</p>}
            </div>
            <div className="battle-right">
                <div className="boss-pic-frame">
                    {battle.bossPic ? (
                        <img 
                            className="boss-pic" 
                            src={battle.bossPic} 
                            alt={battle.bossName || "Boss"} 
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = 'placeholder-boss.jpg';
                            }}
                        />
                    ) : (
                        <p>Sem imagem</p>
                    )}
                </div>
            </div>
        </div>
    );
}