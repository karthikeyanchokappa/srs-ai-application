// ===============================
// API CONFIG FOR AWS API GATEWAY
// ===============================

import { getIdToken } from "../AWS/auth";

// Base URL from .env
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// API endpoints
export const ENDPOINTS = {
  chat: `${API_BASE_URL}/chat`,
};

// ===============================
// SEND CHAT MESSAGE (CHAT → AI)
// ===============================
export const sendChatMessage = async (chatId, text, userEmail) => {
  const token = await getIdToken();

  if (!token) {
    throw new Error("No ID token found. User not authenticated.");
  }

  const payload = {
    action: "prompt",
    session: {
      UserId: userEmail,
      SessionId: chatId, // TaskId
      UserPrompt: text,
    },
  };

  const response = await fetch(ENDPOINTS.chat, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API Error ${response.status}: ${errText}`);
  }

  return response.json();
};

