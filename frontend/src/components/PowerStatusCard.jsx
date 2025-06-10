import React from "react";
import { getData } from "../storage/LocalStorage";

export default function PowerStatusCard( ) {
    const data = getData("userProfile");

    if (!data || !data.statusPower) {
        return <p>Erro ao carregar os status</p>;
    }

    const { physical, mental, social } = data.statusPower;

    const powers = [
        { name: "Físico", level: physical.level, xp: physical.xp, color: "var(--physical-power)" },
        { name: "Mental", level: mental.level, xp: mental.xp, color: "var(--mental-power)" },
        { name: "Social", level: social.level, xp: social.xp, color: "var(--social-power)" }
    ];

    return (
        <div className="power-container">
            {powers.map((power, id) => (
                <div key={id} className="power-card">
                    <p className="power-name">{power.name}</p>
                    <p className="power-value" style={{ color: power.color }}>{power.level}</p>
                    <div className="power-xp-bar">
                        <div 
                            className="power-xp-fill"
                            style={{ 
                                width: `${(power.xp % 100)}%`, 
                                backgroundColor: power.color 
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}