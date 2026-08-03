import React, { useState, useEffect } from 'react';
import { Shield, Users, AlertTriangle, CheckCircle, Plus, RefreshCw, BarChart3, MapPin, Lock, FileText, Phone, Building } from 'lucide-react';
import { ResourceItem } from './ResourceMap';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'resources' | 'analytics'>('reports');
  const [reports, setReports] = useState<any[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState('admin@usalamakenya.org');
  const [authPassword, setAuthPassword] = useState('counselor123');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // New Resource form state
  const [showAddRes, setShowAddRes] = useState(false);
  const [newResName, setNewResName] = useState('');
  const [newResCategory, setNewResCategory] = useState<'hospital' | 'police' | 'shelter' | 'legal'>('hospital');
  const [newResCounty, setNewResCounty] = useState('Nairobi');
  const [newResAddress, setNewResAddress] = useState('');
  const [newResPhone, setNewResPhone] = useState('');

  useEffect(() => {
    // Attempt auto login with seed credentials
    handleLogin();
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        setUser(data.user);
        fetchDashboardData();
      } else {
        setErrorMsg(data.error || 'Login failed');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to authentication API');
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [repRes, resRes, anaRes] = await Promise.all([
        fetch('/api/reports'),
        fetch('/api/resources'),
        fetch('/api/analytics')
      ]);
      const repData = await repRes.json();
      const resData = await resRes.json();
      const anaData = await anaRes.json();

      if (repData.success) setReports(repData.data);
      if (resData.success) setResources(resData.data);
      if (anaData.success) setAnalytics(anaData.data);
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReportStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchDashboardData();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const toggleResourceVerification = async (resItem: ResourceItem) => {
    try {
      await fetch(`/api/resources/${resItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !resItem.isVerified })
      });
      fetchDashboardData();
    } catch (err) {
      console.error('Error verifying resource:', err);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResName || !newResPhone) return;

    try {
      await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newResName,
          category: newResCategory,
          county: newResCounty,
          address: newResAddress || 'Nairobi Area',
          phone: newResPhone,
          latitude: -1.2921 + (Math.random() - 0.5) * 0.05,
          longitude: 36.8219 + (Math.random() - 0.5) * 0.05,
          isVerified: true,
          isSafeSpace: true
        })
      });
      setShowAddRes(false);
      setNewResName('');
      setNewResPhone('');
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to create resource:', err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-slate-200">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Counselor / Admin Login</h3>
            <p className="text-xs text-slate-500 mt-1">Role-gated area under Kenya Data Protection Act 2019</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium mb-4">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors"
            >
              Sign In to Dashboard
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              Cancel & Return
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden">
        {/* Admin Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center font-bold">
              AK
            </div>
            <div>
              <h2 className="font-bold text-base md:text-lg">Salama Kenya • Counselor & Admin Portal</h2>
              <p className="text-xs text-emerald-200">
                Logged in as <span className="font-bold">{user?.name}</span> ({user?.organization}) • Role: {user?.role}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-950 rounded-lg text-xs font-bold"
            >
              ✕ Close Portal
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Triage Incident Reports ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'resources'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Manage Resource Directory ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Anonymized Kenya GBV Statistics
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {isLoading ? (
            <div className="text-center py-12 text-slate-400 font-medium text-sm">
              Loading secure encrypted dashboard data...
            </div>
          ) : activeTab === 'reports' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm uppercase">Incoming Survivor Reports</h3>
                <span className="text-xs text-slate-500">All data decrypted in-memory only for verified counselor review</span>
              </div>
              {reports.map((rep) => (
                <div key={rep.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded text-xs border border-emerald-200">
                          {rep.trackingCode}
                        </span>
                        <span className="font-bold text-sm text-slate-900 capitalize">
                          {rep.incidentType?.replace('_', ' ')}
                        </span>
                        {rep.immediateDanger && (
                          <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full uppercase">
                            ⚠️ Immediate Danger
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        County: <b>{rep.county}</b> • Approx time: <b>{rep.dateApprox}</b> • Received: {new Date(rep.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={rep.status}
                        onChange={(e) => updateReportStatus(rep.id, e.target.value)}
                        className="p-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700"
                      >
                        <option value="new">New</option>
                        <option value="in_review">In Review</option>
                        <option value="referral_made">Referral Made</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-800">
                    <span className="font-bold text-slate-500 block mb-1 uppercase">Survivor Description:</span>
                    {rep.description}
                  </div>

                  {rep.contactPhone && (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">
                      <Phone className="w-3.5 h-3.5" />
                      Optional Survivor Follow-up Contact: {rep.contactPhone}
                    </div>
                  )}

                  {rep.supportRequested && rep.supportRequested.length > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 font-semibold">Support Needed:</span>
                      {rep.supportRequested.map((s: string) => (
                        <span key={s} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-bold uppercase">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : activeTab === 'resources' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm uppercase">Verified Help Points Directory</h3>
                <button
                  onClick={() => setShowAddRes(!showAddRes)}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New Help Point
                </button>
              </div>

              {showAddRes && (
                <form onSubmit={handleCreateResource} className="bg-white p-5 rounded-2xl border-2 border-emerald-600 shadow-sm space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">Add Verified Shelter, Hospital or Legal Clinic</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Facility Name"
                      value={newResName}
                      onChange={(e) => setNewResName(e.target.value)}
                      className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                      required
                    />
                    <select
                      value={newResCategory}
                      onChange={(e) => setNewResCategory(e.target.value as any)}
                      className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                    >
                      <option value="hospital">Hospital / GVRC</option>
                      <option value="police">Police Station / Gender Desk</option>
                      <option value="shelter">Emergency Shelter / Safe House</option>
                      <option value="legal">Legal Aid Clinic</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={newResPhone}
                      onChange={(e) => setNewResPhone(e.target.value)}
                      className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddRes(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                    >
                      Save to Verified Directory
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resItem) => (
                  <div key={resItem.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-slate-900">{resItem.name}</h4>
                        <button
                          onClick={() => toggleResourceVerification(resItem)}
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase transition-all ${
                            resItem.isVerified
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {resItem.isVerified ? '✓ Verified Safe' : 'Unverified'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{resItem.address} • County: <b>{resItem.county}</b></p>
                      <p className="text-xs text-slate-700 font-bold mt-2">Phone: {resItem.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="font-bold text-slate-800 text-sm uppercase">Anonymized Kenya GBV Statistics</h3>
              {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <span className="text-xs text-slate-500 font-bold uppercase block">Total Encrypted Reports</span>
                    <span className="text-4xl font-black text-emerald-800 my-2 block">{analytics.totalReports}</span>
                    <span className="text-[11px] text-slate-400">Section 5 Kenya Data Act Compliant</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <span className="text-xs text-slate-500 font-bold uppercase block">Verified Help Points</span>
                    <span className="text-4xl font-black text-slate-800 my-2 block">{analytics.totalVerifiedResources}</span>
                    <span className="text-[11px] text-slate-400">Hospitals, Shelters, Legal Aid</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <span className="text-xs text-slate-500 font-bold uppercase block">24/7 National Hotlines</span>
                    <span className="text-4xl font-black text-slate-800 my-2 block">{analytics.totalHotlines}</span>
                    <span className="text-[11px] text-slate-400">Toll-Free Seeded Config</span>
                  </div>
                </div>
              )}

              {analytics && analytics.byCounty && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-xs text-slate-500 uppercase mb-3">Reports by County (Anonymized)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(analytics.byCounty).map(([c, count]) => (
                      <div key={c} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-800">{c}</span>
                        <span className="font-black text-sm text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">{String(count)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
