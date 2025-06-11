// Storage/LocalStorage.js

const defaultData = {
  userProfile: {
    profile: {
      profilePic: "https://i.imgur.com/mcyS78U.png",
      nickName: "Eri",
      classification: "o pesadelo noturno"
    },
    statusBar: {
      health: { value: 30, maxValue: 40 },
      stamina: { value: 50, maxValue: 60 },
      lastDecay: new Date().toISOString() // para controle de decadência diária
    },
    statusPower: {
      physical: { xp: 10, level: 5, lastUsed: null },
      mental: { xp: 10, level: 5, lastUsed: null },
      social: { xp: 10, level: 5, lastUsed: null }
    },
    achievements: {
      contabilization: { achieves: 1 },
      lastAchievs: [
        {
          id: 1,
          icon: "https://educacaoeprofissao.com.br/wp-content/uploads/elementor/thumbs/ia-na-educacao-q9b0wih5p9y7n7g39ibq617lgwjq9xm3run4gs14xs.jpg",
          isPrestige: true,
          title: "Analista de Sistemas",
          description: "Após vencer a faculdade, tornou-se graduado."
        }
      ]
    }
  },

  bossBattles: {
    bosses: [
      {
        id: 1,
        bossPic: "https://wallpaperaccess.com/full/806868.jpg",
        bossName: "Demônio da Rotina",
        daily: true,
        active: true,
        description: "Um ser que se alimenta da sua falta de vontade, para derrotá-lo você precisará:",
        health: { value: 30, maxValue: 30 }
      }
    ],
    quests: [
      {
        id: 1,
        text: "Ler 20 páginas de um livro. Ganha 10 xp Mental",
        active: true,
        reward: {
          type: "xp",
          category: "physical",
          value: 5
        }
      }
    ]
  },

  historical: {
    contabilization: { victories: 1, defeats: 0 },
    lastBattles: [
      {
        result: "victory",
        date: "",
        bossPic: "https://m.media-amazon.com/images/I/61zM53X+-rL._AC_SL1000_.jpg",
        bossName: "O medo de ser eterno"
      }
    ]
  }
};

// Funções utilitárias
const decayStatusBar = (statusBar) => {
  const last = new Date(statusBar.lastDecay);
  const now = new Date();
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return {
      ...statusBar,
      lastDecay: now.toISOString(),
      health: {
        ...statusBar.health,
        value: Math.max(0, statusBar.health.value - diffDays * 2)
      },
      stamina: {
        ...statusBar.stamina,
        value: Math.max(0, statusBar.stamina.value - diffDays * 2)
      }
    };
  }

  return statusBar;
};


// Inicialização
export const initLocalStorage = () => {
  if (!localStorage.getItem("userProfile")) {
    localStorage.setItem("userProfile", JSON.stringify(defaultData.userProfile));
  } else {
    const user = JSON.parse(localStorage.getItem("userProfile"));
    user.statusBar = decayStatusBar(user.statusBar);
    localStorage.setItem("userProfile", JSON.stringify(user));
  }
  if (!localStorage.getItem("bossBattles")) {
    localStorage.setItem("bossBattles", JSON.stringify(defaultData.bossBattles));
  }
  if (!localStorage.getItem("historical")) {
    localStorage.setItem("historical", JSON.stringify(defaultData.historical));
  }
  if (!localStorage.getItem("achievements")) {
    localStorage.setItem("achievements", JSON.stringify(defaultData.achievements));
  }

};

