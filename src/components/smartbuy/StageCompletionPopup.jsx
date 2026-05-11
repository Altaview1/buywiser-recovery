import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Sparkles, ArrowRight, X } from "lucide-react";

const STAGE_INFO = {
  1: { label: "Pre-Qualification", emoji: "📋", savingsPercent: 0.05 },
  2: { label: "Property Search", emoji: "🔍", savingsPercent: 0.12 },
  3: { label: "Schedule Tours", emoji: "🏠", savingsPercent: 0.08 },
  4: { label: "Write Offer", emoji: "✍️", savingsPercent: 0.20 },
  5: { label: "Inspections & Appraisal", emoji: "📊", savingsPercent: 0.30 },
  6: { label: "Close Transaction", emoji: "🔑", savingsPercent: 0.25 },
};

export default function StageCompletionPopup({ isOpen, onClose, stage, savingsPool, onProceedNext }) {
  const [autoClose, setAutoClose] = useState(false);
  const stageInfo = STAGE_INFO[stage];
  const stageSavings = stageInfo && savingsPool ? Math.round(savingsPool * stageInfo.savingsPercent) : 0;

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setAutoClose(true), 6000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setAutoClose(false);
    onClose();
  };

  const handleProceed = () => {
    handleClose();
    onProceedNext && onProceedNext();
  };

  return (
    <AnimatePresence>
      {isOpen && !autoClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-sm bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-400 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Confetti-like animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-emerald-400/10 to-transparent"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="relative p-8 text-center">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-1.5 hover:bg-white/50 rounded-lg transition"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>

              {/* Celebration icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="text-3xl"
                >
                  ✨
                </motion.div>
              </motion.div>

              {/* Checkmark accent */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="absolute top-4 right-4 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <CheckCircle className="h-5 w-5 text-white" />
              </motion.div>

              {/* Header */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <p className="text-sm font-black text-emerald-700 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Stage Complete!
                </p>
                <h2 className="text-2xl font-black text-slate-900 mb-1">Congratulations!</h2>
                <p className="text-slate-600 text-sm">You've completed {stageInfo.emoji} {stageInfo.label}</p>
              </motion.div>

              {/* Savings highlight */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-4 bg-white rounded-2xl border-2 border-emerald-300 shadow-sm"
              >
                <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-1">Money Saved This Stage</p>
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="text-3xl font-black text-emerald-600 mb-1"
                >
                  ${stageSavings.toLocaleString()}
                </motion.div>
                <p className="text-[10px] text-slate-500">
                  {(stageInfo.savingsPercent * 100).toFixed(0)}% of your SAVINGS
                </p>
              </motion.div>

              {/* Motivation text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-5 text-sm text-slate-700 leading-relaxed"
              >
                You're on your way to keeping thousands in buyer savings! 🎯
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 flex gap-3"
              >
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 rounded-xl font-black text-sm text-slate-700 border-2 border-slate-300 hover:bg-white/50 transition"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleProceed}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-sm text-white bg-gradient-to-r from-emerald-500 to-blue-500 hover:shadow-lg transition shadow-md"
                >
                  Next Step <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </motion.div>

              {/* Auto-close hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-[10px] text-slate-500 mt-3"
              >
                This popup closes automatically in 6 seconds
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}