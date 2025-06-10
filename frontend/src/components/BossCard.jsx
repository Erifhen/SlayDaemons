import React, { useState, useEffect } from "react";
import {
    getData,
    toggleQuestCompletion,
    addQuestToBoss,
    deleteQuest,
    updateBoss,
    deleteBoss,
    finalizeNormalBoss
} from "../storage/LocalStorage";
import QuestCard from "./QuestCard";
import AchievementForm from "./AchievementForm";

export default function BossCard({ boss, refreshBossData }) {
    const [questsState, setQuestsState] = useState([]);
    const [newQuestText, setNewQuestText] = useState("");
    const [rewardType, setRewardType] = useState("xp");
    const [rewardCategory, setRewardCategory] = useState("physical");
    const [rewardValue, setRewardValue] = useState(5);
    const [isEditing, setIsEditing] = useState(false);
    const [showAchievForm, setShowchievForm] = useState(false);
    const [editForm, setEditForm] = useState({
        bossName: "",
        description: "",
        bossPic: "",
        health: { value: 10, maxValue: 10 }
    });

    useEffect(() => {
        if (boss) {
            const data = getData("bossBattles");
            const filteredQuests = data.quests.filter((q) => q.bossId === boss.id);
            setQuestsState(filteredQuests);

            setEditForm({
                bossName: boss.bossName,
                description: boss.description,
                bossPic: boss.bossPic
            });
        }
    }, [boss]);

    useEffect(() => {
        if (!boss.daily && boss.health?.value <= 0 && boss.active) {
           const result = finalizeNormalBoss(boss.id);
           if(result.success){
            setShowchievForm(true);
            refreshBossData
           }
        }
    }, [boss.health?.value, boss.active]);

    if (!boss) return <div>Boss não encontrado.</div>;

    const isBossAlive = boss.health?.value > 0;

    const handleToggleQuest = (questId) => {
        toggleQuestCompletion(questId);
        refreshBossData();
    };

    const handleDeleteQuest = (questId) => {
        deleteQuest(questId);
        refreshBossData();
    };

    const handleAddQuest = () => {
        if (!newQuestText.trim()) return;

        const reward = boss.daily
            ? {
                type: rewardType,
                value: rewardValue,
                category: rewardType === "xp" ? rewardCategory : null
            }
            : null;

        addQuestToBoss(boss.id, newQuestText.trim(), reward);
        setNewQuestText("");
        refreshBossData();
    };

    const handleEditToggle = () => setIsEditing((prev) => !prev);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = () => {
        updateBoss(boss.id, {
            bossName: editForm.bossName,
            description: editForm.description,
            bossPic: editForm.bossPic
        });
        setIsEditing(false);
        refreshBossData();
    };

    const handleDeleteBoss = () => {
        if (window.confirm("Tem certeza que deseja excluir este Daemon?")) {
            deleteBoss(boss.id);
            refreshBossData();
        }
    };


    return (
        <div className={`boss-card ${!isBossAlive ? "defeated" : "active"}`}>
            <div className="boss-card-header"></div>
            <div className="boss-card-content">
                <div className="boss-left">
                    <div className="boss-pic-frame">
                        <img src={editForm.bossPic || "default-boss.png"} alt="boss" />
                        {isEditing && (
                            <input
                                type="text"
                                name="bossPic"
                                value={editForm.bossPic}
                                onChange={handleEditChange}
                                placeholder="URL da imagem"
                                className="boss-pic-input"
                            />
                        )}
                    </div>
                    <div className="boss-type-icon">{boss.daily ? "☀️" : "⏳"}</div>

                    <div className="boss-edit-controls">
                        <button
                            onClick={handleEditToggle}
                            className={`edit-boss-btn ${isEditing ? "cancel" : "edit"}`}
                        >
                            {isEditing ? "Cancelar" : "Editar Boss"}
                        </button>
                        {isEditing && (
                            <>
                                <button onClick={handleSaveEdit} className="save-boss-btn">
                                    Salvar
                                </button>
                                <button onClick={handleDeleteBoss} className="delete-boss-btn">
                                    Excluir
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="boss-right">
                    <div className="boss-info">
                        {isEditing ? (
                            <input
                                type="text"
                                name="bossName"
                                value={editForm.bossName}
                                onChange={handleEditChange}
                                className="boss-name-edit"
                            />
                        ) : (
                            <div className="boss-name">{editForm.bossName}</div>
                        )}
                        <div className="boss-health">
                            <div className="health-bar">
                                <div
                                    className="health-fill"
                                    style={{
                                        width: `${(boss.health.value / boss.health.maxValue) * 10}%`,
                                    }}
                                ></div>
                            </div>
                            <span>
                                {boss.health.value} / {boss.health.maxValue}
                            </span>
                        </div>
                    </div>

                    {isEditing ? (
                        <textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            className="boss-description-edit"
                        />
                    ) : (
                        <p className="boss-description">{editForm.description}</p>
                    )}

                    <div className="quest-list">
                        {questsState.map((quest) => (
                            <QuestCard
                                key={quest.id}
                                quest={quest}
                                onToggle={handleToggleQuest}
                                onDelete={handleDeleteQuest}
                                disabled={!isBossAlive}
                            />
                        ))}
                    </div>

                    <div className="add-quest">
                        <input
                            type="text"
                            placeholder="Nova missão..."
                            value={newQuestText}
                            onChange={(e) => setNewQuestText(e.target.value)}
                        />
                        {boss.daily && (
                            <div className="reward-fields">
                                <select
                                    value={rewardType}
                                    onChange={(e) => setRewardType(e.target.value)}
                                >
                                    <option value="xp">XP</option>
                                    <option value="health">Saúde</option>
                                    <option value="stamina">Estamina</option>
                                </select>

                                {rewardType === "xp" && (
                                    <select
                                        value={rewardCategory}
                                        onChange={(e) => setRewardCategory(e.target.value)}
                                    >
                                        <option value="physical">Físico</option>
                                        <option value="mental">Mental</option>
                                        <option value="social">Social</option>
                                    </select>
                                )}

                                <input
                                    type="number"
                                    min={1}
                                    value={rewardValue}
                                    onChange={(e) => setRewardValue(Number(e.target.value))}
                                />
                            </div>
                        )}

                        <button onClick={handleAddQuest}>Adicionar</button>

                    </div>
                </div>
            </div>
            {showAchievForm && (
                <AchievementForm onClose={(sucess) => {
                    setAchievForm(false);
                    if (sucess) {
                        refreshBossData();
                    }
                }}
                />
            )}
        </div>
    );
}
