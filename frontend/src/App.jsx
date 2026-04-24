import { useEffect, useState } from "react";
import "./App.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line
} from "recharts";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/report");
      const json = await res.json();

      setData(json);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();

    const interval = setInterval(() => {
      fetchReport();
    }, 60000); // auto refresh every 60 sec

    return () => clearInterval(interval);
  }, []);

  if (!data) return <h1>Loading Morning Pulse Dashboard...</h1>;

  const comp = data.competitor_updates.length;
  const pain = data.user_pain_points.length;
  const trend = data.emerging_trends.length;

  const barData = [
    { name: "Competitors", value: comp },
    { name: "Pain Points", value: pain },
    { name: "Trends", value: trend }
  ];

  const lineData = [
    { day: "Mon", score: data.trend_momentum[0] },
    { day: "Tue", score: data.trend_momentum[1] },
    { day: "Wed", score: data.trend_momentum[2] },
    { day: "Thu", score: data.trend_momentum[3] },
    { day: "Fri", score: data.trend_momentum[4] }
  ];

  return (
    <div className="container">

      <h1>🚀 Morning Pulse Dashboard</h1>
      <p className="subtitle">Live AI Market Intelligence Engine</p>

      {/* Morning Brief */}
      <div className="brief-card">
        <h2>☀️ Today’s Morning Brief</h2>

        <p>{data.summary}</p>

        <p><b>Based on {data.source_count} live sources</b></p>

        <p>Last Updated: {data.last_updated}</p>

        <p>Auto Refresh: Every 60 sec</p>

        <p className="stable">🟢 Real-Time Dynamic Feed Enabled</p>
      </div>

      {/* Buttons */}
      <div className="top-buttons">
        <button onClick={fetchReport}>
          {loading ? "Refreshing..." : "Refresh Now"}
        </button>

        <a href="http://127.0.0.1:8000/download">
          <button>Download Report</button>
        </a>
      </div>

      {/* Metrics */}
      <div className="metrics">
        <div className="metric">Competitors: {comp}</div>

        <div className="metric">Pain Points: {pain}</div>

        <div className="metric">Trends: {trend}</div>

        <div className="metric">
          AI Adoption: {data.ai_adoption_score}%
        </div>
      </div>

      {/* Sentiment */}
      <div className="sentiment">
        📊 Market Sentiment:
        <span> {data.market_sentiment}</span>
      </div>

      {/* Bar Chart */}
      <div className="chart-box">
        <h2>📊 Category Distribution</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Chart */}
      <div className="chart-box">
        <h2>📈 Trend Momentum</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recommended Actions */}
      <div className="actions">
        <h2>🎯 Recommended Actions</h2>

        {data.recommended_actions.map((item, i) => (
          <p key={i}>• {item}</p>
        ))}
      </div>

      {/* Main Cards */}
      <div className="grid">

        <div className="card blue">
          <h2>📈 Competitor Updates</h2>

          {data.competitor_updates.map((item, i) => (
            <p key={i}>• {item}</p>
          ))}
        </div>

        <div className="card red">
          <h2>😓 User Pain Points</h2>

          {data.user_pain_points.map((item, i) => (
            <p key={i}>• {item}</p>
          ))}
        </div>

        <div className="card green">
          <h2>🚀 Emerging Trends</h2>

          {data.emerging_trends.map((item, i) => (
            <p key={i}>• {item}</p>
          ))}
        </div>

      </div>

      {/* Footer */}
      <footer>
        Morning Pulse AI © 2026 | Sources: Google News RSS | Gemini 2.5 Flash
      </footer>

    </div>
  );
}

export default App;