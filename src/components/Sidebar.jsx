function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  selectedModel,
  onModelChange,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <span>Nisum</span>
        </div>

        <button
          className="new-chat"
          onClick={onNewChat}
        >
          + New chat
        </button>
      </div>

      <div className="history">
        <div className="history-section">
          <span className="history-title">
            Today
          </span>

          {sessions.map((session) => (
            <button
              key={session.id}
              className={`history-item ${
                activeSessionId === session.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                onSelectSession(session.id)
              }
            >
              {session.title}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="model-selector">
          <label htmlFor="model-select">
            Model
          </label>

          <select
            id="model-select"
            value={selectedModel}
            onChange={(event) =>
              onModelChange(event.target.value)
            }
          >
            <option value="qwen">
              Qwen3-4B
            </option>

            <option value="qwen-vision">
              Qwen3-VL-2B
            </option>
          </select>

          <span>● Local</span>
  </div>
</div>
    </aside>
  );
}

export default Sidebar;