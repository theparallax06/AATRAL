import React, { useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../i18n/translations';

interface LanguageSelectorProps {
  variant?: 'compact' | 'expanded';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'compact' }) => {
  const { currentLanguage, setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const activeLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
          isOpen
            ? 'bg-[#35C6B0] text-white border-[#35C6B0] shadow-xs'
            : 'bg-white/10 hover:bg-white/20 text-slate-100 border-white/15'
        }`}
        title="Change Platform Language (8 Languages)"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span className="text-xs font-bold">{activeLang.nativeName}</span>
        <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
            <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Select Indian Language
              </span>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = currentLanguage === lang.code;

                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#F7F7F2] text-[#35C6B0] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{lang.nativeName}</span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({lang.name})
                      </span>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-[#35C6B0]" />}
                  </button>
                );
              })}
            </div>

            <div className="px-3 pt-2 border-t border-slate-100 mt-1">
              <span className="text-[10px] text-slate-400 block text-center">
                Cooperative Multilingual Accessibility
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
