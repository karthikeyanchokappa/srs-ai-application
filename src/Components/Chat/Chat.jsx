// src/Components/Chat/Chat.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import ChatWindow from "../ChatWindow/ChatWindow";
import { getUserProfile } from "../../AWS/auth";
import "./Chat.css";

const Chat = ({ theme, toggleTheme, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ===============================
  // USER PROFILE
  // ===============================
  const [user, setUser] = useState(null);

  // ===============================
  // SINGLE CHAT SESSION
  // ===============================
  const [chat, setChat] = useState({
    id: "default-chat", // simple session id
    title: "New Chat",
    messages: [],
  });

  // ===============================
  // LOAD USER PROFILE
  // ===============================
  useEffect(() => {
    const loadUser = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };

    loadUser();
  }, []);

  // ===============================
  // UPDATE MESSAGES 
  // ===============================
  const updateMessages = (updater) => {
    setChat((prev) => ({
      ...prev,
      messages:
        typeof updater === "function"
          ? updater(prev.messages)
          : updater,
    }));
  };

  return (
    <div className="chat-layout">
      <Sidebar
        user={user}
        chats={[chat]}            // sidebar still shows 1 chat
        activeId={chat.id}
        setActive={() => {}}      // no switching
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={onLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <ChatWindow
        chat={chat}
        updateMessages={updateMessages}
        user={user}
      />
    </div>
  );
};

export default Chat;
