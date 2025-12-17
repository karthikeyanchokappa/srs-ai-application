import React, { useState } from "react";
import "./Login.css";
import OtpScreen from "./OtpScreen";
<<<<<<< HEAD
import ForgotPassword from "./ForgotPassword";
import Signup from "./Signup";

const Login = ({ onAuthenticate }) => {
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ Google Login Placeholder
  const handleGoogleLogin = () => {
    alert("Google login coming soon! (Development Mode)");
  };

  // ⭐ LOGIN FUNCTION WITH LOADING
  const fakeLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
=======
import { sendOtp, logout } from "../../AWS/auth";

const Login = ({ onAuthenticate }) => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError("Email is required");
>>>>>>> feature/test
      return;
    }

    setError("");
    setLoading(true);

<<<<<<< HEAD
    // Fake API delay
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 1000);
=======
    try {
      // 🔥 IMPORTANT: clear any existing session
      await logout();

      // 🔥 always start a fresh OTP flow
      await sendOtp(email);

      setStep("otp");
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    }

    setLoading(false);
>>>>>>> feature/test
  };

  return (
    <div className="login-page fade-in">

<<<<<<< HEAD
      {/* ============================= */}
      {/* LOGIN SCREEN */}
      {/* ============================= */}
      {step === "login" && (
        <div className="login-card slide-up">

          <h1 className="login-title">Welcome Back</h1>
          <p className="login-sub">Sign in to continue</p>

          {/* Email */}
=======
      {step === "email" && (
        <div className="login-card slide-up">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-sub">Enter your email to continue</p>

>>>>>>> feature/test
          <div className="input-group">
            <span className="material-symbols-outlined input-icon">mail</span>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

<<<<<<< HEAD
          {/* Password */}
          <div className="input-group">
            <span className="material-symbols-outlined input-icon">lock</span>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Show/Hide Password */}
            <span
              className="material-symbols-outlined pass-toggle"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "visibility_off" : "visibility"}
            </span>
          </div>

          {/* Error */}
          {error && <p className="error-text">{error}</p>}

          {/* Login Button with Spinner */}
          <button className="login-btn" disabled={loading} onClick={fakeLogin}>
            {loading ? <span className="spinner"></span> : "Login"}
          </button>

          {/* Forgot Password */}
          <button
            className="forgot-text"
            onClick={() => setStep("forgot")}
          >
            Forgot Password?
          </button>

          <div className="divider">or</div>

          {/* Google Login Button */}
          <button className="google-btn" onClick={handleGoogleLogin}>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="google-logo"
              alt="google"
            />
            Continue with Google
          </button>

          {/* Create Account */}
          <button
            className="create-account"
            onClick={() => setStep("signup")}
          >
            Create a new account
          </button>

          <p className="footer-text">Your secure login page</p>
        </div>
      )}

      {/* ============================= */}
      {/* OTP SCREEN */}
      {/* ============================= */}
      {step === "otp" && (
        <OtpScreen
          email={email}
          onSuccess={() => onAuthenticate()}
          onBack={() => setStep("login")}
        />
      )}

      {/* ============================= */}
      {/* FORGOT PASSWORD */}
      {/* ============================= */}
      {step === "forgot" && (
        <ForgotPassword onBack={() => setStep("login")} />
      )}

      {/* ============================= */}
      {/* SIGNUP SCREEN */}
      {/* ============================= */}
      {step === "signup" && (
        <Signup onBack={() => setStep("login")} />
      )}

=======
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

>>>>>>> feature/test
    </div>
  );
};

export default Login;
