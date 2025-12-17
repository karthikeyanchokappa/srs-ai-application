import React, { useState, useRef } from "react";
import "./Login.css";
<<<<<<< HEAD

const OtpScreen = ({ email, onSuccess, onBack }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
=======
import { verifyOtp } from "../../AWS/auth";

const OtpScreen = ({ email, onSuccess, onBack }) => {
  // 🔥 Cognito Email OTP = 8 digits
  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
>>>>>>> feature/test
  const inputs = useRef([]);

  const handleChange = (value, index) => {
    if (value.length > 1) value = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

<<<<<<< HEAD
    // Auto move next
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (key, index) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
=======
    // Auto-focus next input
    if (value && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
>>>>>>> feature/test
    }
  };

  const handlePaste = (e) => {
    const data = e.clipboardData.getData("Text").trim();
<<<<<<< HEAD
    if (data.length === 6) {
      const arr = data.split("").slice(0, 6);
      setOtp(arr);
      inputs.current[5].focus();
    }
  };

  const verifyOTP = () => {
    if (otp.join("") === "123456") {
      onSuccess();
    } else {
      alert("Incorrect OTP. Try 123456 in test mode.");
=======

    // Accept only 8-digit OTP
    if (/^\d{8}$/.test(data)) {
      setOtp(data.split(""));
      inputs.current[7]?.focus();
    }
  };

  const handleVerify = async () => {
    try {
      await verifyOtp(otp.join(""));
      onSuccess();
    } catch (err) {
      alert(err.message || "Invalid OTP");
>>>>>>> feature/test
    }
  };

  return (
    <div className="login-page fade-in">
      <div className="login-card slide-up">
<<<<<<< HEAD
        
        <h1 className="login-title">Verify OTP</h1>
        <p className="login-sub">
          OTP sent to <b>{email}</b>
        </p>

        <div className="otp-container" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="number"
              className="otp-box"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleBackspace(e.key, index)}
              ref={(el) => (inputs.current[index] = el)}
=======

        <h1 className="login-title">Verify OTP</h1>
        <p className="login-sub">
          Enter the 8-digit OTP sent to <b>{email}</b>
        </p>

        <div className="otp-container" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              className="otp-box"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleBackspace(e, i)}
              ref={(el) => (inputs.current[i] = el)}
>>>>>>> feature/test
            />
          ))}
        </div>

<<<<<<< HEAD
        <button className="login-btn" onClick={verifyOTP}>
          Verify
        </button>

        <button className="back-btn" onClick={onBack}>
          ← Back to Login
        </button>
=======
        <button className="login-btn" onClick={handleVerify}>
          Verify & Login
        </button>

        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>

>>>>>>> feature/test
      </div>
    </div>
  );
};

export default OtpScreen;
