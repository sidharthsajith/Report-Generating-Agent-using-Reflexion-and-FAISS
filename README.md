# Report-Generating-Agent using Reflexion and FAISS

## Overview

**Report-Generating-Agent** is an open-source, full-stack application that leverages advanced AI (LLMs), Reflexion-based iterative improvement, and FAISS vector search to generate, refine, and export comprehensive reports from a variety of document sources. The project features a Python Flask backend and a modern React frontend, supporting real-time streaming, PDF export, and extensible document processing.

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Backend](#backend)
- [Frontend](#frontend)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Features
- **AI-Powered Report Generation:** Input a query or upload documents (PDF, DOCX, PPTX, XLSX) and receive a detailed, structured report.
- **Reflexion Pipeline:** Iteratively improves report quality using LLM feedback and heuristics.
- **FAISS Vector Search:** Efficient semantic search and retrieval from large document sets.
- **Real-Time Streaming:** See report generation progress live.
- **PDF Export:** Download the final report as a formatted PDF.
- **Modern UI:** Responsive React frontend with dark mode and intuitive UX.
- **Open Source:** Apache 2.0 licensed for community use and contribution.

---

## Architecture

```
sidharthsajith-report-generating-agent-using-reflexion-and-faiss/
├── backend/
│   ├── app.py            # Flask backend, AI logic, Reflexion pipeline, FAISS integration
│   ├── requirements.txt  # Python dependencies
│   └── .env.sample       # Environment variable template
├── frontend/
│   ├── package.json      # React dependencies and scripts
│   ├── postcss.config.js # Styling config
│   ├── tailwind.config.js# Tailwind CSS config
│   ├── public/           # Static assets
│   └── src/              # React source code
├── LICENSE               # Apache 2.0 License
├── README.md             # Project documentation
└── sid.md                # (This file)
```

---

## Backend

### Technologies
- **Python 3**
- **Flask** (REST API)
- **FAISS** (vector search)
- **SentenceTransformers** (embeddings)
- **Groq, OpenAI, or Gemini** (LLM API integration)
- **PDF, DOCX, PPTX, XLSX** parsing libraries
- **dotenv** (environment management)
- **Logging, threading, rate limiting**

### Key Components
- **app.py:**
  - API endpoints for document upload, report generation, streaming, and PDF export.
  - `ReflectionPipeline` class: Iteratively refines reports using LLM feedback and heuristics.
  - `DocumentProcessor` class: Handles document parsing, embedding, and FAISS indexing.
  - Rate limiting to avoid API overuse.
  - Logging for debugging and monitoring.
- **requirements.txt:** Lists all backend dependencies.
- **.env.sample:** Template for required environment variables (API keys, etc).

### Notable Features
- **Multi-format Document Support:** Handles PDF, DOCX, PPTX, XLSX.
- **Semantic Search:** Uses FAISS and SentenceTransformers for fast, relevant retrieval.
- **LLM Integration:** Supports Groq, OpenAI, or Gemini for report generation and improvement.
- **Reflexion Pipeline:** Combines LLM output with heuristic assessment for iterative improvement.
- **PDF Export:** Uses FPDF and docx for exporting reports.

---

## Frontend

### Technologies
- **React** (SPA)
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **WebSockets** (real-time streaming)

### Structure
- **src/App.jsx:** Main React component, manages state and UI.
- **src/index.js:** Entry point.
- **src/components/:** UI components (e.g., SearchBar, ResponseArea).
- **src/services/:** API call utilities.
- **public/:** Static files (index.html, manifest, robots.txt).
- **Styling:** Tailwind CSS for responsive, accessible design.

### Features
- **Query Input:** Enter a topic or upload documents.
- **Live Streaming:** See report generation progress in real time.
- **PDF Download:** Export the generated report.
- **Dark Mode:** Toggle for accessibility.

---

## Setup & Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm

### Backend Setup
1. Clone the repository:
   ```sh
git clone https://github.com/yourusername/sidharthsajith-report-generating-agent-using-reflexion-and-faiss.git
cd sidharthsajith-report-generating-agent-using-reflexion-and-faiss/backend
```
2. Install dependencies:
   ```sh
pip3 install -r requirements.txt
```
3. Copy and configure environment variables:
   ```sh
cp .env.sample .env
# Edit .env to add your API keys (Groq, OpenAI, Gemini, etc)
```
4. Start the backend:
   ```sh
python3 app.py
```

### Frontend Setup
1. In a new terminal, go to the frontend directory:
   ```sh
cd ../frontend
```
2. Install dependencies:
   ```sh
npm install
```
3. Start the frontend:
   ```sh
npm run dev
```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Usage
1. Open the frontend in your browser.
2. Enter a research topic or upload documents.
3. Click "Generate Report".
4. Watch the report stream in real time.
5. Download the final report as PDF.

---

## API Endpoints
- `POST /upload`: Upload documents for processing.
- `POST /generate`: Generate a report from query or uploaded docs.
- `GET /stream`: Stream report generation progress.
- `GET /export/pdf`: Download the generated report as PDF.

---

## Contribution Guidelines
- Fork the repository and create a new branch.
- Follow PEP8 (Python) and Airbnb (JS) style guides.
- Write clear commit messages.
- Add tests for new features.
- Open a pull request with a detailed description.
- Respect the [Code of Conduct](CODE_OF_CONDUCT.md) (if present).

---

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgements
- [FAISS](https://github.com/facebookresearch/faiss)
- [SentenceTransformers](https://www.sbert.net/)
- [Flask](https://flask.palletsprojects.com/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI](https://openai.com/), [Groq](https://groq.com/), [Gemini](https://ai.google.dev/)

---

For questions, issues, or feature requests, please open an issue on GitHub or contact the maintainer.
