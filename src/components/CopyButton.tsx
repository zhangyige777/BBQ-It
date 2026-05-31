'use client';
import { useState } from 'react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); } catch { document.execCommand('copy'); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-orange-900 text-gray-600 dark:text-gray-400'}`}>
      {copied ? '✓ Copied!' : 'Copy'}
    </button>
  );
}
