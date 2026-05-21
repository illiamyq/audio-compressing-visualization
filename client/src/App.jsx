import { useState, useEffect } from "react";

const MAX_LIVES = 3;

function formatMoney(n) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

const metrics = (s) => [
  { label: "Founded", value: s.foundedYear, icon: "📅" },
  { label: "Employees", value: s.employees.toLocaleString(), icon: "👥" },
  { label: "Funding", value: formatMoney(s.fundingUsd), icon: "💰" },
  { label: "Revenue", value: formatMoney(s.revenueUsd), icon: "📈" },
];

export default function App() {
  const [startup, setStartup] = useState(null);
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState("guessing");
  const [lastCorrect, setLastCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);

  const fetchStartup = async () => {
    setAnimating(true);
    setTimeout(async () => {
      setLoading(true);
      const res = await fetch("http://localhost:3000/startup/random");
      const data = await res.json();
      setStartup(data);
      setPhase("guessing");
      setLastCorrect(null);
      setLoading(false);
      setAnimating(false);
    }, 300);
  };

  useEffect(() => { fetchStartup(); }, []);

  const guess = (outcome) => {
    const correct = outcome === startup.outcome;
    setLastCorrect(correct);
    if (!correct) {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives === 0) { setPhase("gameover"); return; }
    } else {
      setScore(s => s + 1);
    }
    setPhase("revealed");
  };

  const restart = () => {
    setLives(MAX_LIVES);
    setScore(0);
    fetchStartup();
  };

  if (loading && !animating) return (
    <div style={styles.screen}>
      <div style={styles.loader}>
        <div style={styles.loaderDot} />
        <div style={{ ...styles.loaderDot, animationDelay: "0.2s" }} />
        <div style={{ ...styles.loaderDot, animationDelay: "0.4s" }} />
      </div>
    </div>
  );

  if (phase === "gameover") return (
    <div style={styles.screen}>
      <div style={styles.gameOverCard}>
        <div style={styles.gameOverEmoji}>💀</div>
        <h1 style={styles.gameOverTitle}>Game Over</h1>
        <p style={styles.gameOverSub}>You correctly guessed</p>
        <div style={styles.finalScore}>{score}</div>
        <p style={styles.gameOverSub}>startup{score !== 1 ? "s" : ""}</p>
        <button style={styles.restartBtn} onClick={restart}
          onMouseEnter={e => e.target.style.background = "#22d3ee"}
          onMouseLeave={e => e.target.style.background = "#06b6d4"}>
          Play Again
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.screen}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 20 }}>

        <div style={styles.header}>
          <div>
            <span style={styles.appTitle}>StartupOrNot</span>
          </div>
          <div style={styles.headerRight}>
            <span style={styles.scoreChip}>⚡ {score}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <span key={i} style={{ fontSize: 18, opacity: i < lives ? 1 : 0.2, transition: "opacity 0.3s" }}>♥</span>
              ))}
            </div>
          </div>
        </div>

        {/* Card */}
        <div style={{ ...styles.card, opacity: animating ? 0 : 1, transition: "opacity 0.3s", animation: !animating ? "fadeIn 0.4s ease" : "none" }}>

          {/* Startup name + tag */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <h2 style={styles.startupName}>{startup?.name}</h2>
              <span style={styles.yearBadge}>{startup?.foundedYear}</span>
            </div>
            <p style={styles.idea}>"{startup?.idea}"</p>
          </div>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Metrics */}
          <div style={styles.metricsGrid}>
            {startup && metrics(startup).map(({ label, value, icon }) => (
              <div key={label} style={styles.metricBox}>
                <span style={styles.metricIcon}>{icon}</span>
                <span style={styles.metricValue}>{value}</span>
                <span style={styles.metricLabel}>{label}</span>
              </div>
            ))}
          </div>

          {/* Reveal panel */}
          {phase === "revealed" && startup && (
            <div style={{ ...styles.revealPanel, borderColor: lastCorrect ? "#10b981" : "#ef4444", background: lastCorrect ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)", animation: "slideIn 0.3s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>{lastCorrect ? "✅" : "❌"}</span>
                <span style={{ color: lastCorrect ? "#10b981" : "#ef4444", fontWeight: 600, fontSize: 15 }}>
                  {lastCorrect ? "Correct!" : "Wrong!"}&nbsp;
                </span>
                <span style={{ color: startup.outcome === "success" ? "#10b981" : "#ef4444", fontSize: 14 }}>
                  This was a {startup.outcome}.
                </span>
              </div>
              <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{startup.explanation}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {phase === "guessing" ? (
          <div style={styles.btnRow}>
            <button style={{ ...styles.guessBtn, ...styles.successBtn }}
              onClick={() => guess("success")}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              ✅ Success
            </button>
            <button style={{ ...styles.guessBtn, ...styles.failBtn }}
              onClick={() => guess("failure")}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              ❌ Failure
            </button>
          </div>
        ) : phase === "revealed" ? (
          <button style={styles.nextBtn} onClick={fetchStartup}
            onMouseEnter={e => e.currentTarget.style.background = "#22d3ee"}
            onMouseLeave={e => e.currentTarget.style.background = "#06b6d4"}>
            Next Startup →
          </button>
        ) : null}
      </div>
    </div>
  );
}

const styles = {
  screen: {
    minHeight: "100vh",
    background: "#09090b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  loader: { display: "flex", gap: 8 },
  loaderDot: {
    width: 8, height: 8, borderRadius: "50%",
    background: "#06b6d4", animation: "pulse 1s infinite",
  },
  header: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
  },
  appTitle: {
    fontSize: 18, fontWeight: 700,
    color: "#06b6d4", letterSpacing: "-0.5px",
  },
  headerRight: { display: "flex", alignItems: "center", gap: 12 },
  scoreChip: {
    background: "rgba(6,182,212,0.12)",
    border: "1px solid rgba(6,182,212,0.3)",
    color: "#06b6d4", fontSize: 13, fontWeight: 600,
    padding: "3px 10px", borderRadius: 20,
  },
  card: {
    background: "#18181b",
    border: "1px solid #27272a",
    borderRadius: 16, padding: 24,
  },
  startupName: {
    fontSize: 22, fontWeight: 700,
    color: "#f4f4f5", margin: 0,
  },
  yearBadge: {
    fontSize: 12, color: "#71717a",
    background: "#27272a", padding: "3px 8px",
    borderRadius: 6, fontWeight: 500,
  },
  idea: {
    fontSize: 14, color: "#71717a",
    fontStyle: "italic", margin: 0, lineHeight: 1.6,
  },
  divider: {
    height: 1, background: "#27272a", margin: "16px 0",
  },
  metricsGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  metricBox: {
    background: "#09090b",
    border: "1px solid #27272a",
    borderRadius: 10, padding: "12px 14px",
    display: "flex", flexDirection: "column", gap: 2,
  },
  metricIcon: { fontSize: 16, marginBottom: 2 },
  metricValue: { fontSize: 18, fontWeight: 700, color: "#f4f4f5" },
  metricLabel: { fontSize: 11, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em" },
  revealPanel: {
    marginTop: 16, borderRadius: 10,
    border: "1px solid", padding: "12px 14px",
  },
  btnRow: { display: "flex", gap: 12 },
  guessBtn: {
    flex: 1, padding: "14px 0",
    fontSize: 15, fontWeight: 600,
    border: "none", borderRadius: 12,
    cursor: "pointer", transition: "transform 0.15s",
  },
  successBtn: { background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" },
  failBtn: { background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" },
  nextBtn: {
    width: "100%", padding: "14px 0",
    background: "#06b6d4", color: "#09090b",
    fontSize: 15, fontWeight: 700,
    border: "none", borderRadius: 12,
    cursor: "pointer", transition: "background 0.15s",
  },
  gameOverCard: {
    background: "#18181b", border: "1px solid #27272a",
    borderRadius: 16, padding: 40,
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: 8, textAlign: "center",
    maxWidth: 360, width: "100%",
  },
  gameOverEmoji: { fontSize: 48, marginBottom: 8 },
  gameOverTitle: { fontSize: 28, fontWeight: 700, color: "#f4f4f5", margin: 0 },
  gameOverSub: { fontSize: 14, color: "#71717a", margin: 0 },
  finalScore: { fontSize: 64, fontWeight: 800, color: "#06b6d4", lineHeight: 1 },
  restartBtn: {
    marginTop: 16, padding: "12px 32px",
    background: "#06b6d4", color: "#09090b",
    fontSize: 15, fontWeight: 700,
    border: "none", borderRadius: 12,
    cursor: "pointer", transition: "background 0.15s",
  },
};