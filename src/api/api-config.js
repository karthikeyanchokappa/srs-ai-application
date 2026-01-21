// ===============================
// API CONFIG FOR AWS API GATEWAY
// ===============================

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
  chat: `${API_BASE_URL}/chat`,
  initialise: `${API_BASE_URL}/initialise`,
  rename: `${API_BASE_URL}/rename`,
  delete: `${API_BASE_URL}/delete`,
};

// ===============================
// SEND CHAT MESSAGE
// ===============================
export const sendChatMessage = async (
  chatId,
  text,
  userEmail,
  token
) => {
  if (!token) throw new Error("No token provided");

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
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Chat API Error ${response.status}: ${errText}`);
  }

  return response.json();
};

// ===============================
// INITIALISE CHAT
// ===============================
export const initialiseChat = async (
  token,
  email,
  sessionId = null
) => {
  if (!token || !email) {
    throw new Error("Token or email missing");
  }

  const response = await fetch(ENDPOINTS.initialise, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      session: {
        UserId: email,
        SessionId: sessionId,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Initialise failed: ${errText}`);
  }

  return response.json();
};

// ===============================
// ✏️ RENAME CHAT
// ===============================
export const renameChat = async (
  token,
  userEmail,
  sessionId,
  title
) => {
  const res = await fetch(ENDPOINTS.rename, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      session: {
        UserId: userEmail,
        SessionId: sessionId,
        Title: title,
      },
    }),
  });

  if (!res.ok) throw new Error("Rename failed");
};

// ===============================
// 🗑️ DELETE CHAT  ✅ FIX
// ===============================
export const deleteChat = async (
  token,
  userEmail,
  sessionId
) => {
  const res = await fetch(ENDPOINTS.delete, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      session: {
        UserId: userEmail,
        SessionId: sessionId,
      },
    }),
  });

  if (!res.ok) throw new Error("Delete failed");
};