export const getData = (key) => {
  const raw = localStorage.getItem(key);
  if (!raw || raw === "undefined") return null;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Erro ao fazer parse da chave "${key}":`, err);
    return null;
  }
};

export const setData = (key, value) => {
  if (value === undefined) {
    console.warn(`Tentativa de salvar valor undefined em "${key}".`);
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
};


export const resetStorage = () => {
  localStorage.clear();
  initLocalStorage();
};

// Utilitários externos
export const updateXP = (category, amount = 1) => {
  const user = getData("userProfile");
  user.statusPower = gainXP(user.statusPower, category, amount);
  setData("userProfile", user);
};

export const applyDecayNow = () => {
  const user = getData("userProfile");
  user.statusBar = decayStatusBar(user.statusBar);
  setData("userProfile", user);
};

export const recalculateBossHealth = (bossId) => {
    const data = getData("bossBattles");
    const quests = data.quests.filter(q => q.bossId === bossId);
    const completed = quests.filter(q => q.completed).length;

    const maxValue = Math.max(10, quests.length * 10);
    const value = Math.max(0, maxValue - completed * 10);

    const updatedBosses = data.bosses.map(boss => {
        if (boss.id === bossId) {
            return {
                ...boss,
                health: { value, maxValue },
                active: value > 0
            };
        }
        return boss;
    });

    setData("bossBattles", { ...data, bosses: updatedBosses });
    
    return { value, maxValue };
};

export const addQuestToBoss = (bossId, text, reward = { text: "", value: 10 }) => {
  const data = getData("bossBattles");
  const lastId = data.quests.reduce((max, q) => Math.max(max, q.id), 0);
  const newId = lastId + 1;

  const newQuest = {
    id: newId,
    bossId,
    text,
    reward,
    active: true,
    completed: false
  };

  const updatedQuests = [...data.quests, newQuest];

  setData("bossBattles", { ...data, quests: updatedQuests });
  recalculateBossHealth(bossId);
};

export const toggleQuestCompletion = (questId) => {
  const data = getData("bossBattles");

  const updatedQuests = data.quests.map(q => {
    if (q.id === questId) {
      return { ...q, completed: !q.completed };
    }
    return q;
  });

  setData("bossBattles", { ...data, quests: updatedQuests });

  const updatedQuest = updatedQuests.find(q => q.id === questId);
  if (updatedQuest) {
    recalculateBossHealth(updatedQuest.bossId);
    if (updatedQuest.completed) {
      applyQuestReward(updatedQuest);
    }
  }
};

export function deleteBoss(bossId) {
  const data = getData("bossBattles");
  if (!data) return;

  const updatedBosses = data.bosses.filter(boss => boss.id !== bossId);
  
  const updatedQuests = data.quests.filter(quest => quest.bossId !== bossId);
  
  setData("bossBattles", {
    ...data,
    bosses: updatedBosses,
    quests: updatedQuests
  });
  
  return true;
}

export const deleteQuest = (questId) => {
  const data = getData("bossBattles");

  const filteredQuests = data.quests.filter(q => q.id !== questId);

  const renumberedQuests = filteredQuests.map((q, index) => ({
    ...q,
    id: index + 1
  }));

  setData("bossBattles", { ...data, quests: renumberedQuests });
};


export function addBoss(newBoss) {
    try {
        const data = getData("bossBattles") || { bosses: [], quests: [] };

        const getNextBossId = () => {
            const validBosses = data.bosses.filter(b => typeof b.id === 'number');
            if (validBosses.length === 0) return 1;
            return Math.max(...validBosses.map(b => b.id)) + 1;
        };

        const bossWithId = {
            ...newBoss,
            id: getNextBossId(), 
            createdAt: new Date().toISOString(),
            health: { 
                value: newBoss.daily ? 30 : 10,
                maxValue: newBoss.daily ? 30 : 10 
            },
            active: true
        };

        data.bosses.push(bossWithId);
        localStorage.setItem("bossBattles", JSON.stringify(data));
        
        return bossWithId;
    } catch (error) {
        console.error("Erro ao adicionar boss:", error);
        return null;
    }
}


export const updateBoss = (bossId, updates) => {
  const data = getData("bossBattles");
  const bossIndex = data.bosses.findIndex(b => b.id === bossId);

  if (bossIndex !== -1) {
    data.bosses[bossIndex] = {
      ...data.bosses[bossIndex],
      ...updates
    };
    setData("bossBattles", data);
  }
};

export const applyQuestReward = (quest) => {
  const user = getData("userProfile");

  if (!user) {
    console.error("Usuário não encontrado no localStorage");
    return;
  }

  if (!quest || !quest.reward || !quest.reward.type) {
    console.warn("Recompensa da missão inválida");
    return;
  }

  const { type, value, category } = quest.reward;

  if (type === "xp" && category) {
    if (!user.statusPower || !user.statusPower[category]) {
      console.warn(`Categoria inválida: ${category}`);
      return;
    }
    user.statusPower = gainXP(user.statusPower, category, value);
  }

  if (type === "health") {
    user.statusBar.health.value = Math.min(
      user.statusBar.health.value + value,
      user.statusBar.health.maxValue
    );
  }

  if (type === "stamina") {
    user.statusBar.stamina.value = Math.min(
      user.statusBar.stamina.value + value,
      user.statusBar.stamina.maxValue
    );
  }

  setData("userProfile", user);
};

const gainXP = (statusPower, category, value) => {
  if (!statusPower[category]) {
    console.warn(`Categoria "${category}" não encontrada em statusPower`);
    return statusPower;
  }

  statusPower[category].xp += value;

  if (statusPower[category].xp >= 100) {
    statusPower[category].level += 1;
    statusPower[category].xp -= 100;
  }

  return statusPower;
};

// Função para finalizar combate de boss diário
export const finalizeDailyBosses = () => {
  const data = getData("bossBattles");
  const historical = getData("historical") || { 
    contabilization: { victories: 0, defeats: 0 },
    lastBattles: [] 
  };

  const dailyBosses = data.bosses.filter(boss => boss.daily);

  dailyBosses.forEach(boss => {
    const bossQuests = data.quests.filter(q => q.bossId === boss.id);
    const allCompleted = bossQuests.length > 0 && bossQuests.every(q => q.completed);
    
    // Registra no histórico
    const result = {
      result: allCompleted ? "victory" : "defeat",
      date: new Date().toISOString(),
      bossPic: boss.bossPic,
      bossName: boss.bossName
    };

    historical.lastBattles.unshift(result);
    if (allCompleted) {
      historical.contabilization.victories += 1;
    } else {
      historical.contabilization.defeats += 1;
    }

    const resetHealth = bossQuests.length * 10;
    
    data.bosses = data.bosses.map(b => 
      b.id === boss.id 
        ? { 
            ...b, 
            health: { value: resetHealth, maxValue: resetHealth },
            active: true
          } 
        : b
    );

    data.quests = data.quests.map(q => 
      q.bossId === boss.id
        ? { ...q, completed: false }
        : q
    );
  });

  setData("bossBattles", data);
  setData("historical", historical);
  
  return dailyBosses.length > 0;
};

// Função para finalizar boss normal
export const finalizeNormalBoss = (bossId) => {
    const data = getData("bossBattles");
    const historical = getData("historical") || { 
        contabilization: { victories: 0, defeats: 0 },
        lastBattles: [] 
    };

    const boss = data.bosses.find(b => b.id === bossId);
    if (!boss || boss.daily || boss.health?.value > 0) {
        return { success: false };
    }
    const result = {
        result: "victory",
        date: new Date().toISOString(),
        bossPic: boss.bossPic,
        bossName: boss.bossName
    };

    historical.lastBattles.unshift(result);
    historical.contabilization.victories += 1;

    const updatedData = {
        ...data,
        bosses: data.bosses.filter(b => b.id !== bossId),
        quests: data.quests.filter(q => q.bossId !== bossId)
    };

    setData("bossBattles", updatedData);
    setData("historical", historical);
    
    return { success: true, boss };
};