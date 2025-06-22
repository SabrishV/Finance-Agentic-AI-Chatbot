# Finance-Agentic-AI-Chatbot
Conversational Finance Agentic AI Chatbot

The Agent = Sage Advisor
## Overview
Sage Advisor is a sophisticated AI-powered financial assistant that simulates a financial sage with a millennium of experience. The application provides personalized financial guidance through a conversational interface, leveraging Google's Gemini 2.0 Flash AI model.

![Screenshot 2025-06-22 130329](https://github.com/user-attachments/assets/354416e0-3884-4c87-ad20-a3a14011a68b)

![Screenshot 2025-06-22 130502](https://github.com/user-attachments/assets/7db79277-5444-466f-a1d2-2d3095beb7a2)



## Features
- AI Financial Advisor : Interact with an AI that simulates centuries of financial wisdom
- Conversational Interface : Natural dialogue-based interaction with markdown support
- Persistent Chat History : Conversations are saved in local storage for continuity
- Responsive Design : Fully responsive UI that works on desktop and mobile devices
- Markdown Support : Rich text responses with code block support
- Settings Management : Configure AI model preferences and manage application data

## Technologies Used
### Frontend
- Next.js 15.2.3 : React framework for server-side rendering and static site generation
- React 18.3.1 : JavaScript library for building user interfaces
- TypeScript : Typed JavaScript for better developer experience
- Tailwind CSS : Utility-first CSS framework for styling
- Radix UI : Unstyled, accessible UI components
- Lucide React : Beautiful, consistent icons
### AI Integration
- Genkit : Framework for building AI applications
- Google AI (Gemini 2.0 Flash) : Large language model for natural language processing

## Project Structure
```
├── src/
│   ├── ai/                  # AI 
integration
│   │   ├── flows/           # AI 
conversation flows
│   │   ├── dev.ts           # 
Development entry point
│   │   └── genkit.ts        # Genkit 
configuration
│   ├── app/                 # Next.js 
app directory
│   │   ├── (app)/           # Main 
application routes
│   │   ├── globals.css      # Global 
styles
│   │   └── layout.tsx       # Root layout
│   ├── components/          # React 
components
│   │   ├── chat/            # 
Chat-related components
│   │   ├── layout/          # Layout 
components
│   │   ├── onboarding/      # Onboarding 
components
│   │   └── ui/              # UI 
components
│   ├── hooks/               # Custom 
React hooks
│   └── lib/                 # Utility 
functions and constants
├── public/                  # Static 
assets
├── .env.local               # 
Environment variables (create this file)
└── ... configuration files
```

## License
This project is licensed under the [MIT License](LICENSE).

---
Built with ❤️ using Next.js and Google's Gemini AI
