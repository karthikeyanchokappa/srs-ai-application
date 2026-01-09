// src/Components/Chat/Chat.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import ChatWindow from "../ChatWindow/ChatWindow";
import { getUserProfile } from "../../AWS/auth";
import {
  fetchUserTasks,
  fetchChatHistory,
} from "../../api/api-config";
import "./Chat.css";

const Chat = ({ theme, toggleTheme, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ===============================
  // USER PROFILE
  // ===============================
  const [user, setUser] = useState(null);

  // ===============================
  // CHAT / TASK SESSIONS
  // ===============================
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  // ✅ FIX: history loaded PER taskId
  const [historyLoaded, setHistoryLoaded] = useState({});

  const activeChat =
    chats.find((c) => c.id === activeChatId) || null;

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
  // TASK 1: LOAD USER TASKS (TABLE 3)
  // ===============================
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await fetchUserTasks();

        const taskChats = tasks.map((task) => ({
          id: task.TaskId,
          title: task.TaskName,
          messages: [],
          meta: task,
        }));

        setChats(taskChats);

        if (taskChats.length > 0) {
          setActiveChatId(taskChats[0].id);
        }
      } catch (err) {
        console.error("Failed to load user tasks", err);
      }
    };

    loadTasks();
  }, []);

  // ===============================
  // TASK 2: LOAD CHAT HISTORY (ONCE PER TASK)
  // ===============================
  useEffect(() => {
    if (!activeChatId) return;
    if (historyLoaded[activeChatId]) return; // 🔒 CRITICAL FIX

    const loadChatHistory = async () => {
      try {
        const history = await fetchChatHistory(activeChatId);

        const messages = history.map((item) => ({
          id: `${item.Timestamp}-${item.Sender}`,
          sender: item.Sender === "ai" ? "bot" : "user",
          text: item.Message,
        }));

        setChats((prevChats) =>
          prevChats.map((c) =>
            c.id === activeChatId
              ? { ...c, messages }
              : c
          )
        );

        // ✅ mark this task as loaded
        setHistoryLoaded((prev) => ({
          ...prev,
          [activeChatId]: true,
        }));
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };

    loadChatHistory();
  }, [activeChatId, historyLoaded]);

  // ===============================
  // HANDLE TASK SWITCH
  // ===============================
  const handleSetActive = (id) => {
    setActiveChatId(id);
  };

  // ===============================
  // UPDATE MESSAGES (SAFE)
  // ===============================
  const updateMessages = (updater) => {
    setChats((prevChats) =>
      prevChats.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              messages:
                typeof updater === "function"
                  ? updater(c.messages || [])
                  : updater,
            }
          : c
      )
    );
  };

  return (
    <div className="chat-layout">
      <Sidebar
        user={user}
        chats={chats}
        activeId={activeChatId}
        setActive={handleSetActive}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={onLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* ALWAYS RENDER ChatWindow */}
      <ChatWindow
        chat={activeChat}
        updateMessages={updateMessages}
        user={user}
      />
    </div>
  );
};

export default Chat;
