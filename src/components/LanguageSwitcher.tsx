import React from 'react';
import { useLanguage, LANGUAGE_LABELS, Language } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = ({ compact = false }: { compact?: boolean }) => {
  const { lang, setLang } = useLanguage();
  const langs: Language[] = ['en', 'hi', 'te'];

  if (compact) {
    return (
      <div className="flex gap-1">
        {langs.map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-2.5 py-1 rounded-lg text-xs font-display font-semibold transition-all ${
              lang === l ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {LANGUAGE_LABELS[l]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <div className="flex gap-1">
        {langs.map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1.5 rounded-lg text-xs font-display font-semibold transition-all ${
              lang === l ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {LANGUAGE_LABELS[l]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
