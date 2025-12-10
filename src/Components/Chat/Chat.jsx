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
  const activeChat = chats.find((c) => c.id === activeChatId);

  /* ------------------------------------------------------
     CREATE NEW CHAT
  ------------------------------------------------------ */
  const createChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: []
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  /* ------------------------------------------------------
     DELETE CHAT
  ------------------------------------------------------ */
  const deleteChat = (id) => {
    const updated = chats.filter((c) => c.id !== id);
    setChats(updated);

    if (id === activeChatId && updated.length > 0) {
      setActiveChatId(updated[0].id);
    }
  };

  /* ------------------------------------------------------
     MANUAL RENAME
  ------------------------------------------------------ */
  const renameChat = (id) => {
    const name = prompt("Enter new name:");
    if (!name) return;
    setChats(chats.map((c) => (c.id === id ? { ...c, title: name } : c)));
  };

  /* ------------------------------------------------------
     UPDATE MESSAGES + AUTO GENERATE CHAT TITLE
  ------------------------------------------------------ */
  const updateMessages = (msgs) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id !== activeChatId) return chat;

        let newTitle = chat.title;

        // AUTO-TITLE: Only when first message is added
        if (chat.messages.length === 0 && msgs.length === 1) {
          const firstMessage = msgs[0].text.trim();

          // Clean + shorten title (like ChatGPT)
          const clean = firstMessage
            .replace(/[\.\?\!]/g, "") // remove punctuation
            .replace(/\s+/g, " ") // clean spacing
            .trim();

          // Limit to 28 characters (ChatGPT style)
          newTitle = clean.length > 28 ? clean.slice(0, 28) + "…" : clean;
        }

        return {
          ...chat,
          messages: msgs,
          title: newTitle
        };
      })
    );
  };

  /* ------------------------------------------------------
     RENDER UI
  ------------------------------------------------------ */
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