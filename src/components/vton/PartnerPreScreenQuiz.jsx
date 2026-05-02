import { useState } from "react";
import { CheckCircle, ChevronRight } from "lucide-react";

export default function PartnerPreScreenQuiz({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: "experience",
      question: "Do you have real estate sales or agent experience?",
      type: "yesno",
      description: "This helps us understand your background in the industry."
    },
    {
      id: "licensed",
      question: "Are you currently licensed as a real estate agent or broker?",
      type: "yesno",
      description: "VTON partners should maintain active licensing in their territory."
    },
    {
      id: "doorknocking",
      question: "Have you ever done door-to-door outreach before?",
      type: "yesno",
      description: "Direct outreach is core to VTON. Ground-level experience is valuable."
    },
    {
      id: "veteran",
      question: "Do you have experience working with or serving veteran clients?",
      type: "yesno",
      description: "Not required, but helpful context for veteran-focused opportunities."
    },
  ];

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [questions[step].id]: answer });
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(answers);
    }
  };

  const currentQuestion = questions[step];
  const progress = Math.round(((step + 1) / questions.length) * 100);

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Pre-Screening Quiz</p>
          <p className="text-xs font-semibold text-slate-500">{step + 1} of {questions.length}</p>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <p className="text-sm font-semibold text-slate-900 mb-2">{currentQuestion.question}</p>
        <p className="text-xs text-slate-500 mb-5">{currentQuestion.description}</p>

        <div className="flex gap-3">
          <button
            onClick={() => handleAnswer("yes")}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition"
          >
            Yes
          </button>
          <button
            onClick={() => handleAnswer("no")}
            className="flex-1 px-4 py-3 border-2 border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-bold rounded-xl transition"
          >
            No
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center italic">
        Your answers help us match you with the right opportunities.
      </p>
    </div>
  );
}