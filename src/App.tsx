/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Usalama Kenya - GBV Support & Safety Application
 * Kenya Data Protection Act (2019) Compliant • Offline-Ready • Low-Data Capable
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Phone,
  ShieldAlert,
  MessageSquare,
  MapPin,
  Lock,
  EyeOff,
  Radio,
  FileText,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Settings,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  WifiOff,
  Activity
} from 'lucide-react';
import { Language, translations } from './i18n/translations';
import { ResourceItem, ResourceMap } from './components/ResourceMap';
import { DisguisedScreen } from './components/DisguisedScreen';
import { IncidentReporter } from './components/IncidentReporter';
import { SupportChatModal } from './components/SupportChatModal';
import { SafetyPlanner } from './components/SafetyPlanner';
import { SmsFallbackModal } from './components/SmsFallbackModal';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  // Disguise app mode (Weather / Notes screen)
  const [isDisguised, setIsDisguised] = useState(false);
  const [disguiseMode, setDisguiseMode] = useState<'weather' | 'notes'>('weather');

  // Low-data bundle mode (disables map tiles & heavy media)
  const [lowDataMode, setLowDataMode] = useState(false);

  // Modals state
  const [showReporter, setShowReporter] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showFullMapModal, setShowFullMapModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Data state
  const [contacts, setContacts] = useState<any[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [trackingCodeReceipt, setTrackingCodeReceipt] = useState<string | null>(null);
  const [shakeEnabled, setShakeEnabled] = useState(false);

  // Quick Exit trigger (ESC key or panic tap)
  const handleQuickExit = useCallback(() => {
    // Redirect instantly to neutral Kenya weather or standard site
    window.location.replace('https://www.google.com/search?q=nairobi+weather+today');
  }, []);

  // Listen for ESC key for Quick Exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleQuickExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleQuickExit]);

  // Load Seeded Kenya Contacts & Resources
  useEffect(() => {
    fetchInitialData();
    // Attempt location if permitted
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // Default to Nairobi coordinates if permission denied
          setUserLocation({ lat: -1.2921, lng: 36.8219 });
        }
      );
    }
  }, []);

  const fetchInitialData = async () => {
    try {
      const [cntRes, resRes] = await Promise.all([
        fetch('/api/contacts'),
        fetch('/api/resources')
      ]);
      const cntData = await cntRes.json();
      const resData = await resRes.json();
      if (cntData.success && cntData.data) setContacts(cntData.data);
      if (resData.success && resData.data) setResources(resData.data);
    } catch (err) {
      console.error('Error fetching contacts/resources:', err);
      // Seed fallback for offline preview
      setContacts([
        { id: 'hak-1195', name: 'National GBV Helpline', number: '1195', descriptionSw: 'Bila malipo (Toll-free)' },
        { id: 'child-116', name: 'Child Helpline', number: '116', descriptionSw: 'Kwa watoto pekee' },
        { id: 'police-999', name: 'Police Emergency', number: '999 / 112', descriptionSw: 'Dharura ya Polisi' },
        { id: 'creaw-0800', name: 'CREAW Support', number: '0800-720-186', descriptionSw: 'Legal & Shelter Aid' }
      ]);
    }
  };

  const clearHistoryAndCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      alert('All local cache, form drafts, and session history have been cleared for your privacy.');
    } catch (e) {
      // ignore
    }
  };

  // If Disguise Mode active, render harmless weather forecast
  if (isDisguised) {
    return (
      <DisguisedScreen
        mode={disguiseMode}
        onUnlock={() => setIsDisguised(false)}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 select-none">
      {/* Sleek Interface Header */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
            U
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              <span>{t.appTitle}</span>
              <span className="hidden sm:inline-block text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold uppercase">
                24/7 Verified
              </span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-semibold">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Toggle */}
          <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200">
            <button
              onClick={() => setLang('en')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                lang === 'en'
                  ? 'bg-white shadow-xs text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('sw')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                lang === 'sw'
                  ? 'bg-white shadow-xs text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kiswahili
            </button>
          </div>

          {/* Quick Exit Button (Always visible & fixed right) */}
          <button
            onClick={handleQuickExit}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl safe-exit-shadow flex items-center gap-1.5 uppercase text-xs sm:text-sm tracking-wider transition-transform active:scale-95"
            title="Immediately leaves the site to a weather forecast page"
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{t.quickExit}</span>
            <span className="text-[10px] opacity-80 hidden md:inline">{t.quickExitEsc}</span>
          </button>
        </div>
      </header>

      {/* Main Content using Sleek Interface 2/3 - 1/3 layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col lg:flex-row gap-6">
        {/* Left Column (2/3 width on desktop): Emergency Hotlines + Report Incident */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {/* Emergency Hotlines / Nambari za Dharura Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 text-slate-800">
                <span className="w-2 h-6 bg-emerald-600 rounded-full"></span>
                <span>{t.hotlinesTitle}</span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSmsModal(true)}
                  className="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden sm:inline">{t.smsUssdFallbackBtn}</span>
                  <span className="sm:hidden">SMS / USSD</span>
                </button>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  24/7 Support
                </span>
              </div>
            </div>

            {/* Grid of Verified Emergency Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* National GBV Helpline 1195 - Primary high urgency */}
              <a
                href="tel:1195"
                className="flex flex-col items-start p-5 bg-white border-2 border-emerald-600 rounded-2xl hover:bg-emerald-50/70 transition-colors group text-left tap-target"
              >
                <div className="w-full flex justify-between items-start">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight">
                    1195
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                    {t.tollFree}
                  </span>
                </div>
                <span className="font-bold mt-2 text-slate-800 group-hover:text-emerald-900">
                  National GBV Helpline
                </span>
                <span className="text-xs text-slate-500 italic mt-0.5">
                  Bila malipo (Toll-free 24/7)
                </span>
              </a>

              {/* Child Helpline 116 */}
              <a
                href="tel:116"
                className="flex flex-col items-start p-5 bg-white border-2 border-slate-200 rounded-2xl hover:border-emerald-600 transition-colors group text-left tap-target"
              >
                <div className="w-full flex justify-between items-start">
                  <span className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
                    116
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full uppercase">
                    {t.tollFree}
                  </span>
                </div>
                <span className="font-bold mt-2 text-slate-800 group-hover:text-emerald-800">
                  Child Helpline Kenya
                </span>
                <span className="text-xs text-slate-500 italic mt-0.5">
                  Kwa watoto pekee (Minors)
                </span>
              </a>

              {/* Police Emergency 999 / 112 */}
              <a
                href="tel:999"
                className="flex flex-col items-start p-5 bg-white border-2 border-slate-200 rounded-2xl hover:border-emerald-600 transition-colors group text-left tap-target"
              >
                <div className="w-full flex justify-between items-start">
                  <span className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
                    999 / 112
                  </span>
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full uppercase">
                    Emergency
                  </span>
                </div>
                <span className="font-bold mt-2 text-slate-800 group-hover:text-emerald-800">
                  Police & General Emergency
                </span>
                <span className="text-xs text-slate-500 italic mt-0.5">
                  Dharura ya Polisi
                </span>
              </a>

              {/* CREAW Support 0800-720-186 */}
              <a
                href="tel:0800720186"
                className="flex flex-col items-start p-5 bg-white border-2 border-slate-200 rounded-2xl hover:border-emerald-600 transition-colors group text-left tap-target"
              >
                <div className="w-full flex justify-between items-start">
                  <span className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
                    0800-720-186
                  </span>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase">
                    Legal Aid
                  </span>
                </div>
                <span className="font-bold mt-2 text-slate-800 group-hover:text-emerald-800">
                  CREAW Support Line
                </span>
                <span className="text-xs text-slate-500 italic mt-0.5">
                  Legal & Shelter Aid
                </span>
              </a>
            </div>

            {/* Feature phone SMS/USSD footer bar */}
            <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Using a basic phone or low 3G? Dial <b>*483*1195#</b> or use our Africa's Talking SMS alert.
                </span>
              </div>
              <button
                onClick={() => setShowSmsModal(true)}
                className="font-bold text-emerald-700 hover:text-emerald-900 underline shrink-0"
              >
                Send SMS Alert →
              </button>
            </div>
          </div>

          {/* Report an Incident Anonymously Banner (Emerald Card) */}
          <div className="bg-emerald-800 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm">
            <div className="w-full sm:w-2/3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-700 text-emerald-100 text-[10px] font-bold rounded-full uppercase">
                  100% Anonymous
                </span>
                <span className="text-xs text-emerald-200 font-medium">Kenya Data Act 2019 Compliant</span>
              </div>
              <h3 className="text-xl font-bold">{t.reportTitle}</h3>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                {t.reportSubtitle}
              </p>
            </div>
            <button
              onClick={() => setShowReporter(true)}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-emerald-50 text-emerald-900 font-bold rounded-xl shadow-md transition-transform active:scale-95 whitespace-nowrap text-sm"
            >
              {t.startReportBtn}
            </button>
          </div>

          {/* Quick Action Pills Row (Chat, Disguise Mode, Admin Portal) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setShowChat(true)}
              className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-left shadow-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{t.chatTitle}</h4>
                  <p className="text-[11px] text-slate-500">Encrypted with counselor</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setIsDisguised(true)}
              className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-left shadow-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center font-bold">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{t.disguiseTitle}</h4>
                  <p className="text-[11px] text-slate-500">Switch to Weather / Notes</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setShowAdmin(true)}
              className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-left shadow-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{t.navAdmin}</h4>
                  <p className="text-[11px] text-slate-500">Role-gated triage & resources</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Right Column (1/3 width on desktop): Nearby Help Points + Safety Planning */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {/* Nearby Help Points Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>{t.nearbyHelpTitle}</span>
                </h3>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold uppercase">
                  {resources.length} Verified
                </span>
              </div>

              {/* List of nearby verified facilities */}
              <div className="space-y-3">
                {resources.slice(0, 4).map((res) => (
                  <div
                    key={res.id}
                    onClick={() => {
                      setSelectedResource(res);
                      setShowFullMapModal(true);
                    }}
                    className="p-3.5 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-100 hover:border-emerald-300 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800">{res.name}</h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                          res.category === 'hospital'
                            ? 'bg-blue-100 text-blue-700'
                            : res.category === 'police'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {res.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {res.address} • County: <b>{res.county}</b>
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <a
                        href={`tel:${res.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        Call: {res.phone}
                      </a>
                      <span className="text-emerald-700 font-semibold">✓ Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowFullMapModal(true)}
              className="w-full mt-6 py-3 border border-emerald-600 text-emerald-700 font-bold rounded-xl text-xs sm:text-sm hover:bg-emerald-50 transition-colors"
            >
              {t.viewFullMap}
            </button>
          </div>

          {/* Safety Planning Toolkit Card (Dark Slate Box from Sleek Interface) */}
          <SafetyPlanner lang={lang} />
        </div>
      </main>

      {/* Sleek Interface Footer */}
      <footer className="px-4 sm:px-8 py-4 bg-slate-100 border-t border-slate-200 flex flex-wrap justify-between items-center gap-4 text-[11px] text-slate-500 font-medium">
        <div className="flex flex-wrap gap-4 uppercase tracking-wider font-bold text-slate-600">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            {t.privateMode}
          </span>
          <span>{t.noHistory}</span>
          <span>{t.e2eEncrypted}</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setLowDataMode(!lowDataMode)}
            className={`px-2.5 py-1 rounded-lg border font-semibold ${
              lowDataMode
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-white border-slate-300 text-slate-600'
            }`}
          >
            {lowDataMode ? '⚡ Low-Data Mode: ON' : 'Low-Data Mode: OFF'}
          </button>
          <button
            onClick={clearHistoryAndCache}
            className="text-slate-500 hover:text-rose-600 underline font-semibold"
          >
            {t.clearHistoryBtn}
          </button>
          <span className="hidden md:inline">{t.dataActNotice}</span>
        </div>
      </footer>

      {/* MODALS */}

      {/* 1. Incident Reporter Modal */}
      {showReporter && (
        <IncidentReporter
          lang={lang}
          onClose={() => setShowReporter(false)}
          onReportSubmitted={(code) => setTrackingCodeReceipt(code)}
        />
      )}

      {/* 2. Support Chat Modal */}
      {showChat && (
        <SupportChatModal
          lang={lang}
          onClose={() => setShowChat(false)}
        />
      )}

      {/* 3. SMS/USSD Fallback Modal */}
      {showSmsModal && (
        <SmsFallbackModal
          lang={lang}
          userLocation={userLocation}
          onClose={() => setShowSmsModal(false)}
        />
      )}

      {/* 4. Full Interactive Resource Map Modal */}
      {showFullMapModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden">
            <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-200" />
                <h3 className="font-bold text-base">Verified Kenya GBV Help Points Map & Directory</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLowDataMode(!lowDataMode)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold ${
                    lowDataMode ? 'bg-amber-500 text-white' : 'bg-emerald-900 text-emerald-200'
                  }`}
                >
                  {lowDataMode ? '⚡ Switch to Interactive Map' : 'Switch to Fast List View'}
                </button>
                <button
                  onClick={() => setShowFullMapModal(false)}
                  className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-lg text-xs"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              <ResourceMap
                resources={resources}
                userLocation={userLocation}
                selectedResource={selectedResource}
                onSelectResource={(res) => setSelectedResource(res)}
                lang={lang}
                lowDataMode={lowDataMode}
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. Counselor / Admin Portal */}
      {showAdmin && (
        <AdminDashboard onClose={() => setShowAdmin(false)} />
      )}
    </div>
  );
}
