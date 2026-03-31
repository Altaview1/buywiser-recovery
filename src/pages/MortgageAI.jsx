import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { usePageTitle } from "@/lib/usePageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Paperclip, CheckCircle, Sparkles, Upload, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

const STEPS = [
  { key: "intro",         question: null },
  { key: "purchase_or_refi", question: "First things first — are you **purchasing a home** or looking to **refinance** your current mortgage?\n\n- 🏡 Purchasing a home\n- 🔄 Refinancing my current mortgage" },
  { key: "loan_purpose",  question: "Great! What best describes what you're trying to accomplish?\n\n**Purchase options:**\n- Primary residence\n- Second home / vacation home\n- Investment property\n\n**Refinance options:**\n- Lower my rate / payment\n- Cash-out (access equity)\n- FHA Streamline\n- VA Streamline (IRRRL)\n- Remove mortgage insurance" },
  { key: "property_type", question: "What type of property is this?\n\n- Single family home\n- Condo / townhome\n- Multi-unit (2–4 units)\n- Investment property" },
  { key: "property_city", question: "What city is the property located in?" },
  { key: "property_value",question: "What is the estimated **property value** (or purchase price)? Please enter a dollar amount." },
  { key: "loan_amount",   question: "How much are you looking to **borrow**?" },
  { key: "contact",       question: "Let's get your contact info so Bennett can follow up personally.\n\nPlease share your **full name, email address, and phone number**." },
  { key: "employment_type", question: "What best describes your **employment status**?\n\n- W-2 employee (full time)\n- Self-employed / 1099\n- Retired\n- Other" },
  { key: "employer_name", question: "What is the name of your **employer or business**? And how many years have you been there?" },
  { key: "annual_income", question: "What is your **gross annual income** (before taxes)? Please give a dollar range or exact amount." },
  { key: "monthly_debts", question: "What are your **monthly debt payments**? (car loans, student loans, credit cards, other mortgages, etc.) Give an approximate monthly total." },
  { key: "liquid_assets", question: "How much do you have in **liquid assets** (checking, savings, investments)? A rough range is fine." },
  { key: "credit_score",  question: "What is your approximate **credit score range**?\n\n- Excellent (740+)\n- Good (700–739)\n- Fair (660–699)\n- Below 660\n- I'm not sure" },
  { key: "credit_history",question: "Have you had any **bankruptcies or foreclosures** in the past 7 years? If yes, please briefly describe." },
  { key: "documents",     question: "Almost there! Please **upload your supporting documents**. Common docs include:\n\n- Last 2 years W-2s or tax returns\n- Last 2 months pay stubs\n- Last 2 months bank statements\n- Most recent mortgage statement (if refinancing)\n\nYou can upload multiple files." },
  { key: "review",        question: null },
];

function getBotGreeting() {
  return "Welcome! I'm the **BuyWiser Mortgage AI** — and I'm here to help you get this done right.\n\nI'll be collecting your information for **Bennett**, BuyWiser's California Licensed Mortgage Broker with over **30 years** of experience helping people buy homes and navigate refinances across the state. Once you're done here, Bennett personally reviews every application — no handoffs, no call centers.\n\nThis guided application takes about 5–10 minutes. We'll cover your goal, income, assets, credit, and document uploads — everything Bennett needs to give you a real, honest answer.\n\nReady? Just type **\"Let's go!\"** to start."
}

function extractContactInfo(text) {
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  const phoneMatch = text.match(/(\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4})/);
  const nameMatch = text.replace(emailMatch?.[0] || "", "").replace(phoneMatch?.[0] || "", "").trim();
  return {
    email: emailMatch?.[0] || "",
    phone: phoneMatch?.[0] || "",
    name: nameMatch.replace(/[,|\/]/g, " ").trim(),
  };
}

