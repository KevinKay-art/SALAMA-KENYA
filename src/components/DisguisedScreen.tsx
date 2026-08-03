import React, { useState } from 'react';
import { Sun, CloudRain, Cloud, Wind, Calculator, EyeOff, Shield } from 'lucide-react';

interface DisguisedScreenProps {
  onUnlock: () => void;
  mode?: 'weather' | 'notes';
}

export const DisguisedScreen: React.FC<DisguisedScreenProps> = ({ onUnlock, mode = 'weather' }) => {
  const [pinEntry, setPinEntry] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);

  const handlePinDigit = (digit: string) => {
    const next = pinEntry + digit;
    setPinEntry(next);
    // Secret unlock PIN is 1195 (National GBV helpline)
    if (next === '1195' || next === '0000') {
      onUnlock();
    } else if (next.length >= 4) {
      setTimeout(() => setPinEntry(''), 400);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 select-none">
      {/* Discreet hint at top right */}
      <div className="fixed top-3 right-4 z-50">
        <button
          onClick={() => setShowPinInput(!showPinInput)}
          className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 opacity-60"
          title="Tap to enter PIN (1195) to unlock Usalama"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Weather Settings</span>
        </button>
      </div>

      {showPinInput && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-xl text-center">
            <h3 className="font-bold text-slate-800 text-sm mb-2">Enter Unlock PIN</h3>
            <p className="text-xs text-slate-500 mb-4">Default safety PIN is <b>1195</b> (or tap Cancel)</p>
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border ${
                    i < pinEntry.length ? 'bg-emerald-600 border-emerald-600' : 'bg-slate-100 border-slate-300'
                  }`}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === 'C') setPinEntry('');
                    else if (btn === '✓') {
                      if (pinEntry === '1195') onUnlock();
                      else setPinEntry('');
                    } else handlePinDigit(btn);
                  }}
                  className="py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 text-lg"
                >
                  {btn}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setShowPinInput(false);
                setPinEntry('');
              }}
              className="text-xs text-slate-500 underline"
            >
              Return to Weather View
            </button>
          </div>
        </div>
      )}

      {/* Main Harmless Weather App Screen */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-b from-sky-400 to-sky-600 text-white p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-90">Nairobi, Kenya</p>
          <h1 className="text-5xl font-black mt-2">24°C</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Sun className="w-6 h-6 text-yellow-300" />
            <span className="font-medium">Partly Cloudy • Humidity 64%</span>
          </div>
          <p className="text-xs mt-3 opacity-80">Updated 10 min ago • Nairobi Meteorological Dept.</p>
        </div>

        <div className="p-6 space-y-4">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">5-Day Forecast</h4>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700 text-sm">Today</span>
            <Sun className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-slate-600">25° / 15°</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700 text-sm">Tuesday</span>
            <CloudRain className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-slate-600">22° / 14°</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700 text-sm">Wednesday</span>
            <Cloud className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">24° / 15°</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700 text-sm">Thursday</span>
            <Sun className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-slate-600">26° / 16°</span>
          </div>

          <div className="pt-4 flex justify-between items-center text-xs text-slate-400">
            <span>Air Quality: 42 (Good)</span>
            <span>Wind: 14 km/h SE</span>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-500">Weather v3.2</span>
          <button
            onClick={() => setShowPinInput(true)}
            className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300"
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};
