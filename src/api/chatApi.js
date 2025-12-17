// src/api/chatApi.js

import { ENDPOINTS } from "./api-config";

export async function sendMessageToBackend(message) {
  const response = await fetch(ENDPOINTS.chat, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json(); // { reply: "..." }
}
