// src/Components/Chat/Chat.jsx
<<<<<<< HEAD
import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import ChatWindow from "../ChatWindow/ChatWindow";
import "./Chat.css";






=======
import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import ChatWindow from "../ChatWindow/ChatWindow";
import { getToken } from "../../AWS/auth";
import "./Chat.css";

>>>>>>> feature/test
const Chat = ({ theme, toggleTheme, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [chats, setChats] = useState([
<<<<<<< HEAD
    { id: "1", title: "New Chat", messages: [] }
  ]);

  const [activeChatId, setActiveChatId] = useState("1");
  const activeChat = chats.find(c => c.id === activeChatId);
=======
    { id: "1", title: "New Chat", messages: [] },
  ]);

  const [activeChatId, setActiveChatId] = useState("1");
  const activeChat = chats.find((c) => c.id === activeChatId);

  // 🔍 TEMP: Verify JWT token after login
  // 🔍 TEMP: Verify JWT token after login

  useEffect(() => {
    getToken().then((token) => {
      console.log("JWT Token:", token);
    });
  }, []);
>>>>>>> feature/test

  const createChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
<<<<<<< HEAD
      messages: []
=======
      messages: [],
>>>>>>> feature/test
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  const deleteChat = (id) => {
<<<<<<< HEAD
    const updated = chats.filter(c => c.id !== id);
=======
    const updated = chats.filter((c) => c.id !== id);
>>>>>>> feature/test
    setChats(updated);
    if (id === activeChatId && updated.length > 0) {
      setActiveChatId(updated[0].id);
    }
  };

  const renameChat = (id) => {
    const name = prompt("Enter new name:");
    if (!name) return;
<<<<<<< HEAD
    setChats(chats.map(c => c.id === id ? { ...c, title: name } : c));
  };

  const updateMessages = (msgs) => {
    setChats(chats.map(c =>
      c.id === activeChatId ? { ...c, messages: msgs } : c
    ));
=======
    setChats(
      chats.map((c) =>
        c.id === id ? { ...c, title: name } : c
      )
    );
  };

  const updateMessages = (msgs) => {
    setChats(
      chats.map((c) =>
        c.id === activeChatId ? { ...c, messages: msgs } : c
      )
    );
>>>>>>> feature/test
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
<<<<<<< HEAD
  chat={activeChat}
  updateMessages={updateMessages}
  theme={theme}
  sidebarOpen={sidebarOpen}
/>

=======
        chat={activeChat}
        updateMessages={updateMessages}
        theme={theme}
        sidebarOpen={sidebarOpen}
      />
>>>>>>> feature/test
    </div>
  );
};

<<<<<<< HEAD
export default Chat;
=======
export default Chat;
>>>>>>> feature/test
