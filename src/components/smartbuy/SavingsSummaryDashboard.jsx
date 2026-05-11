import { TrendingUp, Zap, DollarSign, Award } from "lucide-react";

function formatCurrency(n) {
  return Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function SavingsSummaryDashboard({ savingsPool = 18750, servicesCost = 0, completedStages = [] }) {
  const remaining = Math.max(0, savingsPool - servicesCost);
  const percentSpent = savingsPool > 0 ? (servicesCost / savingsPool) * 100 : 0;
  const percentRemaining = 100 - percentSpent;
  const completionRate = (completedStages.length / 6) * 100;

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl border-2 border-emerald-300 p-8 shadow-sm hover:shadow-md transition">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-emerald-700">SmartBuy™ Dashboard</p>
            <p className="text-lg font-black text-slate-900">Your Savings at a Glance</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Journey Progress</p>
          <p className="text-2xl font-black text-emerald-600">{Math.round(completionRate)}%</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        
        {/* Original Pool */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Original Pool</p>
          <p className="text-3xl font-black text-slate-900">{formatCurrency(savingsPool)}</p>
          <p className="text-xs text-slate-500 mt-1">Your custom savings pool</p>
        </div>

        {/* Services Spent */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Services Allocated</p>
          <p className="text-3xl font-black text-red-600">− {formatCurrency(servicesCost)}</p>
          <p className="text-xs text-slate-500 mt-1">Professional expertise</p>
        </div>

        {/* Remaining Balance */}
        <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl border-2 border-emerald-600 p-4 shadow-md">
          <p className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Your Balance</p>
          <p className="text-3xl font-black text-white">{formatCurrency(remaining)}</p>
          <p className="text-xs text-emerald-100 mt-1">Ready to deploy</p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 mb-6">
        
        {/* Service Spend Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Service Allocation</p>
            <p className="text-sm font-black text-slate-900">{percentSpent.toFixed(1)}% allocated</p>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-300"
              style={{ width: `${percentSpent}%` }}
            />
          </div>
        </div>

        {/* Remaining Balance Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Your Remaining Capacity</p>
            <p className="text-sm font-black text-emerald-700">{percentRemaining.toFixed(1)}% available</p>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300"
              style={{ width: `${percentRemaining}%` }}
            />
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-start gap-3">
          <Award className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-slate-900 mb-1">You're Making Smart Choices</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {remaining > 0 
                ? `You have ${formatCurrency(remaining)} left to strategically invest in professional guidance. Focus on the services that matter most.`
                : `You've allocated your entire pool. Time to close and capture your savings!`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-emerald-600" />
          <div>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">Total Invested</p>
            <p className="text-sm font-black text-slate-900">{formatCurrency(servicesCost)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-emerald-600" />
          <div>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">Stages Completed</p>
            <p className="text-sm font-black text-slate-900">{completedStages.length}/6</p>
          </div>
        </div>
      </div>
    </div>
  );
}