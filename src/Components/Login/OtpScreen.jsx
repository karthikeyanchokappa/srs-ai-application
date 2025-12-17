import React, { useState, useRef } from "react";
import "./Login.css";
import { verifyOtp } from "../../AWS/auth";

const OtpScreen = ({ email, onSuccess, onBack }) => {
  // 🔥 Cognito Email OTP = 8 digits
  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (value, index) => {
    if (value.length > 1) value = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const data = e.clipboardData.getData("Text").trim();

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
    }
  };

  return (
    <div className="login-page fade-in">
      <div className="login-card slide-up">

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
            />
          ))}
        </div>

        <button className="login-btn" onClick={handleVerify}>
          Verify & Login
        </button>

        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>

      </div>
    </div>
  );
};

export default OtpScreen;
