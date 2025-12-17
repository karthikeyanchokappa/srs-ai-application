import React, { useEffect, useRef, useState } from "react";
import "./ChatWindow.css";
import { UploadIcon, MicIcon, SendIcon } from "./InputIcons";
import MarkdownRenderer from "./MarkdownRenderer";
import { sendMessageToBackend } from "../../api/chatApi";

const ChatWindow = ({ chat, updateMessages }) => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  /* AUTO SCROLL */
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
    updateMessages(chat.messages.filter((m) => m.id !== id));
  };

  /* REACTIONS */
  const handleReaction = (id, type) => {
    updateMessages(
      chat.messages.map((m) =>
        m.id === id ? { ...m, reaction: type } : m
      )
    );
  };

  /* SEND MESSAGE → BACKEND */
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };

    addMessage(userMsg);
    setInput("");
    setIsTyping(true);

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
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  return (
    <main className="chat-main chat-layout">
      {/* WELCOME */}
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
                  <MarkdownRenderer text={m.text} />

                  <div className="msg-actions-row">
                    {/* COPY */}
                    <button
                      className="msg-action-btn"
                      onClick={() =>
                        navigator.clipboard.writeText(m.text)
                      }
                    >
                      <span className="material-symbols-outlined">
                        content_copy
                      </span>
                    </button>

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
                        <button
                          className={`reaction-btn up ${
                            m.reaction === "up" ? "active" : ""
                          }`}
                          onClick={() => handleReaction(m.id, "up")}
                        >
                          <span className="material-symbols-outlined">
                            thumb_up
                          </span>
                        </button>

                        <button
                          className={`reaction-btn down ${
                            m.reaction === "down" ? "active down" : ""
                          }`}
                          onClick={() => handleReaction(m.id, "down")}
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

            {/* TYPING */}
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
