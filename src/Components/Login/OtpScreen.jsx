import React, { useState, useRef } from "react";
import "./Login.css";
import { confirmSignUp } from "../../AWS/auth";

const OtpScreen = ({ email, onSuccess, onBack }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (value, index) => {
    if (value.length > 1) value = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move next
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (key, index) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const data = e.clipboardData.getData("Text").trim();
    if (data.length === 6) {
      const arr = data.split("").slice(0, 6);
      setOtp(arr);
      inputs.current[5].focus();
    }
  };

  
  const verifyOTP = async () => {
  try {
    const code = otp.join("");
    await confirmSignUp(email, code);
    alert("Account verified!");
    onSuccess();
  } catch (err) {
    alert(err.message || "OTP verification failed");
  }
};

  return (
    <div className="login-page fade-in">
      <div className="login-card slide-up">
        
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
            />
          ))}
        </div>

        <button className="login-btn" onClick={verifyOTP}>
          Verify
        </button>

        <button className="back-btn" onClick={onBack}>
          ← Back to Login
        </button>
      </div>
    </div>
  );
};

export default OtpScreen;
