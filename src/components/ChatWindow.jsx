import Message from "./Message";
import Loader from "./Loader";
import ChatInput from "./ChatInput";
import { useState } from "react";

function ChatWindow({
  session,
  setSessions,
  setActiveSessionId,
  selectedModel,
}) {
  const [loading, setLoading] = useState(false);

  const messages = session?.messages || [];

  const handleSend = async (text, image, imagePreview) => {
    let sessionId = session?.id;

    if (!sessionId) {
      sessionId = crypto.randomUUID();

      const newSession = {
        id: sessionId,
        title: text,
        messages: [],
      };

      setSessions((previous) => [newSession, ...previous]);

      setActiveSessionId(sessionId);
    }

    const userMessage = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
      image: imagePreview || null,
    };

    setSessions((previous) =>
      previous.map((item) =>
        item.id === sessionId
          ? {
              ...item,
              messages: [...item.messages, userMessage],
            }
          : item,
      ),
    );

    setLoading(true);

    try {
      let response;

      if (selectedModel === "qwen-vision") {
        const formData = new FormData();

        formData.append("prompt", text);

        if (image) {
          formData.append("image", image);
        }

        response = await fetch("http://localhost:8000/generate-image", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("http://localhost:8000/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: text,
            model: selectedModel,
          }),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      setSessions((previous) =>
        previous.map((item) =>
          item.id === sessionId
            ? {
                ...item,
                messages: [...item.messages, assistantMessage],
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(error);

      const errorMessage = {
        role: "assistant",
        content: "Sorry, something went wrong while processing your request.",
      };

      setSessions((previous) =>
        previous.map((item) =>
          item.id === sessionId
            ? {
                ...item,
                messages: [...item.messages, errorMessage],
              }
            : item,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const modelName =
    selectedModel === "qwen-vision" ? "Qwen3-VL-2B" : "Qwen3-4B";

  return (
    <main className="chat-window">
      <header className="chat-header">
        <div>
          <h2>{session?.title || "Nisum"}</h2>

          <span>{modelName}</span>
        </div>

        <div className="status">
          <span className="status-dot" />
          Online
        </div>
      </header>

      <section className="messages">
        {!session && (
          <div className="welcome">
            <div className="welcome-icon">✦</div>

            <h1>How can I help you?</h1>

            <p>Ask anything. Keep your conversations and data within Nisum</p>
          </div>
        )}

        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {loading && <Loader />}
      </section>

      <ChatInput
        onSend={handleSend}
        disabled={loading}
        visionMode={selectedModel === "qwen-vision"}
      />
    </main>
  );
}

export default ChatWindow;
