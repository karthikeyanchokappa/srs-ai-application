import React, { useEffect, useRef, useState } from "react";
import "./ChatWindow.css";
import { UploadIcon, MicIcon, SendIcon } from "./InputIcons";
import MarkdownRenderer from "./MarkdownRenderer";
import { sendChatMessage } from "../../api/api-config";

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
     ADD MESSAGE (✅ FIXED — SAFE)
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

    // Always show user's message immediately
    addMessage({
      id: Date.now().toString(),
      sender: "user",
      text,
    });

    setInput("");
    setIsTyping(true);

    // If chat or user missing → warn but keep UI alive
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
      const res = await sendChatMessage(
        chat.id,
        text,
        user.email
      );

      addMessage({
        id: "bot_" + Date.now(),
        sender: "bot",
        text: res.reply || res.message || "No response from server",
      });
    } catch {
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
      {/* MESSAGES */}
      <div className="messages" ref={scrollRef}>
        {chat?.messages?.length === 0 && (
          <div className="welcome-screen">
            <div className="welcome-inner">
              <h1 className="welcome-title">
                What are you working on?
              </h1>
            </div>
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

      {/* INPUT BAR — OLD UI */}
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

