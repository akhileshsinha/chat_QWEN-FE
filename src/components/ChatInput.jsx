import { useRef, useState } from "react";

function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  const handleChange = (event) => {
    setValue(event.target.value);

    const textarea = textareaRef.current;

    textarea.style.height = "auto";
    textarea.style.height =
      `${Math.min(textarea.scrollHeight, 180)}px`;
  };

  const handleSend = () => {
    if (!value.trim() || disabled) return;

    onSend(value.trim());

    setValue("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-container">
      <div className="input-box">

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          rows={1}
          disabled={disabled}
        />

        <div className="input-actions">

          <span className="input-hint">
            Enter to send · Shift + Enter for new line
          </span>

          <button
            className="send-button"
            disabled={!value.trim() || disabled}
            onClick={handleSend}
          >
            ↑
          </button>

        </div>

      </div>
    </div>
  );
}

export default ChatInput;