# 🤖 AuraChat — Intelligent AI Chat Assistant

An intelligent, real-time AI Chat Assistant application built with **React**, **Vite**, **Tailwind CSS**, **Node.js/Express**, **MongoDB (Mongoose)**, and the official **Anthropic Claude API**.

---

## ✨ Features

### 🖥️ Frontend UI
- **Scrollable Chat Interface**: Elegant conversation stream with distinct, beautifully styled chat bubbles for user messages (gradient indigo/violet) and Claude AI responses (clean slate card with markdown formatting).
- **Light & Dark Mode**: Instant, persistent theme toggle with smooth transitions matching system preference or manual user choice.
- **Real-Time Character-by-Character Streaming**: Server-Sent Events (SSE) deliver tokens in real time with an animated blinking typewriter cursor and smooth auto-scrolling.
- **Conversation History Sidebar**:
  - Automatically records and groups past conversation threads chronologically (*Today*, *Yesterday*, *Previous 7 Days*, *Older*).
  - Quick Search bar to filter conversations by title or topic.
  - One-click New Chat button.
  - Inline conversation thread renaming and deletion.
  - Collapsible on desktop and mobile drawer friendly.
- **Dynamic Tone Toggle**:
  - Segmented control to switch between **👔 Professional**, **☕ Casual**, and **⚡ Concise** tones.
  - Updates the backend system instruction modifier on the fly, immediately altering Claude's response persona.
- **Rich Markdown & Code Highlighting**: Supports markdown tables, lists, blockquotes, and fenced code blocks with language indicators and one-click "Copy Code" buttons.

### ⚙️ Backend Logic & Architecture
- **Claude API Integration**: Powered by `@anthropic-ai/sdk` with real-time SSE token streaming (`messages.stream`).
- **Tone System Instruction Modifier**: Automatically injects dynamic persona directives to the Claude system prompt:
  - **Professional**: Formal, articulate, authoritative, structured explanations for enterprise & academic inquiry.
  - **Casual**: Warm, friendly, conversational, relatable phrasing with natural dialogue and emojis.
  - **Concise**: Razor-sharp, brief answers in minimal words with zero fluff or preamble.
- **MongoDB Persistence**:
  - Full Mongoose schema storing complete conversation objects with `createdAt`, `updatedAt`, `tone`, user prompts, AI responses, and individual message timestamps.
  - **Zero-Friction Fallback**: Includes a transparent local document store fallback if local MongoDB is not yet running, ensuring immediate out-of-the-box functionality without crashes.
- **RESTful Endpoints & SSE**:
  - `GET /api/health` — Diagnostics for database connection, Claude API key status, and available tones.
  - `GET /api/conversations` — Retrieves all saved threads with metadata.
  - `GET /api/conversations/:id` — Fetches complete conversation with full message history and timestamps.
  - `POST /api/conversations` — Creates a new conversation thread.
  - `POST /api/chat/stream` — Real-time Server-Sent Events (SSE) streaming endpoint that processes prompt with tone modifiers and persists results.
  - `PATCH /api/conversations/:id/tone` — Updates tone preference for a thread.
  - `PATCH /api/conversations/:id/title` — Renames a conversation thread.
  - `DELETE /api/conversations/:id` — Deletes a thread.
  - `DELETE /api/conversations` — Clears all threads.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection URI)
- **Anthropic Claude API Key** (Optional for testing; required for live Claude 3.5 Sonnet responses)

### 1. Configure Environment Variables
Inside `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_chat_assistant
ANTHROPIC_API_KEY=your_anthropic_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022
```

> **Note**: If `ANTHROPIC_API_KEY` is not provided, the assistant automatically runs a smart tone-aware simulated streaming engine so you can immediately test the UI, streaming typewriter, tone switching, and MongoDB persistence!

### 2. Run the Application
You can start both backend and frontend concurrently from the root directory:

```bash
# Start backend and frontend simultaneously
npm run dev
```

Or run each service individually:
```bash
# Terminal 1: Backend (Express server on http://localhost:5000)
npm run dev:backend

# Terminal 2: Frontend (Vite server on http://localhost:5173)
npm run dev:frontend
```

Open your browser at **`http://localhost:5173`**.

---

## 📂 Project Structure

```
vibecode/
├── backend/
│   ├── .data/                    # Fallback persistent storage if MongoDB is offline
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # Mongoose connection & fallback repository
│   │   ├── models/
│   │   │   └── Conversation.js   # MongoDB Conversation & Message schemas
│   │   ├── routes/
│   │   │   └── chatRoutes.js     # REST & SSE streaming endpoints
│   │   ├── services/
│   │   │   └── claudeService.js  # Claude API streaming & Tone System Instructions
│   │   └── server.js             # Express app & static file serving
│   ├── .env                      # Environment configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBubble.jsx    # Distinct user & AI message bubbles
│   │   │   ├── ChatInput.jsx     # Auto-expanding textarea & send controls
│   │   │   ├── EmptyState.jsx    # Welcome screen with prompt starter cards
│   │   │   ├── Header.jsx        # Navigation, Tone selector, Theme toggle
│   │   │   ├── Sidebar.jsx       # History sidebar with search & actions
│   │   │   ├── ThemeToggle.jsx   # Light / Dark mode toggle
│   │   │   ├── ToneSelector.jsx  # Professional, Casual, Concise switcher
│   │   │   └── TypewriterMessage.jsx # Real-time streaming character display
│   │   ├── context/
│   │   │   └── ThemeContext.jsx  # Dark/Light theme state & localStorage
│   │   ├── App.jsx               # Main container & SSE stream orchestrator
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Tailwind base & custom scrollbar
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── README.md
└── package.json                  # Root runner scripts
```

---

## 🎯 Tone Directives Reference

| Tone | Emoji | System Directive Description |
| :--- | :---: | :--- |
| **Professional** | 👔 | Formal, polite, authoritative tone suitable for business and research. Uses clean structure and formal terminology. |
| **Casual** | ☕ | Friendly, approachable, conversational tone with everyday idioms, relatable examples, and appropriate emojis. |
| **Concise** | ⚡ | Razor-sharp, high-density brevity. Strips all pleasantries, preambles, and filler. Uses bullet points or single punchy sentences. |

---

## 📄 License
ISC
