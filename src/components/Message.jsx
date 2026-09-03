import ReactMarkdown from "react-markdown";

function Message({ message }) {
  const isUser = message.role === "user";

  const formattedTime = message.timestamp
    ? new Date(
        message.timestamp,
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`message-row ${
        isUser
          ? "user-row"
          : "assistant-row"
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

        {message.document && (
          <div className="message-document">
            <div className="document-thumbnail">
              <span>📄</span>
            </div>

            <div className="document-details">
              <strong>
                {message.document.filename}
              </strong>

              <span>
                {message.document.fileType}
              </span>
            </div>
          </div>
        )}

        <ReactMarkdown>
          {message.content}
        </ReactMarkdown>

        {message.sources?.length > 0 && (
          <div className="message-sources">
            <div className="sources-title">
              📎 Sources
            </div>

            <div className="sources-list">
              {message.sources.map(
                (source, index) => (
                  <div
                    key={index}
                    className="source-card"
                  >
                    <div className="source-icon">
                      {source.type === "slide"
                        ? "📑"
                        : source.type === "sheet"
                          ? "📊"
                          : "📄"}
                    </div>

                    <div className="source-info">
                      <strong>
                        {source.source}
                      </strong>

                      <span>
                        Relevance:{" "}
                        {(
                          source.score * 100
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        <div className="message-meta">
          {formattedTime && (
            <span className="message-timestamp">
              {formattedTime}
            </span>
          )}

          {message.latency && (
            <span className="message-latency">
              {message.latency}s
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;