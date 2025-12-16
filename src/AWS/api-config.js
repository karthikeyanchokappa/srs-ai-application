// ===============================
//  API CONFIG FOR AWS GATEWAY
// ===============================

import { getToken } from "../AWS/auth"; // adjust path if needed

export const API_BASE_URL =
  "https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod";

export const ENDPOINTS = {
  chat: `${API_BASE_URL}/chat`,
  upload: `${API_BASE_URL}/upload`,
};

// ===============================
//  Reusable Request Handler
// ===============================
async function apiRequest(url, method = "POST", body = {}) {
  const token = await getToken(); // <-- GET TOKEN AUTOMATICALLY

  const headers = {
    "Content-Type": "application/json",
  };

  // attach authorization token
  if (token) headers["Authorization"] = token;

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return {
        success: false,
        error: `API Error: ${res.status}`,
      };
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
//  SEND CHAT MESSAGE TO AI BACKEND
// ===============================
export async function sendChatMessage(chatId, text) {
  return apiRequest(ENDPOINTS.chat, "POST", {
    chatId,
    userMessage: text,
  });
}

// ===============================
//  UPLOAD FILE TO S3 (via Lambda)
// ===============================
export async function uploadFile(file) {
  const base64 = await fileToBase64(file);

  return apiRequest(ENDPOINTS.upload, "POST", {
    fileName: file.name,
    fileType: file.type,
    fileData: base64,
  });
}

// Convert file → base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
  });
}
