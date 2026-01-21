import React, { useEffect, useRef, useState } from "react";
import "./ChatWindow.css";
import { UploadIcon, MicIcon, SendIcon } from "./InputIcons";
import MarkdownRenderer from "./MarkdownRenderer";
import {
  sendChatMessage,
  initialiseChat, // 🔥 ADD
} from "../../api/api-config";
import { getAccessToken } from "../../AWS/auth";

const ChatWindow = ({ chat, updateMessages, user, onFirstMessage }) => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  /* ===============================
     AUTO SCROLL
  =============================== */
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat?.messages, isTyping]);

  /* ===============================
     ADD MESSAGE (UI ONLY)
  =============================== */
  const addMessage = (msg) => {
    updateMessages((prev) => [...prev, msg]);
  };

  /* ===============================
     SEND MESSAGE
  =============================== */
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    // 🔥 Notify parent on FIRST message (for title)
    if (chat?.id?.startsWith("temp-") && onFirstMessage) {
      onFirstMessage(text);
    }

    // Optimistic UI — user message
    addMessage({
      id: `user-${Date.now()}`,
      sender: "user",
      text,
    });

    setInput("");
    setIsTyping(true);

    if (!chat?.id || !user) {
      setIsTyping(false);
      return;
    }

    try {
      const token = await getAccessToken();
      if (!token) throw new Error("No token");

      // 🔹 Send message
      const res = await sendChatMessage(
        chat.id,
        text,
        user.email,
        token
      );

      // 🔹 Optimistic bot reply
      addMessage({
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: res.reply || "No response",
      });

      // 🔥 CRITICAL FIX:
      // Re-fetch latest chat history from backend
      const data = await initialiseChat(
        token,
        user.email,
        res.sessionId || chat.id
      );

      updateMessages(
        (data.messages || []).map((m, i) => ({
          id: `msg-${i}`,
          sender: m.role === "assistant" ? "bot" : "user",
          text: m.content?.[0]?.text || "",
        }))
      );
    } catch (err) {
      console.error("Chat error:", err);
      addMessage({
        id: `err-${Date.now()}`,
        sender: "bot",
        text: "❌ Failed to connect to server",
      });
    } finally {
      setIsTyping(false);
    }
  };

  /* ===============================
     AUTO GROW TEXTAREA
  =============================== */
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  return (
    <main className="chat-main chat-layout">
      <div className="messages" ref={scrollRef}>
        {chat?.messages?.length === 0 && (
          <div className="welcome-screen">
            <h1 className="welcome-title">What are you working on?</h1>
          </div>
        )}

        {chat?.messages?.map((m, index) => (
          <div key={m.id || index} className={`msg-row ${m.sender}`}>
            <div className="msg-bubble">
              <MarkdownRenderer text={m.text} />
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="msg-row bot">
            <div className="msg-bubble typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-bar">
        <div className="chat-input-wrapper">
          <label className="cw-icon cw-upload">
            <UploadIcon />
            <input type="file" />
          </label>

          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Ask anything..."
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);
              resizeTextarea();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <button className="cw-send" onClick={handleSend}>
            <SendIcon />
          </button>
        </div>
      </div>
    </main>
  );
};

export default ChatWindow;
