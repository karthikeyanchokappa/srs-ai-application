// src/App.jsx
import React, { useState, useEffect } from "react";
import Login from "./Components/Login/Login";
import Chat from "./Components/Chat/Chat";
import { logout } from "./AWS/auth";

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

  // REAL LOGOUT (Cognito + UI)
  const handleLogout = async () => {
    await logout();            // terminate Cognito session
    setAuthenticated(false);  // reset UI
  };

  return authenticated ? (
    <div className={`layout ${theme}`}>
      <Chat
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
    </div>
  ) : (
    <Login onAuthenticate={() => setAuthenticated(true)} />
  );
};

export default App;
