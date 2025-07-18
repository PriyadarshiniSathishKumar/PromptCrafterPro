🚀 PromptCrafterPro – Prompt Engineering Playground
PromptCrafterPro is a web-based tool that lets you explore and compare various types of prompts for LLMs—Zero-shot, Few-shot, and Chain-of-Thought. It's built to help developers and prompt engineers test, compare, and fine-tune prompts in real-time.
<img width="1882" height="814" alt="Screenshot 2025-07-18 130801" src="https://github.com/user-attachments/assets/88e675d8-73d8-46f9-bc9f-f17430c976e5" />
<img width="1886" height="811" alt="Screenshot 2025-07-18 130855" src="https://github.com/user-attachments/assets/aea9c93e-b062-4c43-b5bc-fc48e57b75e0" />
<img width="1872" height="813" alt="Screenshot 2025-07-18 130914" src="https://github.com/user-attachments/assets/8ce40e65-6fff-41f5-b16d-ecf2d90a2907" />

🔧 Features
🧠 Prompt Types: Choose between Zero-shot, Few-shot, and Chain-of-Thought modes

✍️ Editable Prompt Area: Customize your own inputs

⚡ Real-time LLM Integration: Fetches model responses using OpenRouter or similar APIs

📊 Side-by-side Comparison (Optional)

💾 Simple Full-Stack Setup using TypeScript, React, Express, and TailwindCSS

📁 Project Structure
pgsql
Copy
Edit
PromptCrafterPro/
├── client/              # Frontend (React + Vite + TailwindCSS)
│   ├── index.html
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
├── server/              # Backend (Express + TypeScript)
│   ├── index.ts
│   ├── routes.ts
│   └── storage.ts
├── .replit              # Replit config
├── package.json         # Dependencies
└── tailwind.config.ts
🚀 Getting Started on Replit
Fork or Import this repository into Replit

Add your OPENROUTER_API_KEY in Replit Secrets

Click "Run" – your full-stack app will launch

🔐 OpenRouter API Setup
Sign up at OpenRouter

Use supported models like mistral, gpt-3.5-turbo, or mixtral

Store the API key securely in your environment as:
OPENROUTER_API_KEY=your_key_here
✅ Future Improvements
Prompt history and save feature

Response quality rating

Support for multiple models and comparison

Authentication and user profiles

🧠 Made For
LLM Developers • Prompt Engineers • AI Researchers • Educators
