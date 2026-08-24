# 🤖 Local ChatGPT

> A beautiful, privacy-friendly ChatGPT-style frontend for interacting with locally hosted AI models.

A modern React-based chat interface built as the frontend for a **local AI playground**.

The application provides a familiar ChatGPT-like experience while keeping the architecture flexible enough to connect with locally running models, custom APIs, and eventually multiple AI capabilities such as text, image, and video generation.

---

## ✨ Features

### 💬 Chat Interface

- Clean, modern ChatGPT-inspired UI
- User and assistant messages displayed in separate cards
- Properly formatted multiline responses
- Responsive conversation layout
- Smooth loading experience while waiting for model responses

### 🧠 Local AI Integration

Designed to communicate with a locally running AI backend.

```text
React Frontend
      │
      ▼
   FastAPI
      │
      ▼
 Local AI Model