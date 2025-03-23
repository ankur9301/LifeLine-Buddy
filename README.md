# 🚨 LifeLine Buddy - AI-Powered 911 Dispatch Dashboard

**LifeLine Buddy** is a sleek, real-time emergency dispatch dashboard powered by AI to assist 911 operators in triaging and managing emergencies effectively. Built using **React**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, it provides a fast, intelligent, and user-friendly interface for handling life-critical situations.

---

## 🧠 Problem We're Solving

911 centers in the U.S. receive over **240 million calls per year**. Many are overwhelmed by:

- 📈 High call volume and staff shortages  
- 🧍‍♀️ Manual triage leading to delays or misprioritization  
- 🧓 Outdated systems that can’t detect emotion or urgency  

**Every second matters in an emergency.**

---

## 💡 Our Solution

LifeLine Buddy supports dispatchers with real-time AI insights:

- 📝 Transcribes calls in real-time  
- 😨 Detects caller emotions (fear, confusion)  
- ⚠️ Calculates urgency level (Critical, Urgent, Standard)  
- 🚨 Suggests appropriate units to dispatch  
- 📊 Provides a clean dashboard for instant action  

> ⚠️ **Note**: LifeLine Buddy is not a replacement for human decision-making — it’s a digital assistant that enhances clarity, speed, and context.

---

## 🕒 Why Now?

- 82% of 911 call centers report **staffing shortages**
- Many emergency calls are **non-urgent**, yet consume operator time
- AI tools now understand **speech, emotion, and context in real-time**
- Cities are actively investing in **civic tech and smarter public safety**

---

## ✨ Features

- 🔴 **Live Emergency Feed** – Real-time updates from the backend
- 🧠 **AI Assessment** – Emotion & urgency detection (via Gemini)
- 🚓 **One-Click Dispatch** – Police, Firefighters, Paramedics
- 🎙️ **Live Transcript & Audio** – Realtime transcript + playback
- 📍 **Interactive Map** – Emergency location with Google Maps API
- ✅ **Case Management** – Close or transfer emergencies
- ⚡ **Smooth Animations** – Transitions via Framer Motion

---

## 🧑‍💻 Tech Stack

| Category         | Technologies Used                                                                 |
|------------------|------------------------------------------------------------------------------------|
| Frontend         | React, TypeScript                                                                 |
| Styling          | Tailwind CSS, Shadcn/UI, Radix UI                                                  |
| Animation        | Framer Motion                                                                      |
| Maps             | Google Maps API GL JS                                                                       |
| Audio            | HTML5 `<audio>` with Play/Pause                                                    |
| State Management | React Hooks (`useState`, `useEffect`, `useMemo`)                                   |
| Components       | Reusable UI (Buttons, Cards, Badges, Inputs)                                       |

---

## 🔊 Voice + AI Conversation

- 🗣 **ElevenLabs API** powers the AI voice that speaks with callers
- 🤖 **Gemini API** handles:
  - Conversational logic (asking questions, guiding the call)
  - Emotion + urgency detection from transcripts

---

## 🖥️ Backend Architecture

- 🐍 **Built with**: Python (Flask)
- 🗃️ **Database**: MongoDB Atlas stores:
  - Call logs
  - Emotion/urgency scores
  - Timestamps & analytics
- 🔄 **Real-Time Communication**: Socket.IO to push updates to frontend
- ☎️ **Voice Hosting**: Twilio is used to host the AI agent's phone number
- 🌐 **Hosting**:
  - Frontend: **AWS Amplify**
  - Backend: **Heroku**
  - Domain: Registered via **GoDaddy**

---

## 🗂 Project Structure


```
├── components/
│   ├── emergency-list.tsx
│   ├── emergency-details.tsx
│   ├── live-transcript.tsx
│   ├── emergency-map.tsx
│   └── ui/ (Buttons, Badges, Inputs, Cards, etc.)
├── types/
│   └── emergency.ts (Defines Emergency data structure)
├── app/
│   └── emergency-dashboard.tsx (Main logic and layout)
├── styles/
│   └── globals.css (Tailwind config + custom themes)
└── lib/
|    └── utils.ts (Utility functions)
└── backend/
    └── backend_code.py (Utility functions)
```

---

## 🚀 Setup Instructions

1. **Clone the Repository**
```bash
git clone https://github.com/your-username/lifeline-buddy.git
cd lifeline-buddy
```

2. **Install Dependencies**
```bash
npm install
```

3. **Run the Development Server**
```bash
npm run dev
```
4. **Start the backend Server**
```bash
python3 backend_code.py
```
4. **Configure .env (optional)**
If you plan to use a real backend or Google Map API:
```env
NEXT_PUBLIC_Google Maps API_TOKEN=your_google__map_api_token_here
BACKEND_URL=https://your-api-url
```

---

## 🔄 Workflow & Logic

- **Polling**: Backend is polled every 5s to fetch latest emergencies.
- **Component Communication**: Data is passed from dashboard to subcomponents like `EmergencyList`, `LiveTranscript`, and `EmergencyDetails`.
- **Dispatch Logic**: On click, badges are updated and confirmation alerts appear.
- **State Tracking**: Emergency status tracked in `dispatchedStatus` & `transferStatus`.
- **Animations**: Entry/exit transitions for modals and alerts via Framer Motion.

---

## 📌 Design Highlights

- Mobile Responsive: Works across screens with conditional UI behavior.
- Accessibility: Focus states, button semantics, keyboard support.
- Color Mode: Light/Dark support via Tailwind’s `:root` variables.

---

## 🙌 Acknowledgements

- [Shadcn/UI](https://ui.shadcn.com/) for headless UI components
- [Framer Motion](https://www.framer.com/motion/) for delightful animations
- Google Maps API API for dynamic mapping

---

## 📸 Demo Preview
<img width="1509" alt="lifeline_buddy" src="https://github.com/user-attachments/assets/99bf9ccb-2b40-43e1-a54e-973ffa5ab418" />





