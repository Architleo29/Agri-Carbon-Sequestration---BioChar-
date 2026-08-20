import React, { useState } from 'react';
import { creditLots, buyers, batches, farmers, kpis, clusters } from '../data/mockDataset.js';
import { 
  Home, 
  MapPin, 
  Search, 
  Calendar, 
  FileText, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Download, 
  Link as LinkIcon, 
  Settings, 
  BarChart3, 
  Users, 
  Leaf, 
  Trees, 
  Droplets, 
  FlaskConical, 
  Award, 
  Globe, 
  Factory, 
  Copy, 
  Navigation, 
  FileBarChart, 
  CheckSquare, 
  Zap, 
  Activity,
  Briefcase,
  Lock,
  ChevronRight,
  ExternalLink,
  Filter,
  Check,
  Building2,
  Sparkles,
  X
} from 'lucide-react';

export default function BuyerPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBuyerId, setSelectedBuyerId] = useState('BUY-001');
  const [selectedLotId, setSelectedLotId] = useState(null);
  const [certificateModalLot, setCertificateModalLot] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [marketplaceFilter, setMarketplaceFilter] = useState('all');

  // Selected corporate buyer
  const buyer = buyers.find(b => b.id === selectedBuyerId) || buyers[0];

  // Dynamic portfolio derived directly from Command Center creditLots
  const buyerLots = creditLots.filter(l => 
    l.buyerId === buyer.id || 
    (l.buyerName && l.buyerName.toLowerCase().includes(buyer.name.toLowerCase().split(' ')[0]))
  );

  const purchasedVolume = buyerLots.reduce((acc, l) => acc + l.volume, 0) || buyer.deliveredVolume;
  const retiredVolume = buyerLots.filter(l => l.status?.toLowerCase() === 'retired').reduce((acc, l) => acc + l.volume, 0) || Math.round(purchasedVolume * 0.4);
  const activeHoldingVolume = Math.max(0, purchasedVolume - retiredVolume);
  const contractProgressPct = Math.min(100, Math.round((purchasedVolume / (buyer.contractedVolume || 800)) * 100));

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    const map = {
      'minted': 'bg-blue-100 text-blue-800 border-blue-200',
      'issued': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'sold': 'bg-purple-100 text-purple-800 border-purple-200',
      'retired': 'bg-slate-100 text-slate-700 border-slate-300',
      'pending': 'bg-amber-100 text-amber-800 border-amber-200'
    };
    return (
      <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full uppercase tracking-wider border ${map[s] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
        {status}
      </span>
    );
  };

  const renderTabs = () => {
    const tabs = [
      { id: 'dashboard', label: 'Dashboard & Impact', icon: BarChart3 },
      { id: 'portfolio', label: 'My Offtake Portfolio', icon: Briefcase, count: buyerLots.length },
      { id: 'marketplace', label: 'Carbon Marketplace', icon: Search },
      { id: 'mrv', label: 'dMRV Provenance & Evidence', icon: ShieldCheck },
      { id: 'offtake', label: 'Master Offtake Agreement', icon: FileText },
      { id: 'esg', label: 'CSRD / ESRS ESG Export', icon: FileBarChart },
      { id: 'invoicing', label: 'Invoices & Settlements', icon: FileText },
    ];

    return (
      <div className="bg-[#FFFFFF] border-b border-[#E2E8F0] sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
          <nav className="flex space-x-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-semibold text-xs tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-[#10B981] text-[#047857]'
                      : 'border-transparent text-[#64748B] hover:text-[#0B1914] hover:border-[#CBD5E1]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#10B981]' : ''}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-[#F1F5F9] text-slate-600 font-mono font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    );
  };

  // 1. Dashboard View
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Buyer Overview Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#10B981]/30">
                Verified Corporate Offtaker
              </span>
              <span className="text-xs text-[#64748B] font-mono">Season: Kharif 2025</span>
            </div>
            <h2 className="text-2xl font-black text-[#0F172A]">{buyer.name}</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Fixed Multi-Year Biochar Carbon Removal Contract · Aggregated via Agri-Carbon Unified FPO
            </p>
          </div>

          {/* Buyer Selector Dropdown */}
          <div className="flex items-center gap-3 bg-[#F8FAFC] p-2 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-[#64748B] whitespace-nowrap pl-2">Switch Entity:</span>
            <select
              value={selectedBuyerId}
              onChange={(e) => setSelectedBuyerId(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            >
              {buyers.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex justify-between text-xs font-bold text-[#334155] mb-2">
            <span>Contracted vs Verified Delivered CORCs</span>
            <span className="text-[#047857]">{purchasedVolume} / {buyer.contractedVolume} tCO2e ({contractProgressPct}%)</span>
          </div>
          <div className="w-full bg-[#F1F5F9] rounded-full h-3.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#047857] to-[#10B981] h-3.5 rounded-full transition-all duration-700" 
              style={{ width: `${contractProgressPct}%` }}
            ></div>
          </div>
          <div className="flex flex-wrap items-center justify-between text-xs text-[#64748B] mt-2.5">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Next Scheduled Minting Delivery: <strong>{buyer.nextDeliveryDate || '2025-06-30'}</strong></span>
            </div>
            <span className="font-mono font-bold text-slate-800">Unit Price: {buyer.pricePerTonne} / tCO2e</span>
          </div>
        </div>
      </div>

      {/* Real Impact KPI Grid */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#64748B] mb-3">Live Verified Environmental & Social Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'CO2e Permanently Removed', value: `${purchasedVolume} t`, sub: '100+ Year Durability (EBC)', icon: Leaf, color: 'text-[#10B981]', bg: 'bg-[#F0FDF4]' },
            { label: 'Participating Farmers', value: `${Math.min(500, Math.round(purchasedVolume * 0.95))}`, sub: 'Agri-Carbon Unified FPO', icon: Users, color: 'text-[#3B82F6]', bg: 'bg-blue-50' },
            { label: 'Acres Diverted from Smoke', value: `${Math.round(purchasedVolume * 2.4)} ac`, sub: 'Sentinel-2 Zero-Burn Pass', icon: MapPin, color: 'text-[#F59E0B]', bg: 'bg-amber-50' },
            { label: 'Farmer Cash Transferred', value: `₹${((purchasedVolume * 2.4) * 9100 / 100000).toFixed(2)} L`, sub: '₹9,100/ac Direct DBT Pool', icon: Award, color: 'text-[#8B5CF6]', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-[#E2E8F0] flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B]">{stat.label}</p>
                <p className="text-2xl font-black text-[#0F172A] mt-0.5">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-medium">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Cluster Co-Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-5">
          <h3 className="text-base font-bold text-[#0F172A] mb-3 flex items-center justify-between">
            <span>Active Pilot Operating Clusters</span>
            <span className="text-xs text-[#10B981] font-mono font-bold">5 Hubs · 25 Kilns</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {clusters.slice(0, 3).map(c => (
              <div key={c.name} className="p-3.5 bg-[#F8FAFC] rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-[#0F172A]">{c.name}</span>
                  <span className="text-[10px] bg-green-100 text-[#047857] px-1.5 py-0.5 rounded font-bold">{c.complianceRate}% Verified</span>
                </div>
                <p className="text-[11px] text-slate-500">{c.memberCount} Farmers · {c.totalAcres} Acres</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs font-bold text-slate-800">{c.totalStubbleDivertedT}t Biomass</span>
                  <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    {c.inProcessCount} In-Process
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0B1914] to-[#132E27] text-white rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#10B981]">Durability Guarantee</span>
            <h4 className="text-lg font-black text-white mt-1">EBC Class I Standard</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Every carbon credit is independently certified with an H:Corg ratio ≤ 0.4 and permanent mineral carbon storage of over 100+ years.
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('mrv')}
            className="mt-4 w-full bg-[#10B981] hover:bg-[#059669] text-[#0B1914] font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            Inspect Lab dMRV Evidence <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  // 2. Offtake Portfolio Tab
  const renderPortfolio = () => (
    <div className="space-y-6">
      {/* Portfolio Balance Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E2E8F0]">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Total Allocated Volume</p>
          <p className="text-3xl font-black text-[#0F172A] mt-1">{purchasedVolume} <span className="text-sm font-medium text-slate-400">tCO2e</span></p>
          <p className="text-xs text-slate-500 mt-1">{buyerLots.length} verified registry lots</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E2E8F0]">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Officially Retired (SBTi / CSRD)</p>
          <p className="text-3xl font-black text-[#10B981] mt-1">{retiredVolume} <span className="text-sm font-medium text-slate-400">tCO2e</span></p>
          <p className="text-xs text-[#059669] font-medium mt-1">Permanently retired for ESG claims</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E2E8F0]">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Active Tradable Holding</p>
          <p className="text-3xl font-black text-[#3B82F6] mt-1">{activeHoldingVolume} <span className="text-sm font-medium text-slate-400">tCO2e</span></p>
          <p className="text-xs text-slate-500 mt-1">Available for immediate retirement</p>
        </div>
      </div>

      {/* Credit Lots Table */}
      <div className="bg-white shadow-sm rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC]">
          <div>
            <h3 className="font-bold text-sm text-[#0F172A]">Allocated Credit Lots ({buyer.name})</h3>
            <p className="text-xs text-slate-500">Traceable directly to village kiln batches and Eurofins lab tests</p>
          </div>
          <span className="text-xs font-mono font-bold bg-white px-3 py-1 rounded-lg border border-slate-200 text-slate-700">
            {buyerLots.length} Lots in Portfolio
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="p-3.5">Lot ID</th>
                <th className="p-3.5">Registry Standard</th>
                <th className="p-3.5">Vintage</th>
                <th className="p-3.5">Volume (tCO2e)</th>
                <th className="p-3.5">Durability</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {buyerLots.length > 0 ? (
                buyerLots.map((lot) => (
                  <tr key={lot.lotId} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-3.5 text-xs font-mono font-bold text-[#0F172A]">{lot.lotId}</td>
                    <td className="p-3.5 text-xs text-[#334155]">{lot.registry}</td>
                    <td className="p-3.5 text-xs font-mono text-[#334155]">{lot.vintage}</td>
                    <td className="p-3.5 text-xs font-bold text-[#0F172A]">{lot.volume} tCO2e</td>
                    <td className="p-3.5 text-xs text-slate-600 font-mono">{lot.durabilityRating || 'H:Corg ≤ 0.4'}</td>
                    <td className="p-3.5">{getStatusBadge(lot.status)}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedLotId(lot.lotId);
                          setActiveTab('mrv');
                        }}
                        className="inline-flex items-center text-xs font-semibold text-[#047857] hover:text-[#065F46] hover:underline cursor-pointer"
                      >
                        Inspect dMRV
                      </button>
                      <button 
                        onClick={() => setCertificateModalLot(lot)}
                        className="inline-flex items-center text-xs font-bold text-[#3B82F6] hover:text-[#1D4ED8] bg-blue-50 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" /> Certificate
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                    No active lots allocated yet for this entity. Browse the Marketplace to request credit allocation.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 3. Carbon Marketplace Tab
  const renderMarketplace = () => {
    const availableLots = creditLots.filter(l => {
      if (marketplaceFilter === 'minted') return l.status.toLowerCase() === 'minted';
      if (marketplaceFilter === 'issued') return l.status.toLowerCase() === 'issued';
      return l.status.toLowerCase() === 'minted' || l.status.toLowerCase() === 'issued';
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#0F172A]">Available Carbon Removal Credits</h3>
            <p className="text-xs text-slate-500">Live unallocated biochar lots from Kharif 2025 harvest</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setMarketplaceFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                marketplaceFilter === 'all' ? 'bg-[#0B1914] text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              All Available ({creditLots.filter(l => l.status === 'minted' || l.status === 'issued').length})
            </button>
            <button
              onClick={() => setMarketplaceFilter('issued')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                marketplaceFilter === 'issued' ? 'bg-[#0B1914] text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Issued Only
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="p-4">Lot Identifier</th>
                  <th className="p-4">Standard</th>
                  <th className="p-4">Vintage</th>
                  <th className="p-4">Volume (tCO2e)</th>
                  <th className="p-4">Durability</th>
                  <th className="p-4">Indicative Price</th>
                  <th className="p-4">Registry Status</th>
                  <th className="p-4 text-right">Offtake Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {availableLots.slice(0, 12).map((lot) => (
                  <tr key={lot.lotId} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-4 text-xs font-mono font-bold text-[#0F172A]">{lot.lotId}</td>
                    <td className="p-4 text-xs text-[#334155]">{lot.registry}</td>
                    <td className="p-4 text-xs font-mono text-[#334155]">{lot.vintage}</td>
                    <td className="p-4 text-xs font-black text-[#0F172A]">{lot.volume} tCO2e</td>
                    <td className="p-4 text-xs text-[#047857] font-semibold">{lot.durabilityRating || 'H:Corg ≤ 0.4'}</td>
                    <td className="p-4 text-xs font-bold text-slate-800">{lot.indicativePrice || '€148/t'}</td>
                    <td className="p-4">{getStatusBadge(lot.status)}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => showToast(`Offtake request submitted for ${lot.lotId} (${lot.volume} tCO2e) by ${buyer.name}`)}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0B1914] hover:bg-[#132E27] active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        Request Offtake
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 4. dMRV Evidence & Provenance Inspector
  const renderMRV = () => {
    const activeLot = creditLots.find(l => l.lotId === selectedLotId) || buyerLots[0] || creditLots[0];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-[#059669] bg-green-50 px-2 py-0.5 rounded">
                Chain of Custody Active
              </span>
              <span className="text-xs font-mono text-slate-500">Lot: {activeLot.lotId}</span>
            </div>
            <h3 className="text-lg font-black text-[#0F172A] mt-1">dMRV Digital Audit Trail</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">Ledger Hash:</span>
            <span className="font-mono text-xs bg-[#F1F5F9] px-2.5 py-1 rounded-lg border border-[#E2E8F0] text-[#0F172A] flex items-center gap-1.5">
              0x8f2d...4a19
              <button 
                onClick={() => showToast('Puro.earth Ledger Hash copied to clipboard!')}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
                title="Copy hash"
              >
                <Copy size={12} />
              </button>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chain of Custody Timeline */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]">
            <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-6 flex items-center">
              <LinkIcon className="w-4 h-4 mr-2 text-[#10B981]" /> 5-Step Immutable Custody Timeline
            </h4>
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:h-full before:w-0.5 before:bg-slate-200">
              {[
                { title: '1. Farmer Plot GPS Registration', desc: '500 smallholder farmer parcels boundary-mapped across 5 clusters.', date: 'Kharif 2025', icon: MapPin },
                { title: '2. Stubble Weigh-in & Moisture Test', desc: 'Intake weight and < 15% moisture verified at village weighbridge.', date: 'Daily Log', icon: Factory },
                { title: '3. Pyrolysis Thermocouple Telemetry', desc: 'IoT continuous logging at 623°C (target 500–700°C) with water quench.', date: 'IoT Stream', icon: Zap },
                { title: '4. Eurofins Laboratory Analysis', desc: 'H:Corg = 0.28 (≤ 0.4 standard), 82.4% organic carbon content certified.', date: 'Lab Pass', icon: FlaskConical },
                { title: '5. Registry Issuance & Tokenization', desc: 'Puro.earth / Verra CORC minted with tamper-evident QR serial.', date: 'Minted', icon: Award },
              ].map((step, idx) => (
                <div key={idx} className="relative flex items-start space-x-4 pl-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0B1914] text-[#10B981] shadow-xs z-10 shrink-0 border-2 border-white">
                    <step.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-[#0F172A] text-xs">{step.title}</h5>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{step.date}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Satellite Evidence */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-[#3B82F6]" /> Sentinel-2 NDVI Satellite Scan
                </h4>
                <span className="bg-[#D1FAE5] text-[#065F46] text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center border border-[#10B981]/30">
                  <CheckCircle className="w-3 h-3 mr-1 text-[#10B981]" /> 94.2% Zero-Burn Verified (27 In-Process)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-32 bg-[url('/pre_harvest.jpg')] bg-cover bg-center rounded-xl overflow-hidden relative border border-slate-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2.5">
                    <span className="text-white text-[10px] font-bold">Pre-Harvest Scan (10 Oct 2025)</span>
                  </div>
                </div>
                <div className="h-32 bg-[url('/post_harvest.jpg')] bg-cover bg-center rounded-xl overflow-hidden relative border-2 border-[#10B981]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2.5">
                    <span className="text-white text-[10px] font-bold">Post-Harvest Clear (02 Nov 2025)</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#64748B] mt-3 leading-relaxed">
                Zero thermal fire signatures detected across all enrolled farmer coordinates throughout the residue management window.
              </p>
            </div>

            {/* Eurofins Lab Test Result Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center">
                  <FlaskConical className="w-4 h-4 mr-2 text-[#8B5CF6]" /> Eurofins Laboratory Certificate
                </h4>
                <span className="bg-purple-50 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-purple-200">
                  EBC Certified
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">H:Corg Ratio</span>
                  <span className="font-black text-[#0F172A] text-sm">0.28 <span className="text-[10px] text-[#10B981] font-bold">(≤ 0.4 req)</span></span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Organic Carbon Content</span>
                  <span className="font-black text-[#0F172A] text-sm">82.4%</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Moisture Retention</span>
                  <span className="font-black text-[#0F172A] text-sm">5.8%</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Heavy Metal Analysis</span>
                  <span className="font-black text-[#10B981] text-sm">PASSED (Below LOD)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 5. Master Offtake Agreement Tab
  const renderOfftake = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-[#0F172A]">Master Carbon Removal Offtake Agreement</h3>
              <span className="px-2.5 py-0.5 bg-green-100 text-[#047857] text-xs font-bold rounded-full">
                Contract Active (2025–2027)
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 bg-[#F8FAFC] p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <p className="text-slate-500 font-medium">Agreement ID</p>
                <p className="font-bold text-[#0F172A] mt-0.5">MOA-2025-{buyer.id}-01</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Corporate Counterparty</p>
                <p className="font-bold text-[#0F172A] mt-0.5">{buyer.name}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Total Multi-Year Commitment</p>
                <p className="font-bold text-[#0F172A] mt-0.5">{buyer.contractedVolume} tCO2e</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Contracted Unit Price</p>
                <p className="font-bold text-[#047857] mt-0.5">{buyer.pricePerTonne} / tCO2e</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Delivery & Verification Schedule</h4>
              <div className="space-y-2.5">
                {[
                  { q: 'Q1 2025', vol: Math.round(buyer.contractedVolume * 0.25), status: 'Delivered & Certified', color: 'text-[#10B981]' },
                  { q: 'Q2 2025', vol: Math.round(buyer.contractedVolume * 0.35), status: 'Delivered & Certified', color: 'text-[#10B981]' },
                  { q: 'Q3 2025', vol: Math.round(buyer.contractedVolume * 0.25), status: 'Minting in Progress', color: 'text-[#F59E0B]' },
                  { q: 'Q4 2025', vol: Math.round(buyer.contractedVolume * 0.15), status: 'Harvest Scheduled', color: 'text-[#64748B]' },
                ].map((del, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs">
                    <span className="font-bold text-[#0F172A]">{del.q}</span>
                    <span className="font-mono text-slate-700 font-semibold">{del.vol} tCO2e</span>
                    <span className={`font-bold ${del.color}`}>{del.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] mb-4">Legal Documents</h3>
            <ul className="space-y-3">
              <li>
                <div 
                  onClick={() => showToast('Downloading Signed MOA PDF...')}
                  className="flex items-center p-3 rounded-xl hover:bg-[#F1F5F9] transition-colors border border-slate-200 cursor-pointer"
                >
                  <FileText className="w-5 h-5 mr-3 text-[#10B981]" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#0F172A]">Signed Master Agreement</p>
                    <p className="text-[10px] text-[#64748B]">PDF • 2.4 MB (Kharif 2025)</p>
                  </div>
                  <Download className="w-4 h-4 text-[#059669]" />
                </div>
              </li>
              <li>
                <div 
                  onClick={() => showToast('Downloading EBC Durability Addendum...')}
                  className="flex items-center p-3 rounded-xl hover:bg-[#F1F5F9] transition-colors border border-slate-200 cursor-pointer"
                >
                  <FileText className="w-5 h-5 mr-3 text-[#3B82F6]" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#0F172A]">EBC Durability Addendum</p>
                    <p className="text-[10px] text-[#64748B]">PDF • 1.1 MB (H:Corg ≤ 0.4)</p>
                  </div>
                  <Download className="w-4 h-4 text-[#059669]" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // 6. ESG & CSRD Reporting Tab
  const renderESG = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-xl font-bold text-[#0F172A]">CSRD / ESRS E1-7 Sustainability Export</h3>
          <p className="text-xs text-slate-500">Standardized Greenhouse Gas Removals disclosure statement</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => showToast('Copied CSRD disclosure table to clipboard!')} 
            className="flex items-center px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#334155] hover:bg-slate-50 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Text
          </button>
          <button 
            onClick={() => showToast('Generated & Downloaded CSRD ESG Summary Report (PDF)')} 
            className="flex items-center px-3.5 py-2 bg-[#0B1914] text-white rounded-xl text-xs font-bold hover:bg-[#132E27] cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Download Report
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E2E8F0] space-y-6">
        <div className="border-l-4 border-[#10B981] pl-5 py-1">
          <h2 className="text-xl font-black text-[#0F172A]">{buyer.name} — GHG Removal Disclosure</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Reporting Standard: ESRS E1-7 (Direct Air & Biochar Carbon Removals)</p>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Through participation in the Agri-Carbon Digital Platform (Kharif 2025 Season), <strong>{buyer.name}</strong> has contracted <strong>{buyer.contractedVolume} tCO2e</strong> and retired <strong>{retiredVolume} tCO2e</strong> of durable carbon removals. Residue stubble was diverted from open-field burning in Punjab & Haryana and transformed via pyrolytic kilns into high-purity biochar applied to local soils.
        </p>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-[#F0FDF4] p-4 rounded-xl border border-green-200">
            <p className="text-2xl font-black text-[#059669]">{purchasedVolume} t</p>
            <p className="text-[11px] font-bold text-[#065F46] mt-1">CO2e Sequestered</p>
          </div>
          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-200">
            <p className="text-2xl font-black text-[#0F172A]">{Math.round(purchasedVolume * 0.95)}</p>
            <p className="text-[11px] font-bold text-slate-600 mt-1">Smallholder Beneficiaries</p>
          </div>
          <div className="bg-[#FEF3C7] p-4 rounded-xl border border-amber-200">
            <p className="text-2xl font-black text-[#92400E]">&gt; 100 Yrs</p>
            <p className="text-[11px] font-bold text-[#92400E] mt-1">Permanence Rating</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Registry & Methodology Citation</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
            Methodology: Puro.earth CORC200+ & Verra VM0044 · Auditor: TUV SUD / VVB · Lab Testing: Eurofins (DIN EN 15104)
          </p>
        </div>
      </div>
    </div>
  );

  // 7. Invoicing Tab
  const renderInvoicing = () => (
    <div className="bg-white shadow-sm rounded-2xl border border-[#E2E8F0] overflow-hidden">
      <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
        <div>
          <h3 className="font-bold text-sm text-[#0F172A]">Settlements & Billing Ledger</h3>
          <p className="text-xs text-slate-500">Invoices issued under MOA-2025-{buyer.id}</p>
        </div>
        <span className="text-xs font-mono font-bold text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200">
          Currency: EUR (€)
        </span>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            <th className="p-4">Invoice ID</th>
            <th className="p-4">Billing Period</th>
            <th className="p-4">Description</th>
            <th className="p-4">Total Amount</th>
            <th className="p-4">Payment Status</th>
            <th className="p-4 text-right">PDF Invoice</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2E8F0]">
          {[
            { id: 'INV-2025-01', date: 'Jan 2025', desc: 'Tranche 1 Offtake (180 tCO2e)', amt: `€${(180 * parseInt(buyer.pricePerTonne.replace(/\D/g, '') || 140)).toLocaleString()}`, status: 'Settled' },
            { id: 'INV-2025-02', date: 'Apr 2025', desc: 'Tranche 2 Offtake (200 tCO2e)', amt: `€${(200 * parseInt(buyer.pricePerTonne.replace(/\D/g, '') || 140)).toLocaleString()}`, status: 'Settled' },
            { id: 'INV-2025-03', date: 'Jul 2025', desc: 'Tranche 3 Offtake (140 tCO2e)', amt: `€${(140 * parseInt(buyer.pricePerTonne.replace(/\D/g, '') || 140)).toLocaleString()}`, status: 'Settled' },
            { id: 'INV-2025-04', date: 'Oct 2025', desc: 'Final Pilot Tranche (Settlement)', amt: `€${(100 * parseInt(buyer.pricePerTonne.replace(/\D/g, '') || 140)).toLocaleString()}`, status: 'Due 15 Nov' },
          ].map((inv) => (
            <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-colors">
              <td className="p-4 text-xs font-mono font-bold text-[#0F172A]">{inv.id}</td>
              <td className="p-4 text-xs text-slate-600">{inv.date}</td>
              <td className="p-4 text-xs text-slate-700 font-medium">{inv.desc}</td>
              <td className="p-4 text-xs font-black text-[#0F172A]">{inv.amt}</td>
              <td className="p-4">
                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                  inv.status === 'Settled' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E]'
                }`}>
                  {inv.status}
                </span>
              </td>
              <td className="p-4 text-right">
                <button 
                  onClick={() => showToast(`Downloading Invoice ${inv.id} PDF...`)}
                  className="text-slate-500 hover:text-slate-900 p-1.5 rounded hover:bg-slate-100 cursor-pointer"
                >
                  <Download className="w-4 h-4 inline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0B1914] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center z-50 animate-in fade-in border border-[#10B981]/50">
          <CheckCircle className="w-5 h-5 mr-2.5 text-[#10B981]" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Corporate Certificate Modal */}
      {certificateModalLot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#047857] flex items-center justify-center text-white font-bold">
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Certificate of Carbon Removal</h3>
                  <p className="text-xs text-slate-500">Puro.earth CORC200+ Immutable Registry</p>
                </div>
              </div>
              <button 
                onClick={() => setCertificateModalLot(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 bg-[#F8FAFC] rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Certificate Serial:</span>
                <span className="font-mono font-bold text-slate-900">{certificateModalLot.lotId}-CERT-2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiary Entity:</span>
                <span className="font-bold text-slate-900">{buyer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Volume Sequestered:</span>
                <span className="font-black text-[#047857] text-sm">{certificateModalLot.volume} tCO2e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">EBC Durability Metric:</span>
                <span className="font-mono font-bold text-slate-900">H:Corg ≤ 0.4 (100+ Years)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Producer & Origin:</span>
                <span className="font-medium text-slate-900">Agri-Carbon Unified FPO · Sangrur/Ludhiana</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => {
                  showToast(`Downloaded Certificate for ${certificateModalLot.lotId}`);
                  setCertificateModalLot(null);
                }}
                className="px-4 py-2 bg-[#0B1914] hover:bg-[#132E27] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={14} /> Download Verified PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-[#0B1914] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center shadow-md">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight">Agri-Carbon <span className="text-[#10B981] font-light">Buyer Portal</span></span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-xs text-[#CBD5E1] bg-[#132E27] px-3 py-1.5 rounded-full border border-[#1a3f35]">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
              <span>Command Center Synced</span>
            </div>

            <div className="flex items-center space-x-2.5 pl-4 border-l border-[#1a3f35]">
              <div className="w-8 h-8 bg-[#10B981]/20 border border-[#10B981] rounded-lg flex items-center justify-center text-[#10B981] font-bold text-xs">
                {buyer.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-bold hidden sm:block text-slate-200">{buyer.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {renderTabs()}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'portfolio' && renderPortfolio()}
        {activeTab === 'marketplace' && renderMarketplace()}
        {activeTab === 'mrv' && renderMRV()}
        {activeTab === 'offtake' && renderOfftake()}
        {activeTab === 'esg' && renderESG()}
        {activeTab === 'invoicing' && renderInvoicing()}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-[#64748B]">
          &copy; Kharif 2025 Agri-Carbon Digital Platform · Enterprise Offtake & Verified dMRV Ledger
        </div>
      </footer>
    </div>
  );
}
