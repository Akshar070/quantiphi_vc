# 🤖 OSAKA — AI Chat Assistant

An intelligent, real-time AI Chat Assistant application built with **React**, **Vite**, **Tailwind CSS**, **Node.js/Express**, **MongoDB (Mongoose)**, and multi-model support (**Anthropic Claude API**, **Google Gemini API**, and an internal **Intelligent Knowledge Engine**).

---

## ✨ Features

### 🖥️ Frontend UI & Custom Design System
- **Executive Styling & Custom Dual Themes**:
  - **Dark Mode**: Designed in **Deep Navy Blue** (`#070d1e`, `#0a132c`, `#0d1838`, `#12204c`), with all text in **Pure White** and **Warm Beige** (`#f4eee3`, `#cfc3b0`), and obsidian black accents.
  - **Light Mode**: Warm creamy **Beige** (`#f8f5ee`), clean porcelain **White** panels, and vibrant **Orange accents** (`#ea580c` / `#f97316`).
  - **Instant Theme Toggle**: Smooth, persistent switching between Light and Dark modes stored in `localStorage` and matching system preference.
- **Real-Time Token Streaming**: Server-Sent Events (SSE) deliver character-by-character responses with a blinking typewriter cursor and auto-scrolling.
- **Scrollable Chat Interface**: Elegant conversation stream with distinct chat bubbles for user messages and OSAKA AI responses.
- **Conversation History Sidebar**:
  - Automatically records and groups past conversation threads chronologically (*Today*, *Yesterday*, *Previous 7 Days*, *Older*).
  - Quick Search bar to filter conversations by title or topic.
  - One-click New Conversation button.
  - Inline conversation thread renaming and deletion.
  - Collapsible on desktop and mobile drawer friendly.
- **Dynamic Persona & Tone Switcher**:
  - Segmented control to toggle between **👔 Professional**, **☕ Casual**, and **⚡ Concise** tones.
  - Updates the backend system instruction modifier in real time, immediately altering OSAKA's output style.
- **Rich Markdown & Syntax Highlighting**: Supports GitHub Flavored Markdown (tables, lists, blockquotes) and fenced code blocks with language indicators and one-click "Copy Code" buttons.

### ⚙️ Backend Logic & AI Architecture
- **Multi-Model Provider Support**:
  - **Anthropic Claude**: Streaming via `@anthropic-ai/sdk` (`claude-3-5-sonnet-20241022` or `claude-3-haiku-20240307`).
  - **Google Gemini**: Native streaming support via `GEMINI_API_KEY` (Free tier from Google AI Studio).
  - **Intelligent Knowledge & Reasoning Engine (`knowledgeEngine.js`)**: An expert domain engine providing comprehensive, production-grade technical answers (Docker, Kubernetes, system architecture, React, Node.js, databases, Python) even when cloud API balances/credits are depleted.
- **Robust Error Handling & Credit Alerts**:
  - Automatically detects Anthropic prepaid credit status (`invalid_request_error: Your credit balance is too low`).
  - Displays a clear status notice with a direct link to top up credits, while immediately providing the complete answer through the domain engine.
- **Tone System Instruction Modifiers**: Automatically injects dynamic persona directives to the system prompt:
  - **Professional**: Formal, articulate, authoritative, structured explanations for enterprise & academic inquiry.
  - **Casual**: Warm, friendly, conversational, relatable phrasing with natural dialogue and analogies.
  - **Concise**: Razor-sharp, high-density answers in minimal words with zero fluff or preamble.
- **MongoDB Persistence & Local Fallback**:
  - Full Mongoose schema storing complete conversation objects with `createdAt`, `updatedAt`, `tone`, user prompts, AI responses, and individual message timestamps.
  - **Zero-Friction Fallback**: Includes a transparent local JSON document store fallback (`backend/.data/conversations.json`) if MongoDB is not running, ensuring immediate out-of-the-box functionality without crashes.
- **RESTful Endpoints & SSE**:
  - `GET /api/health` — Diagnostics for database connection, Claude API key status, Gemini status, and available tones.
  - `GET /api/conversations` — Retrieves all saved threads with metadata.
  - `GET /api/conversations/:id` — Fetches complete conversation with full message history and timestamps.
  - `POST /api/conversations` — Creates a new conversation thread.
  - `POST /api/chat/stream` — Real-time Server-Sent Events (SSE) streaming endpoint that processes prompts with tone modifiers and persists results.
  - `PATCH /api/conversations/:id/tone` — Updates tone preference for a thread.
  - `PATCH /api/conversations/:id/title` — Renames a conversation thread.
  - `DELETE /api/conversations/:id` — Deletes a thread.
  - `DELETE /api/conversations` — Clears all threads.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection URI — optional, local JSON fallback active if offline)
