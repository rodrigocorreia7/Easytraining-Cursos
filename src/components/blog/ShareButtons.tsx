'use client';

import React, { useState } from 'react';
import { Share2, MessageCircle, Linkedin, Facebook, Copy, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== 'undefined' ? (url.startsWith('http') ? url : `${window.location.origin}${url}`) : url;

  const shareWhatsapp = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n${fullUrl}`)}`;
  const shareLinkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 py-4 border-y border-slate-100 my-8">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">
        <Share2 className="w-4 h-4 text-[#00B060]" />
        <span>Compartilhar:</span>
      </div>

      <a
        href={shareWhatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no WhatsApp"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-all text-xs font-semibold"
      >
        <MessageCircle className="w-4 h-4" />
        <span>WhatsApp</span>
      </a>

      <a
        href={shareLinkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no LinkedIn"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all text-xs font-semibold"
      >
        <Linkedin className="w-4 h-4" />
        <span>LinkedIn</span>
      </a>

      <a
        href={shareFacebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no Facebook"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all text-xs font-semibold"
      >
        <Facebook className="w-4 h-4" />
        <span>Facebook</span>
      </a>

      <button
        onClick={handleCopy}
        type="button"
        aria-label="Copiar link do artigo"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all text-xs font-semibold cursor-pointer ml-auto"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-[#00B060]" />
            <span className="text-[#00B060]">Link Copiado!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Copiar Link</span>
          </>
        )}
      </button>
    </div>
  );
};
