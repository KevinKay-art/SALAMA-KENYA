import React, { useState, useEffect } from 'react';
import { Shield, Plus, CheckCircle, Trash2, Lock, AlertTriangle } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface SafetyStep {
  id: string;
  text: string;
  completed: boolean;
}

interface SafetyPlannerProps {
  lang: Language;
}

const STORAGE_KEY = 'usalama_kenya_safety_plan_v1';

export const SafetyPlanner: React.FC<SafetyPlannerProps> = ({ lang }) => {
  const t = translations[lang];
  const [steps, setSteps] = useState<SafetyStep[]>([]);
  const [newStepText, setNewStepText] = useState('');

  useEffect(() => {
    const defaultSteps: SafetyStep[] = [
      { id: 'step-1', text: t.packBag, completed: false },
      { id: 'step-2', text: t.identifyRoute, completed: false },
      { id: 'step-3', text: t.keepPhoneCharged, completed: false },
      { id: 'step-4', text: t.saveNumberNeighbor, completed: false },
      { id: 'step-5', text: t.codeWordFamily, completed: false },
    ];

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSteps(JSON.parse(saved));
      } else {
        setSteps(defaultSteps);
      }
    } catch (e) {
      setSteps(defaultSteps);
    }
  }, [t.packBag]);

  const saveToDisk = (updated: SafetyStep[]) => {
    setSteps(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      // ignore localstorage errors
    }
  };

  const toggleStep = (id: string) => {
    const updated = steps.map((s) =>
      s.id === id ? { ...s, completed: !s.completed } : s
    );
    saveToDisk(updated);
  };

  const addStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepText.trim()) return;
    const added: SafetyStep = {
      id: 'step-' + Date.now(),
      text: newStepText.trim(),
      completed: false,
    };
    saveToDisk([...steps, added]);
    setNewStepText('');
  };

  const removeStep = (id: string) => {
    saveToDisk(steps.filter((s) => s.id !== id));
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            {t.safetyPlanTitle}
          </h3>
          <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            Local Only
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">{t.safetyPlanSubtitle}</p>

        {/* List of checkable safety items */}
        <ul className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
          {steps.map((step) => (
            <li
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    step.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-emerald-500/60 bg-transparent'
                  }`}
                >
                  {step.completed && '✓'}
                </div>
                <span
                  className={`text-xs md:text-sm font-medium ${
                    step.completed ? 'line-through text-slate-400' : 'text-slate-100'
                  }`}
                >
                  {step.text}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeStep(step.id);
                }}
                className="text-slate-400 hover:text-rose-400 p-1"
                title="Remove reminder"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>

        {/* Add custom safety reminder */}
        <form onSubmit={addStep} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder={t.addStepPlaceholder}
            value={newStepText}
            onChange={(e) => setNewStepText(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
          <button
            type="submit"
            disabled={!newStepText.trim()}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700 text-[10px] text-slate-400 flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>{t.localOnlyNotice}</span>
      </div>
    </div>
  );
};
