import { useState } from "react";
import { sendMessageToAI } from "../api/ai";

interface AIChatbotProps {
  onClose: () => void;
}

export default function AIChatbot({ onClose }: AIChatbotProps) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<any[]>([]);

  const send = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", text: message };
    setChat(prev => [...prev, userMsg]);
    setMessage("");

    try {
      const res = await sendMessageToAI(userMsg.text);

      setChat(prev => [
        ...prev,
        { role: "bot", text: res.data.reply }
      ]);
    } catch {
      setChat(prev => [
        ...prev,
        { role: "bot", text: "Server error..." }
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white dark:bg-zinc-900 shadow-2xl rounded-xl border border-gray-200 dark:border-zinc-700 flex flex-col z-[9999]">

      {/* HEADER */}
      <div className="flex justify-between items-center p-3 border-b dark:border-zinc-700">
        <h3 className="font-semibold text-sm">CollabFlow AI</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500"
        >
          ✕
        </button>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
        {chat.length === 0 && (
          <p className="text-gray-400">
            Ask anything about your project...
          </p>
        )}

        {chat.map((c, i) => (
          <div
            key={i}
            className={
              c.role === "user"
                ? "text-right"
                : "text-left text-blue-600"
            }
          >
            {c.text}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="p-3 border-t dark:border-zinc-700 flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1 text-sm dark:bg-zinc-800"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />

        <button
          onClick={send}
          className="bg-blue-600 text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}