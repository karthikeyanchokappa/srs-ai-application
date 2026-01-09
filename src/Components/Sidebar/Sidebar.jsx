// src/Components/Sidebar/Sidebar.jsx
import React, { useState } from "react";
import "./Sidebar.css";

import {
  ChatIcon,
  EditIcon,
  DeleteIcon,
  PlusIcon,
  SunIcon,
  MoonIcon,
} from "./icons";

const Sidebar = ({
  user,               // logged-in user profile
  chats = [],
  activeId,
  setActive,
  onCreate,
  onDelete,
  onRename,
  theme,
  toggleTheme,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  // Filter chats
  const filteredChats = search
    ? chats.filter((c) =>
        c.title.toLowerCase().includes(search.trim().toLowerCase())
      )
    : chats;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setProfileOpen(false);
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      {/* TOP BAR */}
      <div className="sidebar-topbar">
        <button className="menu-btn" onClick={toggleSidebar}>
          ☰
        </button>
        {sidebarOpen && <div className="sidebar-logo">ChatAI</div>}
      </div>

      {/* SEARCH */}
      {sidebarOpen && (
        <div className="sidebar-search-container">
          <input
            type="text"
            className="sidebar-search"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              className="icon-btn clear-btn"
              onClick={() => setSearch("")}
            >
              ✖
            </button>
          )}
        </div>
      )}

      {/* NEW CHAT */}
      {sidebarOpen && (
        <button className="new-chat-btn" onClick={onCreate}>
          <PlusIcon />
          <span>New Chat</span>
        </button>
      )}

      {sidebarOpen && <div className="label">Your Chats</div>}

      {/* CHAT LIST */}
      <div className="chat-list">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${
              chat.id === activeId ? "active" : ""
            }`}
            onClick={() => setActive(chat.id)}
          >
            <div className="chat-left">
              <ChatIcon />
              {sidebarOpen && (
                <span className="chat-title">{chat.title}</span>
              )}
            </div>

            {sidebarOpen && (
              <div className="chat-right">
                <button
                  className="icon-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRename(chat.id);
                  }}
                >
                  <EditIcon />
                </button>

                <button
                  className="icon-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(chat.id);
                  }}
                >
                  <DeleteIcon />
                </button>
              </div>
            )}
          </div>
        ))}

        {sidebarOpen && filteredChats.length === 0 && (
          <div className="no-chats">No chats found</div>
        )}
      </div>

      {/* PROFILE */}
      {sidebarOpen && (
        <div className="profile-container">
          <div
            className="profile-row"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="profile-avatar">
              {user?.initial || "U"}
            </div>

            <div className="profile-info">
              <div className="profile-name">
                {user?.name || "Your Name"}
              </div>
              <div className="profile-email">
                {user?.email}
              </div>
            </div>
          </div>

          {profileOpen && (
            <div className="profile-dropdown">
              <button className="dropdown-item">
                Help & Support
              </button>

              <button
                className="dropdown-item"
                onClick={onLogout}
              >
                Sign out
              </button>

              <div className="dropdown-divider"></div>

              <div className="theme-row">
                <span>Theme</span>
                <button
                  className="icon-btn"
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? (
                    <SunIcon />
                  ) : (
                    <MoonIcon />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
