import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { ProcessedFund } from '../utils/fundApi';
import CandleChart from './CandleChart';

interface FundDetailViewProps {
  fund: ProcessedFund;
  onClose: () => void;
}

interface ChatMessage {
  role: 'user' | 'sarthi';
  content: string;
  timestamp?: string;
}

const FundDetailView: React.FC<FundDetailViewProps> = ({ fund, onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'1y' | '3y' | '5y' | 'all'>('1y');
  const [sipAmount, setSipAmount] = useState<string>('');
  const [fundSizeInput, setFundSizeInput] = useState<string>(fund.fundSizeCr?.toString() || '');
  const [categoryInput, setCategoryInput] = useState<string>(fund.category || '');
  const [subCategoryInput, setSubCategoryInput] = useState<string>(fund.subCategory || '');
  const [isSubmitted, setIsSubmitted] = useState(true); // Auto-submit on mount
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'sarthi', content: `Welcome! I'm Sarthi, your wealth advisor. I'm here to help you understand the ${fund.name}. Ask me anything about this fund!`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getReturnValue = (period: '1y' | '3y' | '5y'): number => {
    switch (period) {
      case '1y':
        return fund.returns1y;
      case '3y':
        return fund.returns3y;
      case '5y':
        return fund.returns5y;
      default:
        return fund.returns3y;
    }
  };

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'Low':
        return '#00FF41';
      case 'Moderate':
        return '#FFB800';
      case 'High':
        return '#FF6B00';
      case 'Very High':
        return '#FF0000';
      default:
        return '#FFFFFF';
    }
  };

  const handleSubmitParameters = () => {
    if (!sipAmount.trim()) {
      alert('Please enter SIP Amount');
      return;
    }
    setIsSubmitted(true);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInputValue('');
    setIsTyping(true);

    // Build investment context from user inputs
    const investmentContext = {
      schemeCode: fund.schemeCode,
      schemeName: fund.name,
      sipAmount: sipAmount ? parseFloat(sipAmount) : null,
      fundSize: fundSizeInput ? parseFloat(fundSizeInput) : fund.fundSizeCr,
      category: categoryInput,
      subCategory: subCategoryInput,
      selectedPeriod,
      userQuery: userMessage
    };

    // Simulate Sarthi response with user context
    setTimeout(() => {
      const responses = [
        `The ${fund.name} has shown excellent performance with ${getReturnValue(selectedPeriod).toFixed(2)}% returns over the ${selectedPeriod} period. This fund's category is ${categoryInput}. For your SIP of ₹${sipAmount || 'any amount'}, you'll benefit from rupee-cost averaging.`,
        `With an expense ratio of ${fund.expenseRatio.toFixed(2)}%, this is a competitive offering in the ${subCategoryInput} segment. The fund's alpha of ${fund.alpha.toFixed(2)}% indicates outperformance vs benchmarks.`,
        `For a fund size of ₹${fundSizeInput || fund.fundSizeCr}Cr, ${fund.name} offers good liquidity. Your SIP amount of ₹${sipAmount || 'N/A'} would accumulate nicely with the fund's ${fund.risk} risk profile.`,
        `Given your interest in the ${categoryInput} category, specifically ${subCategoryInput}, this fund is well-positioned. The Sharpe ratio and other metrics suggest good risk-adjusted returns for your profile.`,
        `The AMC ${fund.amc} manages this fund with a ${fund.rating}/5 rating. With your investment parameters (SIP: ₹${sipAmount || 'N/A'}, Fund Size: ₹${fundSizeInput || fund.fundSizeCr}Cr), this appears to be a solid choice.`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, { 
        role: 'sarthi', 
        content: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass border border-white/20 rounded-[32px] w-full max-w-7xl max-h-[90vh] overflow-hidden relative flex bg-black/60">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-all z-20"
        >
          <X size={24} className="text-white" />
        </button>

        {/* LEFT PANEL - Fund Info & Chart */}
        <div className="w-1/2 p-8 space-y-6 border-r border-white/20 overflow-y-auto bg-gradient-to-br from-gray-900 to-black flex flex-col">
          {/* Fund Header */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-[16px] glass border border-white/20 flex items-center justify-center flex-shrink-0 bg-white/5">
                <img
                  src={`https://picsum.photos/seed/${fund.amc}/100`}
                  alt={fund.amc}
                  className="w-10 h-10 object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-black tracking-tighter uppercase text-white mb-1 line-clamp-2">
                  {fund.name}
                </h1>
                <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                  {fund.amc}
                </p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass border border-white/20 rounded-[16px] p-4 bg-white/5">
                <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest block mb-2">
                  Current NAV
                </span>
                <span className="text-xl font-black text-white">₹{fund.nav.toFixed(2)}</span>
              </div>

              <div className="glass border border-white/20 rounded-[16px] p-4 bg-white/5">
                <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest block mb-2">
                  Risk
                </span>
                <span className="text-lg font-black" style={{ color: getRiskColor(fund.risk) }}>
                  {fund.risk}
                </span>
              </div>

              <div className="glass border border-white/20 rounded-[16px] p-4 bg-white/5">
                <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest block mb-2">
                  Rating
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < fund.rating ? 'text-yellow-500' : 'text-gray-600'}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Growth Trajectory Chart - Candlestick */}
          {isSubmitted ? (
            <div className="flex-1 min-h-0 flex flex-col space-y-2">
              <CandleChart fund={fund} period={selectedPeriod} onPeriodChange={setSelectedPeriod} />
            </div>
          ) : (
            <div className="glass border border-white/20 rounded-[16px] p-8 h-80 bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center space-y-4">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-3 text-gray-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-300 text-[13px] font-black uppercase tracking-widest mb-2">
                  Analysis Pending
                </p>
                <p className="text-gray-500 text-[11px] leading-relaxed max-w-xs">
                  Fill in your investment parameters and click "Analyze Fund" to view candlestick chart
                </p>
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="glass border border-white/20 rounded-[12px] p-3 bg-white/5">
              <div className="text-[7px] text-gray-400 font-black uppercase tracking-widest mb-1">Alpha</div>
              <div className="text-lg font-black text-white">+{fund.alpha.toFixed(2)}%</div>
            </div>
            <div className="glass border border-white/20 rounded-[12px] p-3 bg-white/5">
              <div className="text-[7px] text-gray-400 font-black uppercase tracking-widest mb-1">Beta</div>
              <div className="text-lg font-black text-white">{fund.beta.toFixed(2)}</div>
            </div>
            <div className="glass border border-white/20 rounded-[12px] p-3 bg-white/5">
              <div className="text-[7px] text-gray-400 font-black uppercase tracking-widest mb-1">Expense Ratio</div>
              <div className="text-lg font-black text-white">{fund.expenseRatio.toFixed(2)}%</div>
            </div>
            <div className="glass border border-white/20 rounded-[12px] p-3 bg-white/5">
              <div className="text-[7px] text-gray-400 font-black uppercase tracking-widest mb-1">Std Dev</div>
              <div className="text-lg font-black text-white">{fund.stdDev.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Inputs & Chatbot */}
        <div className="w-1/2 p-8 flex flex-col gap-6 bg-gradient-to-br from-gray-950 to-black">
          {/* User Input Section */}
          <div className="space-y-4">
            <h3 className="text-[11px] text-gray-200 font-black uppercase tracking-widest">Investment Details</h3>
            
            {/* SIP Amount */}
            <div>
              <label className="text-[8px] text-gray-400 font-black uppercase tracking-widest block mb-2">
                SIP Amount (₹)
              </label>
              <input
                type="number"
                value={sipAmount}
                onChange={(e) => setSipAmount(e.target.value)}
                placeholder="Enter monthly SIP amount"
                className="w-full bg-white/10 border border-white/20 rounded-[12px] px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/50 transition-all text-sm font-semibold"
              />
            </div>

          {/* Fund Size */}
            <div>
              <label className="text-[8px] text-gray-400 font-black uppercase tracking-widest block mb-2">
                Fund Size (Cr)
              </label>
              <input
                type="number"
                value={fundSizeInput}
                onChange={(e) => setFundSizeInput(e.target.value)}
                placeholder={`Default: ${fund.fundSizeCr}`}
                className="w-full bg-white/10 border border-white/20 rounded-[12px] px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/50 transition-all text-sm font-semibold"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-[8px] text-gray-400 font-black uppercase tracking-widest block mb-2">
                Category
              </label>
              <input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                placeholder={fund.category}
                className="w-full bg-white/10 border border-white/20 rounded-[12px] px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/50 transition-all text-sm font-semibold"
              />
            </div>

            {/* Sub Category */}
            <div>
              <label className="text-[8px] text-gray-400 font-black uppercase tracking-widest block mb-2">
                Sub Category
              </label>
              <input
                type="text"
                value={subCategoryInput}
                onChange={(e) => setSubCategoryInput(e.target.value)}
                placeholder={fund.subCategory}
                className="w-full bg-white/10 border border-white/20 rounded-[12px] px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/50 transition-all text-sm font-semibold"
              />
            </div>
          </div>

          {/* Sarthi Chatbot */}
          <div className="flex-1 flex flex-col gap-4 min-h-0">
            <h3 className="text-[11px] text-gray-200 font-black uppercase tracking-widest">Sarthi - Fund Advisor</h3>
            
            {/* Chat Messages */}
            <div
              ref={scrollRef}
              className="flex-1 glass border border-white/20 rounded-[16px] p-4 space-y-3 overflow-y-auto bg-white/5"
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-[12px] px-4 py-2.5 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'glass border border-white/20 bg-white/10 text-white'
                    }`}
                  >
                    <p className="text-[10px] leading-relaxed">{msg.content}</p>
                    {msg.timestamp && (
                      <p className="text-[7px] mt-1.5 opacity-60">{msg.timestamp}</p>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="glass border border-white/20 rounded-[12px] px-4 py-2.5 bg-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about this fund..."
                className="flex-1 bg-white/10 border border-white/20 rounded-[12px] px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-white/50 transition-all text-sm font-semibold"
              />
              <button
                onClick={handleSendMessage}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[12px] transition-all font-bold"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundDetailView;
