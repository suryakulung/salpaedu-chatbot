import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import axios from 'axios';

axios.defaults.baseURL = "https://chatbot-server-v4cu.onrender.com/api";


// Set global base URL
// Use environment variable if available (Production), otherwise fallback to relative path (Local Proxy)


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
