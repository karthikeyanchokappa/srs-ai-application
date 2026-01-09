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
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API Error ${response.status}: ${errText}`);
  }

  return response.json();
};

// ===============================
// GET USER TASKS (TABLE 3)
// ===============================
export const fetchUserTasks = async () => {
  const token = await getIdToken();

  if (!token) {
    throw new Error("No ID token found. User not authenticated.");
  }

  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API Error ${response.status}: ${errText}`);
  }

  return response.json();
};

// ===============================
// GET CHAT HISTORY (TABLE 4)
// ===============================
export const fetchChatHistory = async (taskId) => {
  const token = await getIdToken();

  if (!token) {
    throw new Error("No ID token found. User not authenticated.");
  }

  const response = await fetch(
    `${API_BASE_URL}/chat-history?taskId=${encodeURIComponent(taskId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API Error ${response.status}: ${errText}`);
  }

  return response.json();
};
