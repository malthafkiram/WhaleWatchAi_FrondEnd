import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, User, RefreshCw, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../utils/api";

export default function WhaleCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Halo! Saya Whale Copilot, asisten AI khusus crypto milikmu. Apa yang ingin kamu analisis hari ini?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (customMsg = null) => {
    const textToSend = customMsg || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = { id: Date.now(), sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!customMsg) setInput("");
    setLoading(true);

    try {
      const historyToSend = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await api.post("/api/ai/chat", {
        message: textToSend,
        history: historyToSend,
      });

      const aiReply = res.data?.data?.reply || "Maaf, kendala jaringan.";
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: aiReply },
      ]);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.status === 404
          ? "Endpoint AI Chat belum ter-deploy di server target."
          : err.response?.status === 401
            ? "Sesi masuk telah berakhir. Silakan login kembali."
            : err.message || "Gagal menghubungkan ke AI Copilot.");

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: `🚨 Error: ${errorMsg}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "📈 Koin terbaik minggu ini?",
    "🛡️ Risk Assessment Bitcoin",
    "🎯 Strategi Entry Trading",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[360px] sm:w-[420px] h-[520px] bg-cyber-dark/95 backdrop-blur-xl border border-cyber-cyan/40 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden mb-4"
          >
            {/* Header Chatbot */}
            <div className="p-4 bg-gradient-to-r from-cyber-dark to-cyber-cyan/20 border-b border-cyber-cyan/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyber-cyan/20 border border-cyber-cyan rounded-xl text-cyber-cyan animate-pulse">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    WHALE COPILOT AI{" "}
                    <Sparkles className="w-3.5 h-3.5 text-cyber-neon" />
                  </h3>
                  <span className="text-[10px] text-cyber-cyan flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald animate-ping inline-block" />{" "}
                    ONLINE - Llama 3.1 Neural Core
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-cyber-cyan/10 rounded-lg transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompt Shortcuts */}
            <div className="p-2 bg-cyber-bg/60 border-b border-gray-800 flex gap-2 overflow-x-auto custom-scrollbar">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  disabled={loading}
                  className="whitespace-nowrap px-2.5 py-1 text-[11px] bg-cyber-dark border border-gray-800 hover:border-cyber-cyan/50 text-gray-300 rounded-lg transition-all"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Area Pesan Chat */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs leading-relaxed">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${
                    m.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${
                      m.sender === "user"
                        ? "bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan"
                        : "bg-cyber-neon/20 border border-cyber-neon text-cyber-neon"
                    }`}
                  >
                    {m.sender === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-2xl max-w-[80%] break-words ${
                      m.sender === "user"
                        ? "bg-cyber-cyan/10 border border-cyber-cyan/30 text-white rounded-tr-none"
                        : "bg-cyber-bg border border-gray-800 text-gray-200 rounded-tl-none whitespace-pre-line"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2 items-center text-cyber-cyan text-xs italic py-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Menulis
                  analisis neural...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-cyber-dark border-t border-gray-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya saran koin, analisis pasar..."
                disabled={loading}
                className="flex-1 bg-cyber-bg border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2 bg-cyber-cyan hover:bg-cyan-400 text-cyber-dark font-bold rounded-xl transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-neon text-cyber-dark font-black rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center gap-2 tracking-wider text-xs border border-white/20"
        >
          <Bot className="w-5 h-5 text-cyber-dark" />
          <span>ASK WHALE COPILOT</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </motion.button>
      )}
    </div>
  );
}