- **Anthropic Claude API Key** or **Google Gemini API Key** (Optional; local intelligent engine responds if keys are absent or out of credits)

### 1. Configure Environment Variables
Inside `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_chat_assistant

# Anthropic Claude API Key (Get from https://console.anthropic.com/)
# Note: Claude API requires prepaid credits at console.anthropic.com/settings/plans
ANTHROPIC_API_KEY=your_anthropic_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# (Optional) Google Gemini API Key - Free tier available at https://aistudio.google.com/app/apikey
# GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Run the Application
Start both backend and frontend concurrently from the root directory:

```bash
# Start backend and frontend simultaneously
npm run dev
```

Or run each service in separate terminals:
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
│   ├── .data/                          # Persistent JSON store fallback if MongoDB is offline
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                   # Mongoose connection & fallback repository
│   │   ├── models/
│   │   │   └── Conversation.js         # MongoDB Conversation & Message schemas
│   │   ├── routes/
│   │   │   └── chatRoutes.js           # REST & SSE streaming endpoints
│   │   ├── services/
│   │   │   ├── claudeService.js        # Multi-model streaming dispatcher & tone modifiers
│   │   │   └── knowledgeEngine.js      # Comprehensive domain reasoning & fallback engine
│   │   └── server.js                   # Express app & static file serving
│   ├── .env                            # Active environment variables
│   ├── .env.example                    # Sample environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBubble.jsx          # User & OSAKA message bubbles with copy actions
│   │   │   ├── ChatInput.jsx           # Auto-expanding textarea & send controls
│   │   │   ├── EmptyState.jsx          # Welcome screen with prompt starter cards
│   │   │   ├── Header.jsx              # Navigation, Tone selector, Theme toggle
│   │   │   ├── Sidebar.jsx             # History sidebar with search & actions
│   │   │   ├── ThemeToggle.jsx         # Light / Dark mode toggle button
│   │   │   ├── ToneSelector.jsx        # Professional, Casual, Concise switcher
│   │   │   └── TypewriterMessage.jsx   # Real-time streaming token display
│   │   ├── context/
│   │   │   └── ThemeContext.jsx        # Dark/Light theme state & localStorage
│   │   ├── App.jsx                     # Main layout & SSE stream orchestrator
│   │   ├── main.jsx                    # React entry point
│   │   └── index.css                   # Custom Navy & Beige theme system & scrollbar
│   ├── index.html                      # HTML entry with OSAKA branding
│   ├── vite.config.js                  # Vite configuration with API proxying
│   ├── tailwind.config.js              # Custom Tailwind configuration
│   └── package.json
├── README.md
└── package.json                        # Root runner scripts
```

---

## 🎯 Tone Directives Reference

| Tone | Emoji | System Directive Description |
| :--- | :---: | :--- |
| **Professional** | 👔 | Formal, polite, authoritative tone suitable for enterprise and research. Uses structured sections, tables, and production-grade code. |
| **Casual** | ☕ | Friendly, approachable, conversational tone with everyday idioms, relatable analogies, and natural dialogue. |
| **Concise** | ⚡ | Razor-sharp, high-density brevity. Strips all pleasantries, preambles, and filler. Uses bullet points or punchy summaries. |

---

## 🎨 Theme Color Palette

| Mode | Primary Surfaces | Accent & Borders | Typography |
| :--- | :--- | :--- | :--- |
| **Dark Mode** | Midnight Navy (`#070d1e`, `#0a132c`, `#0d1838`) | Deep Navy Borders (`#182b62`, `#233d87`) | Pure White (`#ffffff`) & Warm Beige (`#f4eee3`, `#cfc3b0`) |
| **Light Mode** | Soft Creamy Beige (`#f8f5ee`, `#fdfbf7`) & White | Warm Beige Borders (`#e3d7c3`) & Vibrant Orange (`#ea580c`) | Deep Charcoal Stone (`#1c1917`, `#292524`) |

---

## 📄 License
ISC
