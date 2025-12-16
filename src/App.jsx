// src/App.jsx
import React, { useState, useEffect } from "react";
import Login from "./Components/Login/Login";
import Chat from "./Components/Chat/Chat";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  // THEME
  const [theme, setTheme] = useState("light");
  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  // Apply theme to <body>
  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return authenticated ? (
    // 💬 SHOW CHAT ONLY
    <div className={`layout ${theme}`}>
      <Chat
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={() => setAuthenticated(false)}
      />
    </div>
  ) : (
    // 🔐 SHOW LOGIN ONLY
    <Login onAuthenticate={() => setAuthenticated(true)} />
  );
};

export default App;
