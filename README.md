
# 🚀 PromptCrafterPro – Prompt Engineering Playground

PromptCrafterPro is a web-based tool designed to help users experiment with different prompt styles for Large Language Models (LLMs). It supports Zero-shot, Few-shot, and Chain-of-Thought prompting, allowing real-time exploration and comparison of LLM outputs.

<img width="1882" height="814" alt="Screenshot 2025-07-18 130801" src="https://github.com/user-attachments/assets/88e675d8-73d8-46f9-bc9f-f17430c976e5" />
<img width="1886" height="811" alt="Screenshot 2025-07-18 130855" src="https://github.com/user-attachments/assets/aea9c93e-b062-4c43-b5bc-fc48e57b75e0" />
<img width="1872" height="813" alt="Screenshot 2025-07-18 130914" src="https://github.com/user-attachments/assets/8ce40e65-6fff-41f5-b16d-ecf2d90a2907" />

## 🧠 Features

- 🎯 Choose from multiple prompt types: Zero-shot, Few-shot, Chain-of-Thought
- ✍️ Custom prompt editor for real-time input
- ⚡ Dynamic LLM responses using OpenRouter API
- 🖥️ Full-stack architecture: TypeScript + Express + React + TailwindCSS
- 📊 Optional: Compare responses side-by-side

---

## 📁 Project Structure
PromptCrafterPro/
├── client/ # Frontend (React + Vite + TailwindCSS)
│ ├── index.html
│ └── src/
│ ├── App.tsx
│ ├── main.tsx
│ └── index.css
├── server/ # Backend (Express + TypeScript)
│ ├── index.ts
│ ├── routes.ts
│ └── storage.ts
├── .replit # Replit configuration
├── package.json # Project dependencies
├── tailwind.config.ts # TailwindCSS configuration
└── tsconfig.json # TypeScript configuration


---

## ⚙️ Setup Instructions

### 🛠 On Replit

1. Fork or import this project on [Replit](https://replit.com)
2. Add your API key in **Secrets** as:
OPENROUTER_API_KEY=your_key_here
3. Click **Run** to launch your full-stack app.

### 🖥️ Local Setup (Optional)

```bash
# Install dependencies
npm install

# Run server
npm run dev
🔐 OpenRouter API Configuration
Go to https://openrouter.ai

Create an account and get your API key

Use supported models like gpt-3.5-turbo, mistral, or mixtral

Securely store your key as an environment variable:
OPENROUTER_API_KEY=your_key
🧪 Sample Prompts
Zero-shot:
"Summarize the movie Inception in 3 bullet points."

Few-shot:
*"Translate the following English sentences into French.

Hello → Bonjour

Good night → Bonne nuit

Thank you → Merci"*

Chain-of-Thought:
"A train leaves at 3PM and travels at 60 km/h. How far will it travel in 2 hours? Let's think step by step."

🚀 Future Features
📝 Save & share favorite prompts

🔄 History & prompt versioning

👥 User login & personalization

📊 Multi-model side-by-side comparison

👨‍💻 Made With
OpenRouter

React

TailwindCSS

Express.js

TypeScript

📄 License
MIT License. Feel free to fork and extend the project!

🙌 Acknowledgements
Thanks to OpenRouter for free access to diverse LLM APIs and the open-source community for making development faster and better.

---

Let me know if you'd like a **badges section**, **demo video/GIF link**, or **GitHub Pages deployment steps** added!
