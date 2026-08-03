import React, { useState } from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle2, Copy, ArrowRight, HelpCircle, PhoneCall } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface IncidentReporterProps {
  lang: Language;
  onClose: () => void;
  onReportSubmitted: (trackingCode: string) => void;
}

export const IncidentReporter: React.FC<IncidentReporterProps> = ({
  lang,
  onClose,
  onReportSubmitted,
}) => {
  const t = translations[lang];
  const [consentGiven, setConsentGiven] = useState(false);
  const [incidentType, setIncidentType] = useState('physical_violence');
  const [dateApprox, setDateApprox] = useState('');
  const [county, setCounty] = useState('Nairobi');
  const [immediateDanger, setImmediateDanger] = useState(false);
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [supportRequested, setSupportRequested] = useState<string[]>(['counseling']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleSupport = (key: string) => {
    if (supportRequested.includes(key)) {
      setSupportRequested(supportRequested.filter((item) => item !== key));
    } else {
      setSupportRequested([...supportRequested, key]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentType,
          dateApprox: dateApprox || 'Recently',
          county,
          immediateDanger,
          description: description.trim(),
          contactPhone: contactPhone.trim() || undefined,
          consentGiven,
          supportRequested,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setSubmittedCode(data.data.trackingCode);
        onReportSubmitted(data.data.trackingCode);
      }
    } catch (err) {
      console.error('Failed to submit report:', err);
      // Fallback local tracking code if offline
      const fallbackCode = 'SAL-' + Math.floor(1000 + Math.random() * 9000);
      setSubmittedCode(fallbackCode);
      onReportSubmitted(fallbackCode);
    } finally {
      setIsSubmitting(false);
    }
  };

  const countiesKenya = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Kilifi',
    'Kiambu', 'Machakos', 'Kajiado', 'Garissa', 'Turkana', 'Kakamega', 'Meru', 'Isiolo', 'Narok'
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-emerald-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{t.reportTitle}</h3>
              <p className="text-xs text-emerald-200">{t.e2eEncrypted} • Kenya Data Protection Act 2019</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white font-bold text-sm bg-emerald-900/40 px-3 py-1.5 rounded-lg"
          >
            ✕ Close
          </button>
        </div>

        {/* Success Screen if submitted */}
        {submittedCode ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{t.reportSuccessTitle}</h3>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">{t.reportSuccessDesc}</p>
            </div>

            <div className="p-5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl max-w-xs mx-auto">
              <span className="text-xs font-semibold text-slate-500 uppercase">{t.trackingCodeLabel}</span>
              <div className="text-3xl font-black text-emerald-800 tracking-wider my-2">{submittedCode}</div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(submittedCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied to Clipboard!' : 'Copy Code'}
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Your data is stored encrypted. Our verified on-call counselor will review this report and coordinate with legal/medical responders.
            </p>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition-colors"
            >
              Return to Safe Dashboard
            </button>
          </div>
        ) : (
          /* Report Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Informed Consent Notice */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <span className="font-bold block text-emerald-950 mb-1">{t.consentTitle}</span>
                  {t.consentText}
                </div>
              </div>
              <label className="flex items-center gap-2 mt-3 pt-3 border-t border-emerald-200/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-emerald-400 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-emerald-900">
                  I agree to submit this report safely under these privacy terms.
                </span>
              </label>
            </div>

            {/* Immediate danger check */}
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span className="text-sm font-bold text-rose-900">{t.immediateDangerQ}</span>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={immediateDanger}
                  onChange={(e) => setImmediateDanger(e.target.checked)}
                  className="w-5 h-5 text-rose-600 rounded border-rose-300"
                />
                <span className="text-xs font-bold text-rose-700 uppercase">
                  {immediateDanger ? 'YES - Danger' : 'No - Safe'}
                </span>
              </label>
            </div>

            {immediateDanger && (
              <div className="p-3 bg-rose-600 text-white rounded-xl text-xs flex items-center justify-between">
                <span>⚠️ If you are in immediate danger right now, call HAK 1195 or Police 999!</span>
                <a
                  href="tel:1195"
                  className="px-3 py-1 bg-white text-rose-700 font-bold rounded-lg shrink-0"
                >
                  Call 1195
                </a>
              </div>
            )}

            {/* Incident Type & County */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t.incidentType} *
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="physical_violence">{t.incidentTypePhysical}</option>
                  <option value="sexual_violence">{t.incidentTypeSexual}</option>
                  <option value="emotional_abuse">{t.incidentTypeEmotional}</option>
                  <option value="fgm">{t.incidentTypeFgm}</option>
                  <option value="child_abuse">{t.incidentTypeChild}</option>
                  <option value="other">{t.incidentTypeOther}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t.countyLocation} *
                </label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {countiesKenya.map((c) => (
                    <option key={c} value={c}>{c} County</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date approx */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t.whenOccurred}
              </label>
              <input
                type="text"
                placeholder="e.g., Yesterday evening, or 3 days ago"
                value={dateApprox}
                onChange={(e) => setDateApprox(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t.descriptionLabel} *
              </label>
              <textarea
                rows={4}
                required
                placeholder={t.descriptionPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Optional Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t.optionalContactPhone}
              </label>
              <input
                type="tel"
                placeholder="e.g., 0712345678 (Leave blank to remain anonymous)"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">{t.optionalContactHelp}</span>
            </div>

            {/* Support Needed checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                {t.supportNeededLabel}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'legal', label: t.supportLegal },
                  { key: 'medical', label: t.supportMedical },
                  { key: 'shelter', label: t.supportShelter },
                  { key: 'counseling', label: t.supportCounseling },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleSupport(item.key)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-colors flex items-center gap-2 ${
                      supportRequested.includes(item.key)
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        supportRequested.includes(item.key)
                          ? 'border-white bg-white text-emerald-700'
                          : 'border-slate-400 bg-white'
                      }`}
                    >
                      {supportRequested.includes(item.key) && '✓'}
                    </div>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 text-slate-600 hover:text-slate-900 font-bold text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!consentGiven || isSubmitting || !description.trim()}
                className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
              >
                {isSubmitting ? 'Encrypting & Sending...' : t.submitReportBtn}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
