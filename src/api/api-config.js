// ===============================
// API CONFIG FOR AWS API GATEWAY
// ===============================

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
  chat: `${API_BASE_URL}/chat`,
};

// ===============================
// SEND CHAT MESSAGE (JWT AUTH)
// ===============================
export const sendChatMessage = async (
  chatId,
  text,
  userEmail,
  idToken // ✅ ID TOKEN
) => {
  if (!idToken) {
    throw new Error("No ID token provided");
  }

  const payload = {
    action: "prompt",
    session: {
      UserId: userEmail,
      SessionId: chatId,
      UserPrompt: text,
    },
  };

  const response = await fetch(ENDPOINTS.chat, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${idToken}`, // ✅ FIXED
    },
    body: JSON.stringify(payload),
  });

  console.log("Authorization Header Value:", `Bearer ${idToken}`);

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API Error ${response.status}: ${errText}`);
  }

  return response.json();
};
