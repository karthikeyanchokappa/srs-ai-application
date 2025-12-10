// src/Components/Chat/Chat.jsx
import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import ChatWindow from "../ChatWindow/ChatWindow";
import "./Chat.css";






const Chat = ({ theme, toggleTheme, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [chats, setChats] = useState([
    { id: "1", title: "New Chat", messages: [] }
  ]);

  const [activeChatId, setActiveChatId] = useState("1");
  const activeChat = chats.find(c => c.id === activeChatId);

  const createChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: []
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  const deleteChat = (id) => {
    const updated = chats.filter(c => c.id !== id);
    setChats(updated);
    if (id === activeChatId && updated.length > 0) {
      setActiveChatId(updated[0].id);
    }
  };

  const renameChat = (id) => {
    const name = prompt("Enter new name:");
    if (!name) return;
    setChats(chats.map(c => c.id === id ? { ...c, title: name } : c));
  };

  const updateMessages = (msgs) => {
    setChats(chats.map(c =>
      c.id === activeChatId ? { ...c, messages: msgs } : c
    ));
  };

  return (
    <div className="chat-layout">
      <Sidebar
        chats={chats}
        activeId={activeChatId}
        setActive={setActiveChatId}
        onCreate={createChat}
        onDelete={deleteChat}
        onRename={renameChat}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={onLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <ChatWindow
  chat={activeChat}
  updateMessages={updateMessages}
  theme={theme}
  sidebarOpen={sidebarOpen}
/>

    </div>
  );
};

export default Chat;