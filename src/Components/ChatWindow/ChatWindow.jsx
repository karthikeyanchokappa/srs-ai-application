<<<<<<< HEAD
// src/Components/ChatWindow/ChatWindow.jsx

=======
>>>>>>> feature/test
import React, { useEffect, useRef, useState } from "react";
import "./ChatWindow.css";
import { UploadIcon, MicIcon, SendIcon } from "./InputIcons";
import MarkdownRenderer from "./MarkdownRenderer";
<<<<<<< HEAD

// Simulated API
const sendToApiDefault = async (messages) => {
  await new Promise((r) => setTimeout(r, 500));
  return {
    success: true,
    text: "Simulated reply: " + messages[messages.length - 1]?.text,
  };
};
=======
import { sendMessageToBackend } from "../../api/chatApi";
>>>>>>> feature/test

const ChatWindow = ({ chat, updateMessages }) => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

<<<<<<< HEAD
  /* AUTO-SCROLL */
=======
  /* AUTO SCROLL */
>>>>>>> feature/test
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
<<<<<<< HEAD
    updateMessages(chat.messages.filter((msg) => msg.id !== id));
  };

  /* REACTIONS — 👍 👎 */
  const handleReaction = (id, type) => {
    updateMessages(
      chat.messages.map((msg) =>
        msg.id === id ? { ...msg, reaction: type } : msg
=======
    updateMessages(chat.messages.filter((m) => m.id !== id));
  };

  /* REACTIONS */
  const handleReaction = (id, type) => {
    updateMessages(
      chat.messages.map((m) =>
        m.id === id ? { ...m, reaction: type } : m
>>>>>>> feature/test
      )
    );
  };

<<<<<<< HEAD
  /* SEND MESSAGE */
=======
  /* SEND MESSAGE → BACKEND */
>>>>>>> feature/test
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

<<<<<<< HEAD
    const userMsg = { id: Date.now().toString(), sender: "user", text };
=======
    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };
>>>>>>> feature/test

    addMessage(userMsg);
    setInput("");
    setIsTyping(true);

<<<<<<< HEAD
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
=======
    try {
      const res = await sendMessageToBackend(text);

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: res.reply || "No response from server",
      };

      addMessage(botMsg);
    } catch (err) {
      addMessage({
        id: "err_" + Date.now(),
        sender: "bot",
        text: "❌ Failed to connect to server",
      });
    } finally {
      setIsTyping(false);
    }
  };

  /* REGENERATE MESSAGE */
  const regenerateMessage = async (prompt) => {
    setIsTyping(true);

    try {
      const res = await sendMessageToBackend(prompt);

      addMessage({
        id: `regen_${Date.now()}`,
        sender: "bot",
        text: res.reply || "No response from server",
      });
    } catch {
      addMessage({
        id: `regen_err_${Date.now()}`,
        sender: "bot",
        text: "❌ Failed to regenerate response",
      });
    } finally {
      setIsTyping(false);
    }
  };

  /* AUTO GROW TEXTAREA */
>>>>>>> feature/test
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  return (
    <main className="chat-main chat-layout">
<<<<<<< HEAD
      {/* WELCOME SCREEN */}
=======
      {/* WELCOME */}
>>>>>>> feature/test
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
<<<<<<< HEAD

                  {/* MESSAGE CONTENT */}
                  <MarkdownRenderer text={m.text} />

                  {/* 🔥 ACTION BAR (Copy / Delete / Regenerate / Reactions) */}
                  <div className="msg-actions-row">

                    {/* Copy */}
                    <button
                      className="msg-action-btn"
                      title="Copy message"
                      onClick={() => navigator.clipboard.writeText(m.text)}
=======
                  <MarkdownRenderer text={m.text} />

                  <div className="msg-actions-row">
                    {/* COPY */}
                    <button
                      className="msg-action-btn"
                      onClick={() =>
                        navigator.clipboard.writeText(m.text)
                      }
>>>>>>> feature/test
                    >
                      <span className="material-symbols-outlined">
                        content_copy
                      </span>
                    </button>

<<<<<<< HEAD
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
=======
                    {/* DELETE */}
                    <button
                      className="msg-action-btn"
                      onClick={() => deleteMessage(m.id)}
                    >
                      <span className="material-symbols-outlined">
                        delete
                      </span>
                    </button>

                    {/* REGENERATE */}
                    {m.sender === "bot" && (
                      <button
                        className="msg-action-btn"
                        onClick={() => regenerateMessage(m.text)}
                      >
                        <span className="material-symbols-outlined">
                          refresh
                        </span>
                      </button>
                    )}

                    {/* REACTIONS */}
                    {m.sender === "bot" && (
                      <>
>>>>>>> feature/test
                        <button
                          className={`reaction-btn up ${
                            m.reaction === "up" ? "active" : ""
                          }`}
                          onClick={() => handleReaction(m.id, "up")}
<<<<<<< HEAD
                          title="Good response"
=======
>>>>>>> feature/test
                        >
                          <span className="material-symbols-outlined">
                            thumb_up
                          </span>
                        </button>

<<<<<<< HEAD
                        {/* 👎 Bad Response */}
=======
>>>>>>> feature/test
                        <button
                          className={`reaction-btn down ${
                            m.reaction === "down" ? "active down" : ""
                          }`}
                          onClick={() => handleReaction(m.id, "down")}
<<<<<<< HEAD
                          title="Poor response"
=======
>>>>>>> feature/test
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

<<<<<<< HEAD
            {/* TYPING INDICATOR */}
=======
            {/* TYPING */}
>>>>>>> feature/test
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
<<<<<<< HEAD

=======
>>>>>>> feature/test
          <label className="cw-icon cw-upload">
            <UploadIcon />
            <input type="file" className="file-input" />
          </label>

          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Ask anything..."
            value={input}
<<<<<<< HEAD
=======
            rows={1}
>>>>>>> feature/test
            onChange={(e) => {
              setInput(e.target.value);
              resizeTextarea();
            }}
<<<<<<< HEAD
            rows={1}
=======
>>>>>>> feature/test
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
<<<<<<< HEAD

=======
>>>>>>> feature/test
        </div>
      </div>
    </main>
  );
};

export default ChatWindow;
