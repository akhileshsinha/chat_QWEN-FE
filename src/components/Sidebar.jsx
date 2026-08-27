function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
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
        <div>Qwen-3</div>
        <span>● Local</span>
      </div>

    </aside>
  );
}

export default Sidebar;