export default function MortgageAI() {
  usePageTitle("Mortgage AI Application | BuyWiser Home Loans");
  const [messages, setMessages] = useState([
    { role: "bot", text: getBotGreeting() }
  ]);
  const [input, setInput] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appData, setAppData] = useState({});
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (role, text) => {
    setMessages(prev => [...prev, { role, text }]);
  };

  const advanceToStep = (nextIndex, currentData) => {
    const step = STEPS[nextIndex];
    if (!step) return;
    if (step.key === "review") {
      finishAndSubmit(currentData);
      return;
    }
    if (step.question) {
      setTimeout(() => {
        addMessage("bot", step.question);
      }, 400);
    }
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploadingDocs(true);
    const newDocs = [];
    for (const file of Array.from(files)) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      newDocs.push({ name: file.name, url: file_url });
    }
    setUploadedDocs(prev => [...prev, ...newDocs]);
    setUploadingDocs(false);
    addMessage("user", `Uploaded: ${newDocs.map(d => d.name).join(", ")}`);
    addMessage("bot", `Got it! I've received **${newDocs.length} file(s)**.\n\nFeel free to upload more, or type **"Done"** when you're finished with documents.`);
  };

  const finishAndSubmit = async (data) => {
    setLoading(true);
    addMessage("bot", "Reviewing your application... give me just a moment.");

    const summary = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a senior mortgage underwriter assistant. Given the following applicant information, write a brief professional summary (3-4 sentences) of the applicant's profile, key strengths, and any potential concerns. Be factual and concise.\n\nApplication data:\n${JSON.stringify(data, null, 2)}\n\nDocuments uploaded: ${uploadedDocs.map(d => d.name).join(", ") || "None"}`,
    });

    const [firstName, ...lastParts] = (data.name || "").split(" ");
    await base44.entities.MortgageApplication.create({
      first_name: firstName || data.name || "",
      last_name: lastParts.join(" ") || "",
      email: data.email || "",
      phone: data.phone || "",
      loan_purpose: data.loan_purpose || "",
      property_type: data.property_type || "",
      property_city: data.property_city || "",
      property_value: parseFloat(data.property_value) || 0,
      loan_amount: parseFloat(data.loan_amount) || 0,
      annual_income: data.annual_income || "",
      employment_type: data.employment_type || "",
      employer_name: data.employer_name || "",
      monthly_debts: data.monthly_debts || "",
      liquid_assets: data.liquid_assets || "",
      credit_score_range: data.credit_score || "",
      bankruptcies: data.credit_history || "",
      document_urls: uploadedDocs.map(d => d.url),
      document_names: uploadedDocs.map(d => d.name),
      ai_summary: summary,
      status: "submitted",
    });

    setLoading(false);
    setSubmitted(true);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    addMessage("user", text);

    const currentStep = STEPS[stepIndex];

    if (stepIndex === 0) {
      // intro — advance to step 1
      const nextIndex = 1;
      setStepIndex(nextIndex);
      advanceToStep(nextIndex, appData);
      return;
    }

    const key = currentStep.key;
    let newData = { ...appData };

    if (key === "contact") {
      const { email, phone, name } = extractContactInfo(text);
      newData = { ...newData, email, phone, name };
    } else if (key === "documents") {
      if (text.toLowerCase().includes("done") || text.toLowerCase().includes("skip") || text.toLowerCase().includes("no")) {
        // proceed
      } else {
        addMessage("bot", "Please use the 📎 button below to attach files, then type **\"Done\"** when finished.");
        return;
      }
    } else {
      newData[key] = text;
    }

    setAppData(newData);

    setLoading(true);
    // Get a brief AI acknowledgment
    let ack = "";
    try {
      ack = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a sharp, experienced mortgage application assistant representing Bennett at BuyWiser Home Loans — a California Licensed Mortgage Broker with 30+ years of experience. The applicant just answered a question about "${key.replace(/_/g, " ")}" with: "${text}". Give a brief (1 sentence) warm but confident acknowledgment. No fluff, no over-the-top praise. Do NOT ask another question. Keep it under 15 words.`,
      });
    } catch {
      ack = "Got it, thank you!";
    }
    setLoading(false);

    addMessage("bot", ack);

    const nextIndex = stepIndex + 1;
    setStepIndex(nextIndex);
    advanceToStep(nextIndex, newData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 max-w-lg w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-9 w-9 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Bennett will personally review your application. With over 30 years as a California Licensed Mortgage Broker, he'll come back to you with a clear, honest assessment of your options — no pressure, no runaround.
          </p>
          <p className="text-xs text-slate-400 mb-4">CA RE License #01107013 &middot; NMLS #1524446 &middot; Company NMLS #1887767</p>
          <p className="text-sm text-slate-500">Questions? Call <a href="tel:+18183002642" className="text-green-700 font-semibold">(818) 300-2642</a></p>
        </div>
      </div>
    );
  }

  const isDocStep = STEPS[stepIndex]?.key === "documents";
  const currentStepNum = Math.max(0, stepIndex);
  const totalSteps = STEPS.length - 2; // exclude intro and review

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Mortgage AI</p>
              <p className="text-slate-400 text-xs">BuyWiser Home Loans · Save up to $5,000</p>
            </div>
          </div>
          {currentStepNum > 0 && (
            <div className="text-right">
              <p className="text-xs text-slate-400">Step {Math.min(currentStepNum, totalSteps)} of {totalSteps}</p>
              <div className="w-32 h-1.5 bg-slate-700 rounded-full mt-1">
                <div
                  className="h-1.5 bg-green-500 rounded-full transition-all"
                  style={{ width: `${Math.min((currentStepNum / totalSteps) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "bot" && (
                <div className="w-7 h-7 bg-green-700 rounded-lg flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-green-600 text-white"
                  : "bg-slate-800 text-slate-100"
              }`}>
                {msg.role === "bot" ? (
                  <ReactMarkdown
                    className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    components={{
                      p: ({ children }) => <p className="my-1">{children}</p>,
                      ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
                      li: ({ children }) => <li className="my-0.5">{children}</li>,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  <span>{msg.text}</span>
                )}
              </div>
            </div>
          ))}
          {(loading || uploadingDocs) && (
            <div className="flex justify-start">
              <div className="w-7 h-7 bg-green-700 rounded-lg flex items-center justify-center mr-2 mt-0.5">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="bg-slate-800 rounded-2xl px-4 py-3">
                <Loader2 className="h-4 w-4 text-green-400 animate-spin" />
              </div>
            </div>
          )}
          {/* Uploaded docs display */}
          {uploadedDocs.length > 0 && isDocStep && (
            <div className="flex justify-end">
              <div className="bg-slate-800 rounded-2xl px-4 py-3 max-w-[80%]">
                <p className="text-xs text-slate-400 mb-2 font-semibold">Uploaded Documents</p>
                <div className="space-y-1">
                  {uploadedDocs.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-green-300">
                      <CheckCircle className="h-3 w-3" />
                      <span>{doc.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 items-end">
            {isDocStep && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  onChange={(e) => handleUpload(e.target.files)}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition flex-shrink-0"
                  title="Upload documents"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
              </>
            )}
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isDocStep ? 'Upload files above, then type "Done"...' : "Type your answer..."}
              className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-green-500 rounded-xl h-12"
              disabled={loading || uploadingDocs}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading || uploadingDocs}
              className="bg-green-600 hover:bg-green-500 text-white rounded-xl h-12 w-12 p-0 flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-600 text-center mt-2">
            BuyWiser Technology, Inc. · NMLS #1887767 · CA RE License #01107013 · Licensed by DFPI / CRMLA
          </p>
        </div>
      </div>
    </div>
  );
}