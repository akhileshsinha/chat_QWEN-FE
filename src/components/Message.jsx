import ReactMarkdown from "react-markdown";

function Message({ message }) {
  const isUser = message.role === "user";

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`message-row ${
        isUser ? "user-row" : "assistant-row"
      }`}
    >
      <div
        className={`message-card ${
          isUser
            ? "user-message"
            : "assistant-message"
        }`}
      >
        <div className="message-label">
          {isUser ? "You" : "Qwen"}
        </div>

        {message.image && (
          <img
            src={message.image}
            alt="Attachment"
            className="message-image"
          />
        )}

        <ReactMarkdown>
          {message.content}
        </ReactMarkdown>

        {formattedTime && (
          <div className="message-timestamp">
            {formattedTime}
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;