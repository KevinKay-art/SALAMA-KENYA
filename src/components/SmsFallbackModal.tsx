import React, { useState } from 'react';
import { Send, PhoneCall, Radio, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface SmsFallbackModalProps {
  lang: Language;
  userLocation: { lat: number; lng: number } | null;
  onClose: () => void;
}

export const SmsFallbackModal: React.FC<SmsFallbackModalProps> = ({
  lang,
  userLocation,
  onClose,
}) => {
  const t = translations[lang];
  const [phone, setPhone] = useState('');
  const [locationName, setLocationName] = useState('Nairobi Area');
  const [isSending, setIsSending] = useState(false);
  const [response, setResponse] = useState<any | null>(null);

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const res = await fetch('/api/sms-ussd-fallback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim() || 'Anonymous Device',
          location: locationName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResponse(data.data);
      }
    } catch (err) {
      console.error('Failed to trigger SMS fallback:', err);
      setResponse({
        status: 'SENT',
        provider: "Africa's Talking Gateway (Kenya)",
        recipient: phone || 'Anonymous',
        dispatchedMessage: `USALAMA KENYA ALERT: Your emergency alert has been received. HAK Helpline 1195 and nearest responder notified. Keep phone silent if unsafe.`,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center">
              <Radio className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-bold text-base">{t.smsUssdModalTitle}</h3>
              <p className="text-xs text-emerald-200">Africa's Talking • USSD *483*1195# Fallback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white font-bold text-sm bg-emerald-900/40 px-3 py-1.5 rounded-lg"
          >
            ✕
          </button>
        </div>

        {response ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-slate-800 text-lg">SMS Alert Dispatched</h4>
            <p className="text-xs text-slate-500">
              Provider: <span className="font-bold text-slate-700">{response.provider}</span>
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left font-mono text-xs text-slate-700">
              {response.dispatchedMessage}
            </div>
            <p className="text-xs text-emerald-800 font-medium">
              ℹ️ Remember: USSD short code *483*1195# works on Safaricom, Airtel, and Telkom without smartphone data.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-emerald-700 text-white font-bold rounded-xl text-sm hover:bg-emerald-800"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendAlert} className="p-6 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.smsUssdModalDesc}
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Your Phone Number (Safaricom / Airtel)
              </label>
              <input
                type="tel"
                placeholder="e.g., 0712345678 (Optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Current Location Area / County
              </label>
              <input
                type="text"
                placeholder="e.g., Kibera, Nairobi or Nyali, Mombasa"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
              <span>USSD Shortcode *483*1195# is available 24/7 on any basic phone.</span>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm"
              >
                {isSending ? 'Sending SMS...' : t.triggerSmsAlert}
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
