'use client';
import { useState } from 'react';
import { printsCatalog, PrintItem } from '@/lib/prints-catalog';
import { zodiacProfiles } from '@/lib/zodiac-data';

export default function VibeQuizModal({ onClose, onMatch }: { onClose: () => void; onMatch: (print: PrintItem) => void }) {
  const [selectedSign, setSelectedSign] = useState<string>('');

  const handleComplete = (signName: string) => {
    const profile = zodiacProfiles.find(z => z.sign === signName);
    if (!profile) return;

    const matchedPrint = printsCatalog.find(p => p.category === profile.categoryMatch) || printsCatalog[0];
    onMatch(matchedPrint);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] tracking-widest text-zinc-400 uppercase">StyleLab Studio</span>
            <h3 className="text-base font-semibold text-white">Select Your Zodiac Sign</h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-2">✕</button>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {zodiacProfiles.map((item) => (
            <button
              key={item.sign}
              onClick={() => setSelectedSign(item.sign)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedSign === item.sign
                  ? 'bg-white text-black border-white font-medium'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              <div className="text-xs font-semibold">{item.sign}</div>
              <div className={`text-[10px] mt-0.5 ${selectedSign === item.sign ? 'text-zinc-700' : 'text-zinc-500'}`}>
                {item.element}
              </div>
            </button>
          ))}
        </div>

        {selectedSign && (
          <div className="pt-2">
            <button
              onClick={() => handleComplete(selectedSign)}
              className="w-full py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all"
            >
              Reveal My Vibe Match
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
