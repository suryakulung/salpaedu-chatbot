# AI Chatbot System

A full-stack AI Chatbot for your website, capable of RAG (Retrieval-Augmented Generation), Lead Capture, and Admin Management.

## Structure
- `server/`: Node.js Express Backend (Port 5000)
- `admin/`: React Admin Dashboard (Port 5173)
- `widget/`: Vanilla JS Embeddable Widget
- `docker-compose.yml`: Deployment config

## Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or Atlas URI)
- OpenAI API Key

## Quick Start (Local)

### 1. Setup Backend
```bash
cd server
npm install
# Edit .env and add your OPENAI_API_KEY
npm run seed  # Trains the bot on your index.html
npm run dev
```

### 2. Setup Admin
```bash
cd admin
npm install
npm run dev
```
Access Admin at: http://localhost:5173
Login Password (Default): `admin123`

### 3. Embed Widget
Add the following to your `index.html` before `</body>`:
```html
<link rel="stylesheet" href="./chatbot/widget/chatbot.css">
<script src="./chatbot/widget/chatbot.js"></script>
```

## Deployment (Docker)
1. Ensure Docker is installed.
2. Update `.env` in `server/` with production keys.
3. Run:
```bash
docker-compose up --build -d
```

## Features
- **AI Response**: Answers questions based on your website content.
- **Admin Panel**: View history, manage knowledge base, export leads.
- **Leads**: Collects user info (optional flow).
- **History**: Conversational memory.
