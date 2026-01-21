import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import ChatWindow from "../ChatWindow/ChatWindow";
import { getUserProfile, getAccessToken } from "../../AWS/auth";
import {
  initialiseChat,
  renameChat,
  deleteChat, // 🔥 REQUIRED
} from "../../api/api-config";
import "./Chat.css";

const Chat = ({ theme, toggleTheme, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  // 🔴 sessions is OBJECT { requests: [], tasks: [] }
  const [sessions, setSessions] = useState({});
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);

  /* ===============================
     NORMALIZER (UNCHANGED)
  =============================== */
  const normalizeMessages = (rawMessages = []) =>
    rawMessages.map((m, i) => ({
      id: `msg-${i}`,
      sender: m.role === "assistant" ? "bot" : "user",
      text: m.content?.[0]?.text || "",
    }));

  /* ===============================
     INITIAL LOAD
  =============================== */
  useEffect(() => {
    const init = async () => {
      try {
        const profile = await getUserProfile();
        const token = await getAccessToken();
        if (!profile || !token) return;

        setUser(profile);

        const data = await initialiseChat(token, profile.email);

        setSessions(data.sessions || {});
        setActiveSessionId(data.activeSessionId || null);
        setMessages(normalizeMessages(data.messages || []));
      } catch (err) {
        console.error("Initialise failed", err);
      }
    };

    init();
  }, []);

  /* ===============================
     NEW CHAT
  =============================== */
  const handleNewChat = () => {
    const tempId = `temp-${Date.now()}`;
    setActiveSessionId(tempId);
    setMessages([]);
  };

  /* ===============================
     🔥 AUTO RENAME (FIRST MESSAGE)
     - UI updates immediately
     - Persist to backend
  =============================== */
  const handleAutoRename = async (firstMessage) => {
    if (!activeSessionId || !user) return;

    const title = firstMessage.slice(0, 60);

    // ✅ UI update immediately
    setSessions((prev) => {
      if (!prev) return prev;

      const exists = (prev.tasks || []).some(
        (s) => s.sessionId === activeSessionId
      );

      return {
        requests: prev.requests || [],
        tasks: exists
          ? prev.tasks.map((s) =>
              s.sessionId === activeSessionId
                ? { ...s, title }
                : s
            )
          : [
              ...(prev.tasks || []),
              {
                sessionId: activeSessionId,
                title,
                createdAt: Date.now(),
              },
            ],
      };
    });

    // ✅ Persist to DynamoDB
    try {
      const token = await getAccessToken();
      await renameChat(token, user.email, activeSessionId, title);
    } catch (err) {
      console.error("Rename persist failed", err);
    }
  };

  /* ===============================
     SIDEBAR CLICK
  =============================== */
  const handleSessionClick = async (sessionId) => {
    try {
      setActiveSessionId(sessionId);
      setMessages([]);

      const token = await getAccessToken();
      if (!token || !user) return;

      const data = await initialiseChat(
        token,
        user.email,
        sessionId
      );

      setMessages(normalizeMessages(data.messages || []));
    } catch (err) {
      console.error("Failed to load history", err);
      setMessages([]);
    }
  };

  /* ===============================
     ✏️ MANUAL RENAME
  =============================== */
  const handleRenameChat = async (sessionId) => {
    const newTitle = prompt("Rename chat");
    if (!newTitle || !user) return;

    try {
      const token = await getAccessToken();
      await renameChat(token, user.email, sessionId, newTitle);

      setSessions((prev) => ({
        requests: prev.requests || [],
        tasks: (prev.tasks || []).map((s) =>
          s.sessionId === sessionId
            ? { ...s, title: newTitle }
            : s
        ),
      }));
    } catch (err) {
      console.error("Rename failed", err);
    }
  };

  /* ===============================
     🗑️ DELETE CHAT
  =============================== */
  const handleDeleteChat = async (sessionId) => {
    if (!window.confirm("Delete this chat?")) return;

    try {
      const token = await getAccessToken();
      await deleteChat(token, user.email, sessionId);

      setSessions((prev) => ({
        requests: prev.requests || [],
        tasks: (prev.tasks || []).filter(
          (s) => s.sessionId !== sessionId
        ),
      }));

      if (activeSessionId === sessionId) {
        setActiveSessionId("default-chat");
        setMessages([]);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="chat-layout">
      <Sidebar
        user={user}
        chats={[
          ...(sessions?.requests || []),
          ...(sessions?.tasks || []),
        ].map((s) => ({
          id: s.sessionId,
          title: s.title || "Chat",
          createdAt: s.createdAt,
        }))}
        activeId={activeSessionId}
        setActive={handleSessionClick}
        onCreate={handleNewChat}
        onRename={handleRenameChat}   // ✅ ENABLE
        onDelete={handleDeleteChat}   // ✅ ENABLE
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={onLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <ChatWindow
        chat={{ id: activeSessionId, messages }}
        updateMessages={setMessages}
        user={user}
        onFirstMessage={handleAutoRename}
      />
    </div>
  );
};

export default Chat;
