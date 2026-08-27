import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [selectedModel, setSelectedModel] = useState("qwen");

  const activeSession = sessions.find(
    (session) => session.id === activeSessionId
  );

  const handleNewChat = () => {
    setActiveSessionId(null);
  };

  return (
    <div className="app">

      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={handleNewChat}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />

      <ChatWindow
        session={activeSession}
        setSessions={setSessions}
        setActiveSessionId={setActiveSessionId}
        selectedModel={selectedModel}
      />

    </div>
  );
}

export default App;