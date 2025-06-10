import BossCard from "./BossCard";
import { useState } from "react";
import { addBoss } from "../storage/LocalStorage";

export default function BossArea({ bossData, refreshBossData }) {
    const [isCreating, setIsCreating] = useState(false);
    const [newBoss, setNewBoss] = useState({
        bossName: "",
        description: "",
        bossPic: "",
        daily: false
    });

    if (!bossData) {
        return <p className="loading-message">Carregando dados do Boss...</p>;
    }

    const bosses = bossData.bosses || [];

    const handleCreateBoss = () => {
        if (!newBoss.bossName.trim()) {
            alert("O boss precisa ter um nome!");
            return;
        }

        addBoss({
            ...newBoss,
            active: true,
            health: { value: 0, maxValue: 0 } // Inicia com 0 de vida
        });
        refreshBossData();
        setIsCreating(false);
        setNewBoss({
            bossName: "",
            description: "",
            bossPic: "",
            daily: false
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewBoss(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="contabilization-section">
            <h2>Batalhas em andamento</h2>
            {bosses.length > 0 ? (
                bosses.map((boss) => (
                    <BossCard
                        key={`boss-${boss.id}`}
                        boss={boss}
                        refreshBossData={refreshBossData}
                    />
                ))
            ) : (
                <p className="no-battles-message">Nenhum Daemon para enfrentar...</p>
            )}

            {isCreating ? (
                <div className="boss-creation-form">
                    <h3>Criar Novo Daemon</h3>
                    <input
                        type="text"
                        name="bossName"
                        value={newBoss.bossName}
                        onChange={handleInputChange}
                        placeholder="Nome do Boss"
                        required
                    />
                    <textarea
                        name="description"
                        value={newBoss.description}
                        onChange={handleInputChange}
                        placeholder="Descrição"
                    />
                    <input
                        type="text"
                        name="bossPic"
                        value={newBoss.bossPic}
                        onChange={handleInputChange}
                        placeholder="URL da imagem (opcional)"
                    />
                    <label className="daily-boss-check">
                        <input
                            type="checkbox"
                            name="daily"
                            checked={newBoss.daily}
                            onChange={handleInputChange}
                        />
                        Boss Diário
                    </label>
                    <div className="form-buttons">
                        <button onClick={handleCreateBoss}>Criar</button>
                        <button onClick={() => setIsCreating(false)}>Cancelar</button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setIsCreating(true)}>Criar novo Daemon</button>
            )}
        </div>
    );
}