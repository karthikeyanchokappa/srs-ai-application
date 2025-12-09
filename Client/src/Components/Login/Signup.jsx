import React, { useState } from "react";
import "./Login.css";

const Signup = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createAccount = () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter all fields.");
      return;
    }

    alert("Account created! (Fake mode now)\nLater connect to AWS Cognito.");
    onBack();
  };

  return (
    <div className="login-page fade-in">
      <div className="login-card slide-up">

        <h1 className="login-title">Create Account</h1>
        <p className="login-sub">Sign up and start using our app</p>

        <div className="input-group">
          <span className="material-symbols-outlined input-icon">mail</span>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <span className="material-symbols-outlined input-icon">lock</span>
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={createAccount}>
          Sign Up
        </button>

        <button className="back-btn" onClick={onBack}>
          ← Back to Login
        </button>

      </div>
    </div>
  );
};

export default Signup;
