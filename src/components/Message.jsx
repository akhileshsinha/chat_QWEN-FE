import ReactMarkdown from "react-markdown";

function Message({ message }) {
  const isUser = message.role === "user";

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

        {/* <div className="message-content">
          {message.content}
        </div> */}
        <ReactMarkdown>
            {message.content}
        </ReactMarkdown>

      </div>
    </div>
  );
}

export default Message;