// ===============================
//  API CONFIG FOR AWS HTTP API
// ===============================

import { getToken } from "../AWS/auth";

// ✅ Base URL from .env
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ HTTP API uses $default route (no /chat)
export const ENDPOINTS = {
  chat: `${API_BASE_URL}`,
};

// ===============================
//  Generic Request Helper
// ===============================
async function apiRequest(url, method = "POST", body = null) {
  let token = null;

  try {
    token = await getToken(); // Cognito JWT (optional if API auth = NONE)
  } catch {
    token = null;
  }

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }

  return res.json();
}

// ===============================
//  SEND CHAT MESSAGE (BACKEND FORMAT)
// ===============================
export async function sendChatMessage(chatId, text) {
  let userEmail = "unknown@user";

  try {
    const token = await getToken();
    const decoded = JSON.parse(atob(token.split(".")[1]));
    userEmail = decoded.email || decoded.username;
  } catch {
    console.warn("Unable to extract user email from token");
  }

  const payload = {
    action: "prompt",
    session: {
      UserId: userEmail,
      SessionId: chatId,
      UserPrompt: text,
    },
  };

  return apiRequest(ENDPOINTS.chat, "POST", payload);
}

