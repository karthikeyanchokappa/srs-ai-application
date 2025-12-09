import AWS from "aws-sdk";
import OpenAI from "openai";

// ---------- CONFIG ----------
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE = "ChatMessages"; // Same name as schema.json

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Add this in Lambda environment
});

// ---------- SAVE MESSAGE ----------
async function saveMessage(chatId, messageId, sender, text) {
  await dynamo
    .put({
      TableName: TABLE,
      Item: {
        chatId,
        messageId,
        sender,
        text,
        createdAt: Date.now()
      }
    })
    .promise();
}

// ---------- GET ALL MESSAGES ----------
async function getMessages(chatId) {
  const data = await dynamo
    .query({
      TableName: TABLE,
      KeyConditionExpression: "chatId = :c",
      ExpressionAttributeValues: { ":c": chatId }
    })
    .promise();

  return data.Items.sort((a, b) => a.createdAt - b.createdAt);
}

// ---------- LAMBDA HANDLER ----------
export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { chatId, userMessage } = body;

    if (!chatId || !userMessage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "chatId or message missing" })
      };
    }

    const userMsgId = `msg_${Date.now()}`;

    // 1️⃣ Save user message
    await saveMessage(chatId, userMsgId, "user", userMessage);

    // 2️⃣ Generate AI response
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage }
      ]
    });

    const botText = aiResponse.choices[0].message.content;
    const botMsgId = `msg_${Date.now()}_bot`;

    // 3️⃣ Save bot message
    await saveMessage(chatId, botMsgId, "bot", botText);

    // 4️⃣ Return response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        botMessage: botText
      })
    };
  } catch (err) {
    console.error("Error in chatHandler:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  }
};
