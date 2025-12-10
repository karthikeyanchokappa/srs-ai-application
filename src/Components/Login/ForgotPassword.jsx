import React, { useState } from "react";
import "./Login.css";

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState("");

  const sendReset = () => {
    if (!email.trim()) {
      alert("Enter your email.");
      return;
    }

    alert("Password reset link sent to " + email + "\n(Fake mode now)");
  };

  return (
    <div className="login-page fade-in">
      <div className="login-card slide-up">

        <h1 className="login-title">Reset Password</h1>
        <p className="login-sub">Enter your email to get reset link</p>

        <div className="input-group">
          <span className="material-symbols-outlined input-icon">mail</span>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={sendReset}>
          Send Reset Link
        </button>

        <button className="back-btn" onClick={onBack}>
          ← Back to Login
        </button>

      </div>
    </div>
  );
};

export default ForgotPassword;
