const getBotToken = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("Missing TELEGRAM_BOT_TOKEN in .env.local");
  return token;
};

export async function sendTelegramMessage(chatId: string, text: string, replyMarkup?: any) {
  const url = `https://api.telegram.org/bot${getBotToken()}/sendMessage`;
  
  const body: any = {
    chat_id: chatId,
    text: text,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  };

  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[telegram] Failed to send message:", error);
    throw new Error(`Telegram API error: ${error}`);
  }
  
  return response.json();
}

export async function sendTelegramDocument(chatId: string, documentUrl: string, caption?: string) {
  const url = `https://api.telegram.org/bot${getBotToken()}/sendDocument`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      document: documentUrl,
      caption: caption,
      parse_mode: "Markdown",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[telegram] Failed to send document:", error);
    throw new Error(`Telegram API error: ${error}`);
  }
  
  return response.json();
}

export async function sendTelegramChatAction(chatId: string, action: "typing" | "upload_document" = "typing") {
  const url = `https://api.telegram.org/bot${getBotToken()}/sendChatAction`;
  
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, action }),
  }).catch(() => {}); // ignore errors for chat actions
}
