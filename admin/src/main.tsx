import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import axios from 'axios';

// Set global base URL
// Use environment variable if available (Production), otherwise fallback to relative path (Local Proxy)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api';
console.log('API Base URL set to:', axios.defaults.baseURL);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
