import React, { useState } from "react";
import "./Login.css";
import OtpScreen from "./OtpScreen";
import ForgotPassword from "./ForgotPassword";
import Signup from "./Signup";
import { login } from "../../AWS/auth";

const Login = ({ onAuthenticate }) => {
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Google Login Placeholder
  const handleGoogleLogin = () => {
    alert("Google login coming soon! (Development Mode)");
  };

  // REAL LOGIN FUNCTION
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      console.log("Login success:", res);

      // MFA/OTP enabled
      if (res.challengeName === "SMS_MFA") {
        setStep("otp");
      } else {
        onAuthenticate(); // logged in
      }

    } catch (err) {
      setError(err.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="login-page fade-in">

      {step === "login" && (
        <div className="login-card slide-up">

          <h1 className="login-title">Welcome Back</h1>
          <p className="login-sub">Sign in to continue</p>

          {/* Email */}
          <div className="input-group">
            <span className="material-symbols-outlined input-icon">mail</span>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <span className="material-symbols-outlined input-icon">lock</span>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="material-symbols-outlined pass-toggle"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "visibility_off" : "visibility"}
            </span>
          </div>

          {error && <p className="error-text">{error}</p>}

          {/* LOGIN BUTTON (FIXED) */}
          <button className="login-btn" disabled={loading} onClick={handleLogin}>
            {loading ? <span className="spinner"></span> : "Login"}
          </button>

          {/* Forgot Password */}
          <button className="forgot-text" onClick={() => setStep("forgot")}>
            Forgot Password?
          </button>

          <div className="divider">or</div>

          {/* Google Login */}
          <button className="google-btn" onClick={handleGoogleLogin}>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="google-logo"
              alt="google"
            />
            Continue with Google
          </button>

          {/* Signup */}
          <button
            className="create-account"
            onClick={() => setStep("signup")}
          >
            Create a new account
          </button>

          <p className="footer-text">Your secure login page</p>
        </div>
      )}

      {step === "otp" && (
        <OtpScreen
          email={email}
          onSuccess={() => onAuthenticate()}
          onBack={() => setStep("login")}
        />
      )}

      {step === "forgot" && (
        <ForgotPassword onBack={() => setStep("login")} />
      )}

      {step === "signup" && (
        <Signup onBack={() => setStep("login")} />
      )}

    </div>
  );
};

export default Login;
