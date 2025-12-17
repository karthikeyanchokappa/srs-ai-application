// ===============================
//  API CONFIG FOR AWS GATEWAY
// ===============================

import { getToken } from "../AWS/auth";

// ✅ FROM ENV (no hardcoding)
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
  chat: `${API_BASE_URL}/chat`,
  upload: `${API_BASE_URL}/upload`,
};

// ===============================
//  Reusable Request Handler
// ===============================
async function apiRequest(url, method = "POST", body = null) {
  const token = await getToken(); // JWT from Cognito

  const headers = {
    "Content-Type": "application/json",
  };

  // ✅ Correct Authorization format
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("API Request Failed:", err);
    return {
      success: false,
      error: err.message || "Network request failed",
    };
  }
}

// ===============================
//  SEND CHAT MESSAGE
// ===============================
export async function sendChatMessage(chatId, text) {
  return apiRequest(ENDPOINTS.chat, "POST", {
    chatId,
    userMessage: text,
  });
}

// ===============================
//  UPLOAD FILE
// ===============================
export async function uploadFile(file) {
  const base64 = await fileToBase64(file);

  return apiRequest(ENDPOINTS.upload, "POST", {
    fileName: file.name,
    fileType: file.type,
    fileData: base64,
  });
}

// ===============================
//  FILE → BASE64
// ===============================
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
  });
}
