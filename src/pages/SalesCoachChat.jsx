import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Loader2, LogOut, BookOpen, Lightbulb } from "lucide-react";

const NAVY = "#0B1F3B";

const COACHING_TIPS = [
  { title: "Opening the Door", prompt: "How do I approach the homeowner and explain the benefit?" },
  { title: "Handling Objections", prompt: "The homeowner isn't interested. What should I say?" },
  { title: "Closing Strategy", prompt: "How do I get them to take the next step?" },
  { title: "Appointment Setting", prompt: "How do I schedule a follow-up call effectively?" },
  { title: "Property Qualification", prompt: "How do I identify if this is a good opportunity?" },
];

const RESOURCES = [
  { title: "VA Loan Basics", url: "#", desc: "Understanding the veteran's home purchase benefit" },
  { title: "Talking Points", url: "#", desc: "Key phrases and value propositions" },
  { title: "Objection Handlers", url: "#", desc: "Scripts for common concerns" },
  { title: "Qualification Framework", url: "#", desc: "Steps to identify hot leads" },
];

function AccessGate({ onAccess }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const activators = await base44.entities.FieldActivator.filter({ email: email.trim(), status: "active" });
    if (activators.length > 0) {
      onAccess(activators[0]);
    } else {
      setError("No active Field Activator account found.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ background: NAVY }}>
      <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-7 w-auto mb-6 opacity-60" />
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 text-center" style={{ background: NAVY }}>
          <p className="text-white font-black text-sm uppercase tracking-widest">Sales Coach</p>
          <p className="text-blue-300 text-xs mt-1">Get help, coaching, and resources</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Your Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 transition" />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3.5 font-bold text-sm rounded-xl text-white transition disabled:opacity-50"
            style={{ background: loading ? "#888" : NAVY }}>
            {loading ? "Checking…" : "Access Coach"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SalesCoachChat() {
  const [activator, setActivator] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (activator && !conversationId) {
      initializeConversation();
    }
  }, [activator]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeConversation = async () => {
    setFetching(true);
    const convId = `${activator.id}-coach`;
    setConversationId(convId);
    
    const msgs = await base44.entities.Message.filter({ conversation_id: convId }, "-created_date", 100);
    setMessages(msgs);
    setFetching(false);
  };

  const handleSendMessage = async (content, type = "text") => {
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      const msg = await base44.entities.Message.create({
        conversation_id: conversationId,
        sender_email: activator.email,
        sender_role: "activator",
        content,
        message_type: type,
      });
      
      setMessages(prev => [...prev, msg]);
      setInput("");
      
      // Simulate coach response after a short delay
      setTimeout(() => {
        handleCoachResponse(content);
      }, 800);
    } catch (err) {
      alert("Message failed: " + err.message);
    }
    setLoading(false);
  };

  const handleCoachResponse = async (userMessage) => {
    // Simple rule-based coaching responses
    let response = "";
    
    if (userMessage.toLowerCase().includes("objection") || userMessage.toLowerCase().includes("not interested")) {
      response = "Great question! Here's a framework: 1) Validate their concern, 2) Reframe the benefit, 3) Ask a clarifying question. Would you like specific talking points?";
    } else if (userMessage.toLowerCase().includes("appointment") || userMessage.toLowerCase().includes("follow-up")) {
      response = "Best practice: Propose 2-3 specific times, keep it brief (15 min), and mention the veteran benefit upfront. Does that help?";
    } else if (userMessage.toLowerCase().includes("approach") || userMessage.toLowerCase().includes("door")) {
      response = "Smart approach: Lead with the benefit, not the product. Try: 'Hi, there's a home purchase benefit for veterans at your address—do you have a minute?' Keep it light.";
    } else {
      response = "That's a great question! Check the resources section below for guides on this. You can also ask me specific scenarios.";
    }
    
    try {
      const coachMsg = await base44.entities.Message.create({
        conversation_id: conversationId,
        sender_email: "coach@buywiser.com",
        sender_role: "admin",
        content: response,
        message_type: "text",
      });
      setMessages(prev => [...prev, coachMsg]);
    } catch (err) {
      console.error("Failed to save coach response:", err);
    }
  };

  const handleCoachingPrompt = (prompt) => {
    handleSendMessage(prompt, "coaching_prompt");
  };

  if (!activator) return <AccessGate onAccess={setActivator} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 sticky top-0 z-10 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Sales Coach</p>
            <p className="text-sm font-bold text-slate-800">{activator.name}</p>
          </div>
          <button onClick={() => setActivator(null)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {fetching ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold mb-1">Welcome to the Sales Coach</p>
            <p className="text-xs">Ask questions about talking points, objections, or strategy</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender_role === "activator" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs sm:max-w-md px-4 py-3 rounded-xl ${
                msg.sender_role === "activator" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white border border-slate-200 text-slate-800"
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.sender_role === "activator" ? "text-blue-100" : "text-slate-400"}`}>
                  {new Date(msg.created_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Coaching Prompts */}
      {messages.length < 3 && (
        <div className="px-4 py-3 border-t border-slate-200 bg-white">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quick coaching topics:</p>
          <div className="grid grid-cols-2 gap-2">
            {COACHING_TIPS.slice(0, 4).map((tip, i) => (
              <button key={i} onClick={() => handleCoachingPrompt(tip.prompt)}
                className="px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 active:bg-blue-50 transition text-left">
                <Lightbulb className="h-3 w-3 inline mr-1" /> {tip.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-slate-200 px-4 py-3 bg-white space-y-2">
        {/* Resources */}
        <details className="text-xs">
          <summary className="font-bold text-slate-600 cursor-pointer flex items-center gap-1 mb-2">
            <BookOpen className="h-3.5 w-3.5" /> Resources
          </summary>
          <div className="space-y-1 pl-4">
            {RESOURCES.map((r, i) => (
              <a key={i} href={r.url} className="block text-blue-600 hover:text-blue-800 font-semibold text-xs">
                {r.title}
              </a>
            ))}
          </div>
        </details>

        {/* Message Input */}
        <div className="flex gap-2 touch-manipulation">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === "Enter" && handleSendMessage(input)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white" />
          <button onClick={() => handleSendMessage(input)} disabled={loading || !input.trim()}
            className="p-3 rounded-xl text-white transition disabled:opacity-40" style={{ background: NAVY }}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}