import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, X, Send, Loader2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open && !conversation) {
      initChat();
    }
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initChat = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: "mortgage_assistant",
      metadata: { name: "Website Chat" },
    });
    setConversation(conv);
    setMessages(conv.messages || []);

    base44.agents.subscribeToConversation(conv.id, (data) => {
      setMessages(data.messages);
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversation || sending) return;

    setSending(true);
    setInput("");

    await base44.agents.addMessage(conversation, {
      role: "user",
      content: input.trim(),
    });

    setSending(false);
  };

  const quickActions = [
    "What loan type is right for me?",
    "How much can I afford?",
    "What's the application process?",
    "Tell me about VA loans",
  ];

  return (
    <>
      {/* Chat Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div
          className={`fixed bottom-6 right-6 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 flex flex-col transition-all ${
            minimized ? "w-80 h-16" : "w-96 h-[600px]"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">Mortgage Assistant</p>
                <p className="text-xs text-green-100">Ask me anything!</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized(!minimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-slate-600 text-sm mb-4">
                      Hi! I'm your mortgage assistant. How can I help you today?
                    </p>
                    <div className="space-y-2">
                      {quickActions.map((action) => (
                        <button
                          key={action}
                          onClick={() => {
                            setInput(action);
                            setTimeout(() => {
                              document.getElementById("chat-input")?.focus();
                            }, 100);
                          }}
                          className="block w-full text-left px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-green-600 text-white"
                          : "bg-white border border-slate-200 text-slate-700"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="text-sm">{msg.content}</p>
                      ) : (
                        <ReactMarkdown
                          className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                className="text-green-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                ))}

                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl">
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-4 border-t bg-white rounded-b-2xl">
                <div className="flex gap-2">
                  <Input
                    id="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about mortgages..."
                    disabled={sending || !conversation}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || sending || !conversation}
                    className="bg-green-600 hover:bg-green-700 text-white px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}