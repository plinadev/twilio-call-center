# ☎️ Twilio Call Center App

This project is a **real-time call center web application** built with **Twilio**, **Express**, **React**, and **Socket.io**.
It allows agents to **log in**, **receive or make calls**, and **handle real-time communication events** — all powered by the **Twilio Voice API** and **Twilio Client SDK**.

---

## 🚀 Features

* 📞 Browser-based calling using **Twilio Client**
* 🔐 Secure **2-step authentication** (login + verification code)
* ⚡ Real-time communication via **Socket.io**
* 🌍 Public webhook testing through **LocalTunnel**
* 💅 Modern React frontend styled with **TailwindCSS**
* 🧠 JWT-based session authentication
* 🧩 TypeScript support on both client and server

---

## 🧱 Tech Stack

| Layer     | Technology                      |
| --------- | ------------------------------- |
| Frontend  | React 19, Vite, TailwindCSS     |
| Backend   | Node.js, Express                |
| Realtime  | Socket.io                       |
| Telephony | Twilio Voice API, Twilio Client |
| Auth      | JSON Web Tokens (JWT)           |
| Tunnel    | LocalTunnel                     |
| Language  | TypeScript                      |

---

## 📂 Project Structure

```
twilio-call-center/
├── backend/
│   ├── src/
│   │   ├── index.ts             # Express server entry point
│   │   ├── routes/              # Login, verification, and Twilio webhook routes
│   │   └── utils/               # JWT, token generation, and Twilio helpers
│   ├── .env                     # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main React component
│   │   ├── pages/               # Login and call UI screens
│   │   ├── components/          # Dialer, incoming call modal, etc.
│   │   └── hooks/               # Twilio and socket logic
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
└── README.md
```

---

## ⚙️ Backend Setup

### 1. Navigate to backend

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_API_KEY=your_twilio_api_key
TWILIO_API_SECRET=your_twilio_api_secret
SESSION_SECRET=your_secret_key
PORT=3001
```

### 4. Run the server

```bash
npm run dev
```

The backend will start at:

```
http://localhost:3001
```

---

## 🌍 Expose Your Server (for Twilio Webhooks)

You’ll need a **publicly accessible URL** for Twilio to send call events.

Run:

```bash
npx localtunnel --port 3001
```

You’ll get a URL like:

```
https://your-subdomain.loca.lt
```

Use this URL in your [Twilio Console → Voice Webhooks](https://www.twilio.com/console/voice/settings):

```
Voice & Fax → A Call Comes In → Webhook → https://your-subdomain.loca.lt/voice
```

---

## 🧩 Backend API Endpoints

| Method | Endpoint              | Description                                |
| ------ | --------------------- | ------------------------------------------ |
| `POST` | `/login`              | Start login flow (sends verification code) |
| `POST` | `/verify?code=767791` | Verify code and return JWT                 |
| `POST` | `/voice`              | Twilio webhook for handling voice calls    |

---

### 🧠 Example Login Flow

1. User enters phone or email → sends `POST /login`
2. Receives a verification code via Twilio
3. Submits the code → `POST /verify?code=XXXXXX`
4. Server responds with JWT token
5. Client uses token for authenticated calls via Twilio Client

---

## 💻 Frontend Setup

### 1. Navigate to frontend

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```bash
VITE_API_URL=http://localhost:3001
```

### 4. Run the app

```bash
npm run dev
```

App will start at:

```
http://localhost:5173
```

---

## 🧠 How It Works

1. **Agent Login** — An agent logs in via frontend.
2. **Verification** — Twilio sends a verification code (e.g., via SMS or Voice).
3. **JWT Issuance** — On successful verification, backend returns a token.
4. **Call Handling** —

   * Agents can **receive or make calls** using the **Twilio Client SDK**.
   * **Socket.io** keeps all participants synced in real time.
5. **Live Interaction** — Call state updates (ringing, in-progress, completed) are streamed instantly to the UI.

---

## 🧰 Scripts

| Command         | Description                                     |
| --------------- | ----------------------------------------------- |
| `npm run dev`   | Run app in development mode (nodemon + ts-node) |
| `npm run build` | Compile TypeScript                              |
| `npm start`     | Start compiled server                           |
| `npm run lint`  | Run ESLint checks                               |

---

## 🔒 Environment Variables

| Variable             | Description                         |
| -------------------- | ----------------------------------- |
| `TWILIO_ACCOUNT_SID` | Twilio account SID                  |
| `TWILIO_AUTH_TOKEN`  | Twilio authentication token         |
| `TWILIO_API_KEY`     | Twilio API key for Client SDK       |
| `TWILIO_API_SECRET`  | Twilio API secret for Client SDK    |
| `SESSION_SECRET`     | Secret for JWT and session handling |
| `PORT`               | Backend port (default: 3001)        |

---
