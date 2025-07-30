<div align="center">
  <h1>Resumind: AI Resume Analyzer</h1>
  <p><strong>Smart, AI-powered resume feedback and ATS analysis for job seekers</strong></p>
  <img src="./public/images/resume-scan.gif" alt="Resume Scan" width="300" />
</div>

---

## 🚀 Overview

**Resumind** is a modern web application that helps users analyze their resumes using AI. It provides detailed, actionable feedback on how to improve your resume for specific job descriptions, including ATS (Applicant Tracking System) compatibility, content, structure, tone, and skills. Upload your resume, get a score, and receive personalized improvement tips—all in a beautiful, user-friendly interface.

---

## ✨ Features

- **AI-Powered Resume Analysis**: Upload your PDF resume and get instant, detailed feedback powered by advanced AI models.
- **ATS Score & Suggestions**: See how your resume performs in Applicant Tracking Systems and get tips to improve your chances.
- **Job-Specific Feedback**: Input a job title and description to receive tailored advice for your target role.
- **Visual Resume Scoring**: Get an overall score and category-wise breakdown (ATS, Tone & Style, Content, Structure, Skills).
- **History & Tracking**: View all your previous resume submissions and feedback in one place.
- **Beautiful UI**: Responsive, modern design with smooth animations and gradients.
- **Authentication**: Secure login/logout to keep your data private.
- **File Management**: Upload, view, and delete your resumes and associated data.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Routing**: React Router v7 (with SSR support)
- **State Management**: Zustand
- **Styling**: Tailwind CSS, custom CSS, tw-animate-css
- **PDF Processing**: pdfjs-dist
- **Drag & Drop**: react-dropzone
- **AI Integration**: Puter.js AI API (Claude 3 Sonnet model)
- **File Storage & KV**: Puter.js virtual filesystem and key-value store
- **Containerization**: Docker

---

## 📦 Project Structure

```
├── app/
│   ├── components/      # UI components (Navbar, ResumeCard, ATS, etc.)
│   ├── constants/       # Static data and AI prompt templates
│   ├── lib/             # Utility functions, PDF/image conversion, Puter.js store
│   ├── routes/          # Route components (home, upload, resume, auth, wipe)
│   ├── types/           # TypeScript types and interfaces
│   ├── app.css          # Global and component styles
│   └── root.tsx         # App root and layout
├── public/              # Static assets (images, icons, pdf.worker)
├── build/               # Build output (ignored in git)
├── Dockerfile           # Docker build instructions
├── package.json         # Project metadata and scripts
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
└── README.md            # This file
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Lakshaysehgal01/ai-resume-analyzer.git
   cd ai-resume-analyzer
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Open in your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

### Docker

To build and run with Docker:

```bash
docker build -t ai-resume-analyzer .
docker run -p 5173:5173 ai-resume-analyzer
```

---

## 🧠 How It Works

1. **Upload Resume**: Drag and drop your PDF resume and provide the job title/description.
2. **AI Analysis**: The app uploads your file, converts the first page to an image, and sends it (with the job info) to the AI model for analysis.
3. **Feedback**: The AI returns a structured JSON with scores and tips for ATS, content, structure, tone, and skills.
4. **Review**: View your resume, scores, and detailed suggestions in a beautiful dashboard.
5. **History**: All your submissions are saved for future review.

---

## 📝 Example Feedback Format

The AI returns feedback in this format:

```ts
interface Feedback {
  overallScore: number; // max 100
  ATS: { score: number; tips: { type: "good" | "improve"; tip: string }[] };
  toneAndStyle: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  content: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  structure: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  skills: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
}
```

---

## 🛡️ Security & Privacy

- All resumes and feedback are stored securely in your Puter.js virtual account.
- Only authenticated users can access their data.
- No resumes are shared or made public.

---

## 🙏 Credits

- [React](https://react.dev/), [React Router](https://reactrouter.com/), [Tailwind CSS](https://tailwindcss.com/), [pdfjs-dist](https://github.com/mozilla/pdfjs-dist), [Puter.js](https://puter.com/), [Claude 3 Sonnet](https://www.anthropic.com/claude)
- Icons and images from project assets.

---

## 📄 License

This project is licensed under the MIT License.
