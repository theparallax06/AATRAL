import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  ShieldCheck,
  Phone,
  User,
  Image as ImageIcon,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { HouseholdBooking } from '../../types';

interface ChatDrawerProps {
  booking: HouseholdBooking;
  onClose: () => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ booking, onClose }) => {
  const { currentUser, currentRole, addChatMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies =
    currentRole === 'customer'
      ? [
          'Please buzz at the main security gate.',
          'Can you confirm your estimated arrival time?',
          'Where can I purchase the replacement spares?',
          'The parking spot is available in basement 1.',
        ]
      : [
          'Namaste! I am en route on my two-wheeler with tools.',
          'I have arrived at the building gate.',
          'Inspecting the electrical panel now with my multimeter.',
          'Job completed! Please share the OTP for secure verification.',
        ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    addChatMessage(booking.id, text.trim(), currentRole);
    setInputText('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [booking.chatMessages]);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-[#062B3A] text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={booking.assignedWorkerPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
              alt={booking.assignedWorkerName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm leading-none">{booking.assignedWorkerName}</h3>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">{booking.societyName}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <a
            href={`tel:${booking.assignedWorkerPhone}`}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Call Worker"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 text-[11px] text-emerald-800 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Cooperative Protected Chat. All messages are moderated by Society Ombudsman for safety.
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F7F2]/50">
        {booking.chatMessages.map((msg) => {
          const isMe = msg.senderId === currentUser.id || msg.senderRole === currentRole;
          const isSystem = msg.isSystem;

          if (isSystem) {
            return (
              <div key={msg.id} className="text-center my-2">
                <span className="inline-block px-3 py-1 bg-purple-50 text-purple-800 text-[10px] font-medium rounded-full border border-purple-200 shadow-2xs">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${
                isMe ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <span className="text-[10px] text-slate-400 mb-0.5 px-1 font-medium">
                {msg.senderName} ({msg.senderRole})
              </span>
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? 'bg-[#35C6B0] text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-slate-800 rounded-tl-xs shadow-xs border border-slate-100'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.timestamp}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Chips */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 scrollbar-none">
        {quickReplies.map((qr, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qr)}
            className="text-[10px] font-medium whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#F7F7F2] hover:bg-[#35C6B0]/10 text-[#062B3A] hover:text-[#35C6B0] border border-slate-200 transition-colors"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type message to worker & society coordinator..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-3.5 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl text-xs text-[#1C161A] focus:outline-none focus:ring-2 focus:ring-[#35C6B0]/40 focus:border-[#35C6B0]"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-[#35C6B0] hover:bg-[#2EAD9A] disabled:opacity-40 text-white rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
