import React, { useState } from "react";
import "./Login.css";
<<<<<<< HEAD

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState("");

  const sendReset = () => {
=======
import { forgotPassword, confirmForgotPassword } from "../../AWS/auth";

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("request"); // request → verify
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // STEP 1: Send reset code
  const sendResetCode = async () => {
>>>>>>> feature/test
    if (!email.trim()) {
      alert("Enter your email.");
      return;
    }

<<<<<<< HEAD
    alert("Password reset link sent to " + email + "\n(Fake mode now)");
=======
    try {
      await forgotPassword(email);
      alert("Reset code sent to " + email);
      setStep("verify");
    } catch (err) {
      alert(err.message || "Failed to send reset code");
    }
  };

  // STEP 2: Submit OTP + new password
  const resetPassword = async () => {
    if (!otp.trim() || !newPassword.trim()) {
      alert("Enter OTP and new password.");
      return;
    }

    try {
      await confirmForgotPassword(email, otp, newPassword);
      alert("Password reset successfully!");
      onBack(); // return to login
    } catch (err) {
      alert(err.message || "Password reset failed");
    }
>>>>>>> feature/test
  };

  return (
    <div className="login-page fade-in">
      <div className="login-card slide-up">

<<<<<<< HEAD
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
=======
        {step === "request" && (
          <>
            <h1 className="login-title">Reset Password</h1>
            <p className="login-sub">Enter your email to get OTP code</p>

            <div className="input-group">
              <span className="material-symbols-outlined input-icon">mail</span>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button className="login-btn" onClick={sendResetCode}>
              Send Reset OTP
            </button>

            <button className="back-btn" onClick={onBack}>
              ← Back to Login
            </button>
          </>
        )}

        {step === "verify" && (
          <>
            <h1 className="login-title">Verify OTP</h1>
            <p className="login-sub">
              Enter OTP sent to <b>{email}</b>
            </p>

            <div className="input-group">
              <span className="material-symbols-outlined input-icon">pin</span>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="input-group">
              <span className="material-symbols-outlined input-icon">lock</span>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button className="login-btn" onClick={resetPassword}>
              Reset Password
            </button>

            <button className="back-btn" onClick={onBack}>
              ← Back to Login
            </button>
          </>
        )}
>>>>>>> feature/test

      </div>
    </div>
  );
};

export default ForgotPassword;
