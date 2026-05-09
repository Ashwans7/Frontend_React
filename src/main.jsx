import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Keep Render's free-tier backend alive by pinging it every 14 minutes.
// Render spins down after 15 min of inactivity, causing a ~30s cold start.
const BACKEND = 'https://devdiary-jmqa.onrender.com'
const ping = () => fetch(`${BACKEND}/`).catch(() => {})
ping() // ping immediately on page load
setInterval(ping, 14 * 60 * 1000) // then every 14 minutes

createRoot(document.getElementById('root')).render(
    <App />
)
