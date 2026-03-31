import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, X, Send, Loader2, Phone } from "lucide-react";

const SYSTEM_PROMPT = `You are a mortgage advisor assistant for BuyWiser Home Loans, a California mortgage company led by Bennett (NMLS #1524446, Company NMLS #1887767). 

Your job is to help California homeowners understand whether refinancing may make sense for their situation. Be direct, practical, and honest — never use hype or make guarantees. If refinancing doesn't make sense, say so.

You can discuss:
- Rate-and-term refinance
- Cash-out refinance
- FHA Streamline refinance
- VA Streamline / IRRRL
- Removing mortgage insurance
- Break-even analysis concepts
- General refinance eligibility questions

Always end responses by suggesting they request a free mortgage review or call (818) 300-2642 for a real analysis. Keep answers concise — 2-4 short paragraphs max. Do not provide specific rate quotes.`;

const STARTER_MESSAGES = [
  "Does refinancing make sense right now?",
  "How does an FHA Streamline work?",
  "Can I remove mortgage insurance by refinancing?",
  "What is a cash-out refinance?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi — I can help you figure out whether a refinance might make sense for your situation. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    const conversationHistory = newMessages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}\n\nConversation so far:\n${conversationHistory}\n\nRespond as the assistant:`,
    });

    setMessages([...newMessages, { role: "assistant", content: response }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-full shadow-xl hover:bg-slate-800 transition-all"
        >
          <MessageCircle className="h-5 w-5 text-green-400" />
          <span className="text-sm font-semibold">Ask a Question</span>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ height: "480px" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
            <div>
              <p className="font-semibold text-sm">BuyWiser Mortgage Assistant</p>
              <p className="text-xs text-slate-400">Ask about refinancing options</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />
                  <span className="text-xs text-slate-500">Thinking...</span>
                </div>
              </div>
            )}

            {/* Starter prompts */}
            {messages.length === 1 && !loading && (
              <div className="pt-1 space-y-1.5">
                {STARTER_MESSAGES.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="block w-full text-left text-xs px-3 py-2 rounded-lg border border-gray-200 text-slate-600 hover:bg-slate-50 hover:border-green-300 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Call strip */}
          <div className="px-4 py-2 border-t border-gray-100 bg-slate-50">
            <a href="tel:+18183002642" className="flex items-center justify-center gap-1.5 text-xs text-green-700 font-semibold hover:text-green-800 transition">
              <Phone className="h-3.5 w-3.5" /> Prefer to talk? Call (818) 300-2642
            </a>
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-200 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about refinancing..."
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}