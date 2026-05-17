import { generateClassgridRagAnswer } from "@/lib/ai/rag-answer";
import {
  appendTelegramConversationMessage,
  getTelegramConversationHistory,
} from "@/lib/telegram/conversation-memory";
import { sendTelegramMessage, sendTelegramDocument, sendTelegramChatAction } from "@/lib/telegram/bot-api";

// A dummy URL for the brochure. In production, this would be your actual PDF link on your server or CDN.
const BROCHURE_URL = "https://classgrid.in/assets/classgrid-brochure.pdf";

export async function handleInboundTelegramMessage(payload: any) {
  // --- 1. Handle Button Clicks (Callback Queries) ---
  if (payload.callback_query) {
    const callbackData = payload.callback_query.data;
    const chatId = String(payload.callback_query.message.chat.id);
    
    let userText = "";
    if (callbackData === "action_demo") userText = "I want to book a demo.";
    if (callbackData === "action_brochure") userText = "Please send me the brochure.";
    if (callbackData === "action_support") userText = "How do I contact support?";
    if (callbackData === "action_features") userText = "What features does ClassGrid have?";

    // Answer the callback query so the loading spinner on the button stops
    fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: payload.callback_query.id })
    }).catch(console.error);

    if (userText) {
      const userName = [payload.callback_query.from?.first_name, payload.callback_query.from?.last_name].filter(Boolean).join(" ");
      await processUserText(chatId, userText, String(payload.callback_query.id), userName);
    }
    return;
  }

  // --- 2. Handle Normal Text Messages ---
  const message = payload.message || payload.edited_message;
  if (!message || !message.text || !message.chat || !message.chat.id) return;

  const chatId = String(message.chat.id);
  const text = message.text.trim();
  const messageId = String(message.message_id);

  // If user starts the bot, show the interactive menu!
  if (text === "/start") {
    const welcomeText = "*Welcome to ClassGrid!* 🏫\n\nI am the ClassGrid AI Assistant. I can help you understand our platform, book a demo, or send you our brochure.\n\nHow can I help you today?";
    const keyboard = {
      inline_keyboard: [
        [
          { text: "🚀 Book a Demo", callback_data: "action_demo" },
          { text: "📄 Get Brochure", callback_data: "action_brochure" }
        ],
        [
          { text: "✨ Platform Features", callback_data: "action_features" },
          { text: "🎧 Contact Support", callback_data: "action_support" }
        ]
      ]
    };
    await sendTelegramMessage(chatId, welcomeText, keyboard);
    return;
  }

  // Extract user's name from Telegram payload
  const userName = [message.from?.first_name, message.from?.last_name].filter(Boolean).join(" ");

  // Otherwise, process as a normal question
  await processUserText(chatId, text, messageId, userName);
}

// Extracted the core processing logic so both text and buttons can use it
async function processUserText(chatId: string, text: string, messageId: string, userName?: string) {
  // 1. Save user's incoming message
  await appendTelegramConversationMessage({
    chatId,
    role: "user",
    content: text,
    messageId,
  });

  // 2. Fetch history
  const history = await getTelegramConversationHistory(chatId);

  // Show "typing..." indicator in Telegram
  await sendTelegramChatAction(chatId, "typing");

  // 3. Generate AI response via RAG
  const result = await generateClassgridRagAnswer({
    question: text,
    channel: "telegram",
    history,
    userName,
  });

  let answer = result.answer || "Sorry, I am having trouble understanding right now. Please try again later.";

  // 4. Check if the AI determined a brochure should be sent
  const wantsBrochure = answer.includes("[SEND_BROCHURE]");
  
  if (wantsBrochure) {
    answer = answer.replace(/\[SEND_BROCHURE\]/g, "").trim();
    if (!answer) {
        answer = "Here is the official ClassGrid brochure with all the details you requested! 📄";
    }
  }

  // 5. Send the text response
  await sendTelegramMessage(chatId, answer);

  // 6. If requested, send the brochure document
  if (wantsBrochure) {
    try {
        await sendTelegramDocument(chatId, BROCHURE_URL, "ClassGrid Brochure");
    } catch (e) {
        console.error("Failed to send brochure document via Telegram", e);
    }
  }

  // 7. Save assistant's reply to history
  await appendTelegramConversationMessage({
    chatId,
    role: "assistant",
    content: answer,
  });
}
