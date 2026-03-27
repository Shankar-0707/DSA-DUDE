import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/api/api";
import { buildContextWindow } from "@/features/chatbot/chatbot.utils";
import ChatMessage from "./ChatMessage";
import { cn } from "@/lib/utils";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Task 9.7: Auto-scroll to bottom after each messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Task 9.1: Toggle open/closed without clearing messages
  const toggleOpen = () => setIsOpen((prev) => !prev);

  // Task 9.3: Message submission logic
  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed) return; // reject empty/whitespace-only

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      type: "text",
      data: null,
      timestamp: Date.now(),
    };

    const loadingMessage = {
      id: crypto.randomUUID(),
      role: "ai",
      content: "...",
      type: "text",
      data: null,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = buildContextWindow([...messages, userMessage]);
      const res = await sendChatMessage(trimmed, history);
      const { type, content, data } = res.data;

      const aiMessage = {
        id: crypto.randomUUID(),
        role: "ai",
        content,
        type,
        data: data ?? null,
        timestamp: Date.now(),
      };

      // Replace loading message with real AI response
      setMessages((prev) => [...prev.slice(0, -1), aiMessage]);
    } catch (error) {
      const errorContent =
        error.response?.data?.error || error.message || "Something went wrong";

      const errorMessage = {
        id: crypto.randomUUID(),
        role: "ai",
        content: errorContent,
        type: "error",
        data: null,
        timestamp: Date.now(),
      };

      // Replace loading message with error message, preserving history
      setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Chat panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-20 right-6 z-50",
            "w-80 h-[500px] flex flex-col",
            "bg-background border border-border rounded-2xl shadow-xl",
            "dark:bg-card dark:border-border"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border rounded-t-2xl bg-muted/50">
            <span className="text-sm font-semibold text-foreground">AI Assistant</span>
            <button
              onClick={toggleOpen}
              className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.length === 0 && (
              <p className="text-xs text-muted-foreground text-center mt-8">
                Ask me anything about DSA or programming!
              </p>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="px-3 py-3 border-t border-border flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Type a message..."
              className={cn(
                "flex-1 text-sm rounded-lg px-3 py-2",
                "bg-muted border border-border",
                "text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={toggleOpen}
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "w-12 h-12 rounded-full shadow-lg",
          "bg-primary text-primary-foreground",
          "flex items-center justify-center text-xl",
          "hover:bg-primary/90 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary/50"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </>
  );
}
