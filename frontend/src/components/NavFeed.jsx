export default function NavFeed({ activeFeed, setActiveFeed }) {
    return (
        <div className="nav-feed">
            <button 
                className={activeFeed === "batalhas" ? "active" : ""} 
                onClick={() => setActiveFeed("batalhas")}
            >
                Batalhas
            </button>
            <button 
                className={activeFeed === "historico" ? "active" : ""} 
                onClick={() => setActiveFeed("historico")}
            >
                Histórico
            </button>
            <button 
                className={activeFeed === "conquistas" ? "active" : ""} 
                onClick={() => setActiveFeed("conquistas")}
            >
                Conquistas
            </button>
        </div>
    );
}
