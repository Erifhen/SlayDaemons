import { useState } from "react";
import { getData, setData } from "../storage/LocalStorage";

export default function ({ onClose }) {

    const getNextId = () => {
        const data = getData("userProfile");
        const lastAchievs = data?.achievements?.lastAchievs || [];
        if (lastAchievs.length === 0) return 1;
        return Math.max(...lastAchievs.map(a => a.id)) + 1;
    };


    const [achievement, setAchievement] = useState({
        id: getNextId(),
        icon: "",
        isPrestige: false,
        title: "",
        description: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!achievement.title.trim() || !achievement.description.trim()) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        const data = getData("userProfile");
        if (!data) return;

        const updatedAchievements = {
            contabilization: {
                achieves: (data.achievements?.contabilization?.achieves || 0) + 1
            },
            lastAchievs: [
                achievement,
                ...(data.achievements?.lastAchievs || [])
            ]
        };

        setData("userProfile", {
            ...data,
            achievements: updatedAchievements
        });

        onClose(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAchievement(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="achievement-form-overlay">
            <div className="achievement-form">
                <h2>Criar Nova Conquista</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>
                            Ícone (URL):
                            <input
                                type="text"
                                name="icon"
                                value={achievement.icon}
                                onChange={handleChange}
                                placeholder="https://exemplo.com/imagem.jpg"
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="isPrestige"
                                checked={achievement.isPrestige}
                                onChange={handleChange}
                            />
                            <span>Conquista de Prestígio</span>
                        </label>
                    </div>

                    <div className="form-group">
                        <label>
                            Título: *
                            <input
                                type="text"
                                name="title"
                                value={achievement.title}
                                onChange={handleChange}
                                placeholder="Título da conquista"
                                required
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        <label>
                            Descrição: *
                            <textarea
                                name="description"
                                value={achievement.description}
                                onChange={handleChange}
                                placeholder="Descreva sua conquista"
                                required
                                rows={4}
                            />
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            Criar Conquista
                        </button>
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="btn-secondary"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}