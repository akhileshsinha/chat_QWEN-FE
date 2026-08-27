import Message from "./Message";
import Loader from "./Loader";
import ChatInput from "./ChatInput";
import { useEffect, useState } from "react";

function ChatWindow({
  session,
  setSessions,
  setActiveSessionId,
}) {
  const [loading, setLoading] = useState(false);

  const messages = session?.messages || [];

  const handleSend = async (text) => {

    let sessionId = session?.id;

    // Create a new session if this is the first message
    if (!sessionId) {
      sessionId = crypto.randomUUID();

      const newSession = {
        id: sessionId,
        title: text,
        messages: [],
      };

      setSessions((previous) => [
        newSession,
        ...previous,
      ]);

      setActiveSessionId(sessionId);
    }

    const userMessage = {
      role: "user",
      content: text,
    };

    // Add user message
    setSessions((previous) =>
      previous.map((item) =>
        item.id === sessionId
          ? {
              ...item,
              messages: [
                ...item.messages,
                userMessage,
              ],
            }
          : item
      )
    );

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: text,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error: ${response.status}`
        );
      }

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: data.response,
      };

      // Add Qwen response
      setSessions((previous) =>
        previous.map((item) =>
          item.id === sessionId
            ? {
                ...item,
                messages: [
                  ...item.messages,
                  assistantMessage,
                ],
              }
            : item
        )
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  return (
    <main className="chat-window">

      <header className="chat-header">
        <div>
          <h2>
            {session?.title || "Nisum"}
          </h2>

          <span>Qwen3-4B</span>
        </div>

        <div className="status">
          <span className="status-dot" />
          Online
        </div>
      </header>

      <section className="messages">

        {!session && (
          <div className="welcome">
            <div className="welcome-icon">
              ✦
            </div>

            <h1>
              How can I help you?
            </h1>

            <p>
              Ask anything. Keep your conversations and data within Nisum
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
          />
        ))}

        {loading && <Loader />}

      </section>

      <ChatInput
        onSend={handleSend}
        disabled={loading}
      />

    </main>
  );
}

export default ChatWindow;