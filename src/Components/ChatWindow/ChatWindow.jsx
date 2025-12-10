// src/Components/ChatWindow/ChatWindow.jsx

import React, { useEffect, useRef, useState } from "react";
import "./ChatWindow.css";
import { UploadIcon, MicIcon, SendIcon } from "./InputIcons";
import MarkdownRenderer from "./MarkdownRenderer";

// Simulated API
const sendToApiDefault = async (messages) => {
  await new Promise((r) => setTimeout(r, 500));
  return {
    success: true,
    text: "Simulated reply: " + messages[messages.length - 1]?.text,
  };
};

const ChatWindow = ({ chat, updateMessages }) => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  /* AUTO-SCROLL */
  useEffect(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, [chat, isTyping]);

  /* ADD MESSAGE */
  const addMessage = (msg) => {
    updateMessages([...(chat.messages || []), msg]);
  };

  /* DELETE MESSAGE */
  const deleteMessage = (id) => {
    updateMessages(chat.messages.filter((msg) => msg.id !== id));
  };

  /* REACTIONS — 👍 👎 */
  const handleReaction = (id, type) => {
    updateMessages(
      chat.messages.map((msg) =>
        msg.id === id ? { ...msg, reaction: type } : msg
      )
    );
  };

  /* SEND MESSAGE */
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: Date.now().toString(), sender: "user", text };

    addMessage(userMsg);
    setInput("");
    setIsTyping(true);

    const response = await sendToApiDefault([...chat.messages, userMsg]);
    setIsTyping(false);

    const botMsg = {
      id: (Date.now() + 1).toString(),
      sender: "bot",
      text: response.text,
    };

    addMessage(botMsg);
  };

  /* REGENERATE */
  const regenerateMessage = async (prompt) => {
    setIsTyping(true);
    const res = await sendToApiDefault([{ sender: "user", text: prompt }]);
    setIsTyping(false);

    addMessage({
      id: `regen_${Date.now()}`,
      sender: "bot",
      text: res.text,
    });
  };

  /* AUTO-GROW TEXTAREA */
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  return (
    <main className="chat-main chat-layout">
      {/* WELCOME SCREEN */}
      {chat.messages.length === 0 ? (
        <div className="welcome-screen">
          <div className="welcome-inner">
            <h1 className="welcome-title">What are you working on?</h1>
          </div>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="chatgpt-header">
            <div className="model-name">ChatAI Model</div>
          </div>

          {/* MESSAGES */}
          <div className="messages" ref={scrollRef}>
            {chat.messages.map((m) => (
              <div key={m.id} className={`msg-row ${m.sender}`}>
                <div className="msg-bubble">

                  {/* MESSAGE CONTENT */}
                  <MarkdownRenderer text={m.text} />

                  {/* 🔥 ACTION BAR (Copy / Delete / Regenerate / Reactions) */}
                  <div className="msg-actions-row">

                    {/* Copy */}
                    <button
                      className="msg-action-btn"
                      title="Copy message"
                      onClick={() => navigator.clipboard.writeText(m.text)}
                    >
                      <span className="material-symbols-outlined">
                        content_copy
                      </span>
                    </button>

                    {/* Delete */}
                    <button
                      className="msg-action-btn"
                      title="Delete message"
                      onClick={() => deleteMessage(m.id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>

                    {/* Regenerate — only for bot */}
                    {m.sender === "bot" && (
                      <button
                        className="msg-action-btn"
                        title="Regenerate response"
                        onClick={() => regenerateMessage(m.text)}
                      >
                        <span className="material-symbols-outlined">refresh</span>
                      </button>
                    )}

                    {/* ⭐ Reactions (👍 / 👎) — only for bot */}
                    {m.sender === "bot" && (
                      <>
                        {/* 👍 Good Response */}
                        <button
                          className={`reaction-btn up ${
                            m.reaction === "up" ? "active" : ""
                          }`}
                          onClick={() => handleReaction(m.id, "up")}
                          title="Good response"
                        >
                          <span className="material-symbols-outlined">
                            thumb_up
                          </span>
                        </button>

                        {/* 👎 Bad Response */}
                        <button
                          className={`reaction-btn down ${
                            m.reaction === "down" ? "active down" : ""
                          }`}
                          onClick={() => handleReaction(m.id, "down")}
                          title="Poor response"
                        >
                          <span className="material-symbols-outlined">
                            thumb_down
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* TYPING INDICATOR */}
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
        </>
      )}

      {/* INPUT BAR */}
      <div className="chat-input-bar">
        <div className="chat-input-wrapper">

          <label className="cw-icon cw-upload">
            <UploadIcon />
            <input type="file" className="file-input" />
          </label>

          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              resizeTextarea();
            }}
            rows={1}
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