// src/Components/ChatWindow/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import "./ChatWindow.css";
import { UploadIcon, MicIcon, SendIcon } from "./InputIcons";
import MarkdownRenderer from "./MarkdownRenderer";
import { sendChatMessage } from "../../api/api-config";
import { getAccessToken, getIdToken } from "../../AWS/auth";

const ChatWindow = ({ chat, updateMessages, user }) => {
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
     ADD MESSAGE
  =============================== */
  const addMessage = (msg) => {
    updateMessages((prev) => [...prev, msg]);
  };

  /* ===============================
     SEND MESSAGE (✅ CORRECT JWT FLOW)
  =============================== */
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    // Show user message immediately
    addMessage({
      id: Date.now().toString(),
      sender: "user",
      text,
    });

    setInput("");
    setIsTyping(true);

    if (!chat || !user) {
      addMessage({
        id: "warn_" + Date.now(),
        sender: "bot",
        text: "⚠️ Please select a task from the left sidebar.",
      });
      setIsTyping(false);
      return;
    }

    try {
      // 🔑 GET **ID TOKEN** (THIS IS CORRECT)
      // const token = await getIdToken();
      const token = await getAccessToken();
      console.log("Authorization Header Value:", `Bearer ${token}`);

      if (!token) {
        throw new Error("No ID token found");
      }

      const res = await sendChatMessage(
        chat.id,
        text,
        user.email,
        token
      );

      addMessage({
        id: "bot_" + Date.now(),
        sender: "bot",
        text: res.reply || res.message || "No response from server",
      });
    } catch (err) {
      console.error("Chat API error", err);
      addMessage({
        id: "err_" + Date.now(),
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

        {chat?.messages?.map((m) => (
          <div key={m.id} className={`msg-row ${m.sender}`}>
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

          <button className="cw-icon cw-mic">
            <MicIcon />
          </button>

          <button className="cw-send" onClick={handleSend}>
            <SendIcon />
          </button>
        </div>
      </div>
    </main>
  );
};

export default ChatWindow;
