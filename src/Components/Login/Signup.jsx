import React, { useState } from "react";
import "./Login.css";
<<<<<<< HEAD
=======
import { signUp } from "../../AWS/auth";
>>>>>>> feature/test

const Signup = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

<<<<<<< HEAD
  const createAccount = () => {
=======
  // FIXED createAccount function
  const createAccount = async () => {
>>>>>>> feature/test
    if (!email.trim() || !password.trim()) {
      alert("Please enter all fields.");
      return;
    }

<<<<<<< HEAD
    alert("Account created! (Fake mode now)\nLater connect to AWS Cognito.");
    onBack();
=======
    try {
      const res = await signUp(email, password);
      alert("Account created! OTP sent to your email.");
      onBack(); // go back to login screen
    } catch (err) {
      alert(err.message || "Signup failed");
    }
>>>>>>> feature/test
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
