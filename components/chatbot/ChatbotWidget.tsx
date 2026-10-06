"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Bot,
  RotateCcw,
} from "lucide-react";
import { ChatMessage, generateBotResponse } from "@/lib/chatbot-engine";

export default function ChatbotWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "bot",
      text: "Assalamu Alaikum! I am your Pappu Leather Craft Concierge. How can I help you discover the perfect footwear, find your exact size, or track an order today?",
      timestamp: "Just now",
      quickReplies: [
        "👞 Best Sellers",
        "👟 Size Guide Help",
        "🚚 Delivery Charges",
        "📦 Track My Order",
        "💬 WhatsApp Human Agent",
      ],
    },
  ]);

  // Don't render inside admin portal
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // Simulate natural thinking delay (350ms - 500ms)
    setTimeout(() => {
      const botReply = generateBotResponse(query);
      setIsTyping(false);
      setMessages((prev) => [...prev, botReply]);
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: "msg-welcome-reset",
        sender: "bot",
        text: "Conversation refreshed. How may I assist you with Pappu Leather Craft today?",
        timestamp: "Just now",
        quickReplies: [
          "👞 Best Sellers",
          "👟 Size Guide Help",
          "🚚 Delivery Charges",
          "📦 Track My Order",
        ],
      },
    ]);
  };

  return (
    <div className={`fixed z-50 transition-all ${
      isOpen 
        ? "inset-x-3 bottom-16 sm:inset-x-auto sm:bottom-6 sm:right-6" 
        : "bottom-20 md:bottom-6 right-3 sm:right-6"
    }`}>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#161616] hover:bg-[#1F1F1F] border border-[#8B5E3C] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-orange-950/40"
          aria-label="Open leather concierge chatbot"
        >
          <div className="relative">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1C1814] border border-[#8B5E3C] flex items-center justify-center p-1 overflow-hidden">
              <Image
                src="/images/logo-icon.png"
                alt="Pappu Leather"
                width={22}
                height={22}
                className="object-contain"
              />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
            )}
          </div>

          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold uppercase tracking-wider text-[#F3EDE3] group-hover:text-[#A47551] transition-colors">
              Leather Concierge
            </p>
            <p className="text-[10px] text-zinc-400">Offline AI • Instant Answers</p>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-full sm:w-[380px] md:w-[420px] h-[72vh] sm:h-[550px] max-h-[580px] bg-[#101010] border border-[#2E2E2E] rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-[#161616] border-b border-[#242424] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-[#1C1814] border border-[#8B5E3C] flex items-center justify-center p-1 overflow-hidden">
                <Image
                  src="/images/logo-icon.png"
                  alt="Pappu Leather"
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#161616]" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F3EDE3] flex items-center gap-1.5">
                  <span>Pappu Leather Concierge</span>
                  <Sparkles className="w-3 h-3 text-[#A47551]" />
                </h3>
                <p className="text-[10px] text-zinc-400">Always active • Zero API lag</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-[#202020] transition-colors"
                title="Restart conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-[#202020] transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-line shadow-md ${
                    msg.sender === "user"
                      ? "bg-[#8B5E3C] text-white rounded-br-none"
                      : "bg-[#181818] border border-[#262626] text-zinc-200 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Optional Embedded Product Cards */}
                  {msg.productCards && msg.productCards.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 mt-3 pt-3 border-t border-[#262626]">
                      {msg.productCards.map((prod, i) => (
                        <Link
                          key={i}
                          href={`/product/${prod.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 p-2 rounded bg-[#121212] border border-[#2B2B2B] hover:border-[#8B5E3C] transition-colors group"
                        >
                          <div className="relative w-12 h-12 rounded bg-[#1C1C1C] overflow-hidden shrink-0 border border-[#262626]">
                            <Image
                              src={prod.image}
                              alt={prod.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-zinc-400 block uppercase">
                              {prod.category}
                            </span>
                            <p className="font-semibold text-white truncate group-hover:text-[#A47551] text-xs">
                              {prod.name}
                            </p>
                            <span className="font-mono font-bold text-[#F3EDE3] text-xs">
                              {prod.price}
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-1 group-hover:text-white transition-all mr-1" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Optional Action Link Button */}
                  {msg.actionLink && (
                    <div className="mt-3 pt-2">
                      <a
                        href={msg.actionLink.url}
                        target={msg.actionLink.external ? "_blank" : undefined}
                        rel={msg.actionLink.external ? "noopener noreferrer" : undefined}
                        onClick={() => {
                          if (!msg.actionLink?.external) setIsOpen(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#202020] hover:bg-[#8B5E3C] text-white text-[11px] font-semibold transition-colors border border-[#333333]"
                      >
                        <span>{msg.actionLink.label}</span>
                        {msg.actionLink.external ? (
                          <ExternalLink className="w-3 h-3" />
                        ) : (
                          <ArrowRight className="w-3 h-3" />
                        )}
                      </a>
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-zinc-500 mt-1 px-1">{msg.timestamp}</span>

                {/* Quick Reply Chips (Only on bot messages) */}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {msg.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(reply)}
                        className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#8B5E3C] text-zinc-300 hover:text-white border border-[#2B2B2B] hover:border-[#8B5E3C] rounded-full text-[10px] font-medium transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#181818] border border-[#262626] max-w-[80px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5E3C] animate-bounce" />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#8B5E3C] animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#8B5E3C] animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#141414] border-t border-[#222222]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about size 42, boots, delivery..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-[#1A1A1A] border border-[#2C2C2C] rounded-lg px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-[#8B5E3C]"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
