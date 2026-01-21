import React, { useState, useEffect } from "react";
import "./Login.css";
import OtpScreen from "./OtpScreen";
import { sendOtp, getAccessToken } from "../../AWS/auth";

const Login = ({ onAuthenticate }) => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ NEW: auto-login if session exists
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          onAuthenticate(); // 🔥 skip login screen
        }
      } catch {
        // no active session → stay on login
      }
    };

    checkSession();
  }, [onAuthenticate]);

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await sendOtp(email);
      setStep("otp");
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    }

    setLoading(false);
  };

  return (
    <div className="login-page fade-in">
      {step === "email" && (
        <div className="login-card slide-up">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-sub">Enter your email to continue</p>

          <div className="input-group">
            <span className="material-symbols-outlined input-icon">mail</span>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button
            className="login-btn"
            onClick={handleSendOtp}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Authenticate"}
          </button>

          <p className="footer-text">Passwordless secure login</p>
        </div>
      )}

      {step === "otp" && (
        <OtpScreen
          email={email}
          onSuccess={onAuthenticate}
          onBack={() => setStep("email")}
        />
      )}
    </div>
  );
};

export default Login;
