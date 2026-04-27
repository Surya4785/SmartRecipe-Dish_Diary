import { useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const INTERVAL_MS = 14 * 60 * 1000; // 14 minutes — just under Render's 15-min sleep threshold

/**
 * Pings the backend /health endpoint every 14 minutes.
 * Prevents Render's free-tier from spinning down due to inactivity.
 */
export default function useKeepAlive() {
  useEffect(() => {
    const ping = () => {
      fetch(`${API}/health`, { method: "GET" }).catch(() => {
        // Silently ignore — server may be starting up
      });
    };

    // Fire once immediately on mount so the server warms up fast on first load
    ping();

    const id = setInterval(ping, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);
}
