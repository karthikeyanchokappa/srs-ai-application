// ===============================
//  API CONFIG FOR AWS GATEWAY
// ===============================

// 👇 Replace these with your API Gateway Invoke URLs
export const API_BASE_URL = "https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod";

export const ENDPOINTS = {
  chat: `${API_BASE_URL}/chat`,
  upload: `${API_BASE_URL}/upload`
};

// ===============================
//  SEND MESSAGE TO AI BACKEND
// ===============================
export async function sendChatMessage(chatId, text) {
  try {
    const res = await fetch(ENDPOINTS.chat, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId,
        userMessage: text
      })
    });

    return await res.json();
  } catch (err) {
    console.error("Chat API Error:", err);
    return { success: false, error: "Network error" };
  }
}

// ===============================
//  UPLOAD FILE TO S3 (via Lambda)
// ===============================
export async function uploadFile(file) {
  const base64 = await toBase64(file);

  try {
    const res = await fetch(ENDPOINTS.upload, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileData: base64
      })
    });

    return await res.json();
  } catch (err) {
    console.error("Upload API Error:", err);
    return { success: false, error: "Upload failed" };
  }
}

// Convert file → base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
  });
}
