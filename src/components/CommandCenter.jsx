import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Flame, 
  Satellite, 
  CreditCard, 
  Briefcase, 
  Wallet, 
  Settings, ExternalLink, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  MapPin, 
  ChevronRight,
  ArrowLeft,
  X,
  BarChart3,
  TrendingUp,
  PieChart
} from 'lucide-react';
import { 
  farmers, 
  kilns, 
  batches, 
  creditLots, 
  clusters, 
  buyers, 
  payouts, 
  alerts, 
  kpis, 
  pipelineSummary, 
  budgetBreakdown, 
  coordinators 
} from '../data/mockDataset.js';

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [farmerSearch, setFarmerSearch] = useState('');
  const [activeClusterFilter, setActiveClusterFilter] = useState(null);
  const [activeSatelliteIndex, setActiveSatelliteIndex] = useState('NBR');
  const [lotSearch, setLotSearch] = useState('');
  const [lotStatusFilter, setLotStatusFilter] = useState('All');
  const [activeBuyer, setActiveBuyer] = useState(null);
  const [payoutSearch, setPayoutSearch] = useState('');
  const [payoutStatusFilter, setPayoutStatusFilter] = useState('All');
  const [payoutPage, setPayoutPage] = useState(1);
  const [financeChartMode, setFinanceChartMode] = useState('waterfall');
  const [hoveredWaterfallStep, setHoveredWaterfallStep] = useState(null);

  const renderDashboard = () => {
    const totalFarmers = (farmers || []).length;
    const totalAcres = (farmers || []).reduce((s, f) => s + f.enrolledAcres, 0);
    const activeKilnCnt = (kilns || []).filter(k => k.status !== 'maintenance').length;
    const totalKilnCnt = (kilns || []).length || 25;
    const stubbleT = (farmers || []).reduce((s, f) => s + f.stubbleCollectedT, 0).toFixed(0);
    const biocharT = (farmers || []).reduce((s, f) => s + f.biocharAppliedT, 0).toFixed(0);
    const totalLots = (creditLots || []).length;
    const vvbLots = (creditLots || []).filter(l => ['minted', 'issued', 'sold', 'retired'].includes(l.status)).length;
    const issuedLots = (creditLots || []).filter(l => ['issued', 'sold', 'retired'].includes(l.status)).length;
    const soldLotsCnt = (creditLots || []).filter(l => l.status === 'sold' || l.status === 'retired').length;
    const totalDisbursedRs = (payouts || []).filter(p => p.status === 'Success').reduce((s, p) => s + p.amount, 0);
    const complianceRate = +(
      ((farmers || []).filter(f => f.zeroBurnConfirmed).length / (totalFarmers || 1)) * 100
    ).toFixed(0);

    return (
      <div className="space-y-6">
        {/* KPI Grid - Responsive for Mobile & Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            { label: 'Farmers', value: `${totalFarmers}`, sub: '1 Unified FPO', tab: 'farmers', c: 'text-[#0F172A]' },
            { label: 'Enrolled Acres', value: `${totalAcres.toLocaleString()} ac`, sub: '5 Regional Clusters', tab: 'farmers', c: 'text-[#0F172A]' },
            { label: 'Unified FPO', value: '1 FPO', sub: '5 Coverage Zones', tab: 'farmers', c: 'text-[#0F172A]' },
            { label: 'Active Kilns', value: `${activeKilnCnt}/${totalKilnCnt}`, sub: '100% Online Telemetry', tab: 'kilns', c: 'text-[#10B981]' },
            { label: 'Stubble Diverted', value: `${stubbleT}t`, sub: '2.5t / acre yield', tab: 'kilns', c: 'text-[#0F172A]' },
            { label: 'Biochar Produced', value: `${biocharT}t`, sub: '28% pyrolytic yield', tab: 'kilns', c: 'text-[#0F172A]' },
            { label: 'Credits Pipeline', value: '2,188 CORCs', sub: `${totalLots} Verified Lots`, tab: 'credits', c: 'text-[#3B82F6]' },
            { label: 'Platform Revenue', value: '₹44.75L', sub: '€140 avg / tCO2e', tab: 'finance', c: 'text-[#10B981]' },
            { label: 'DBT Payouts', value: `₹${(totalDisbursedRs / 10000000).toFixed(3)} Cr`, sub: '₹9,100 / acre rate', tab: 'finance', c: 'text-[#0F172A]' },
            { label: 'Zero-Burn Rate', value: `${complianceRate}%`, sub: 'Sentinel-2 dMRV', tab: 'satellite', c: 'text-[#10B981]' },
          ].map((kpi, i) => (
            <div 
              key={i} 
              onClick={() => setActiveTab(kpi.tab)}
              className="bg-white p-3 sm:p-4 rounded-xl shadow-xs border border-[#CBD5E1] hover:border-[#10B981] hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start">
                <p className="text-[10px] sm:text-xs text-[#64748B] font-bold uppercase truncate">{kpi.label}</p>
                <ChevronRight size={14} className="text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <p className={`text-lg sm:text-xl font-black mt-1 ${kpi.c}`}>{kpi.value}</p>
              <p className="text-[9px] sm:text-[10px] text-[#64748B] mt-0.5 truncate">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 space-y-6">
            {/* Pipeline Funnel - Interactive & Responsive Scroll */}
            <div className="bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-[#CBD5E1]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] uppercase">End-to-End dMRV Pipeline Funnel</h3>
                <span className="text-[11px] text-[#64748B]">Click step to inspect</span>
              </div>
              <div className="overflow-x-auto no-scrollbar flex items-center text-xs space-x-2 pt-2 min-w-full pb-1">
                {[
                  { label: 'Enrolled Acres', val: `${totalAcres} ac`, w: 'w-full', c: 'bg-[#0B1914]', tab: 'farmers' },
                  { label: 'Stubble Collected', val: `${stubbleT}t`, w: 'w-[92%]', c: 'bg-[#132E27]', tab: 'kilns' },
                  { label: 'Biochar Produced', val: `${biocharT}t`, w: 'w-[84%]', c: 'bg-[#1a3f35]', tab: 'kilns' },
                  { label: 'Lab Passed', val: '875t (H:C≤0.4)', w: 'w-[76%]', c: 'bg-[#047857]', tab: 'kilns' },
                  { label: 'Lots Aggregated', val: `${totalLots} Lots`, w: 'w-[64%]', c: 'bg-[#059669]', tab: 'credits' },
                  { label: 'VVB Verified', val: `${vvbLots} Lots`, w: 'w-[52%]', c: 'bg-[#10B981]', tab: 'credits' },
                  { label: 'Registry Issued', val: `${issuedLots} Lots`, w: 'w-[40%]', c: 'bg-[#34D399]', tab: 'credits' },
                  { label: 'Sold & Delivered', val: `${soldLotsCnt} Lots`, w: 'w-[30%]', c: 'bg-[#6EE7B7]', tab: 'buyers' },
                ].map((stage, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveTab(stage.tab)}
                    className="flex-1 flex flex-col items-center cursor-pointer group"
                  >
                    <div className={`${stage.w} h-9 ${stage.c} rounded-t transition-all group-hover:brightness-125 shadow-sm`} title={stage.label}></div>
                    <div className="text-[10px] text-center mt-2 font-semibold text-[#334155] leading-tight group-hover:text-[#10B981]">{stage.label}</div>
                    <div className="text-[10px] font-bold text-[#0F172A] mt-0.5">{stage.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Clusters & Satellite Map */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-[#CBD5E1] relative overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] uppercase">Regional Clusters & Operational Footprint</h3>
                  <p className="text-xs text-[#64748B]">Unified FPO coverage across 5 strategic Punjab/Haryana hubs</p>
                </div>
                <button 
                  onClick={() => setActiveTab('satellite')}
                  className="text-xs text-blue-600 hover:underline flex items-center font-medium"
                >
                  Open Satellite Monitor <ExternalLink size={11} className="ml-1" />
                </button>
              </div>
              
              <div className="h-56 rounded-lg relative overflow-hidden border border-[#CBD5E1] shadow-inner bg-[#0B1914]">
                <img 
                  src="/pre_harvest.jpg" 
                  alt="Satellite Footprint" 
                  className="w-full h-full object-cover opacity-60 mix-blend-luminosity" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1914]/80 via-transparent to-black/30"></div>
                
                {/* Interactive Cluster Markers */}
                {[
                  { name: 'Sangrur', top: '28%', left: '22%', farmers: 100, acres: 250 },
                  { name: 'Ludhiana', top: '22%', left: '46%', farmers: 100, acres: 250 },
                  { name: 'Patiala', top: '48%', left: '38%', farmers: 100, acres: 250 },
                  { name: 'Kaithal', top: '65%', left: '62%', farmers: 100, acres: 250 },
                  { name: 'Karnal', top: '72%', left: '78%', farmers: 100, acres: 250 },
                ].map((c, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      setActiveTab('farmers');
                      setActiveClusterFilter(c.name);
                    }}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                    style={{ top: c.top, left: c.left }}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="w-4 h-4 bg-[#10B981] rounded-full animate-ping opacity-75 absolute"></div>
                      <div className="w-3 h-3 bg-[#10B981] border-2 border-white rounded-full relative z-10 shadow"></div>
                    </div>
                    <div className="bg-[#0F172A]/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold mt-1 shadow border border-white/20 whitespace-nowrap group-hover:bg-[#10B981] transition-colors">
                      {c.name} ({c.farmers}f)
                    </div>
                  </div>
                ))}

                <div className="absolute bottom-2 left-3 text-[10px] text-white/80 font-mono">
                  Sentinel-2 High-Res Surface Map • 1,250 Enrolled Acres
                </div>
              </div>
            </div>
          </div>

          {/* Live Alerts Feed - Dynamic & Actionable */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-[#CBD5E1] flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-[#0F172A] uppercase flex items-center">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
                  Live Platform Alerts
                </h3>
                <span className="text-[10px] text-[#64748B] font-mono">Real-time Feed</span>
              </div>
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[500px] pr-1">
                {(alerts || []).map((alert, i) => {
                  const borderColors = {
                    error: 'border-l-[#EF4444] bg-red-50/40',
                    warning: 'border-l-[#F59E0B] bg-amber-50/40',
                    success: 'border-l-[#10B981] bg-emerald-50/40',
                    info: 'border-l-[#3B82F6] bg-blue-50/40',
                  };
                  const icons = {
                    error: AlertTriangle,
                    warning: AlertCircle,
                    success: CheckCircle,
                    info: Info,
                  };
                  const Icon = icons[alert.type] || Info;
                  const iconColors = {
                    error: 'text-[#EF4444]',
                    warning: 'text-[#F59E0B]',
                    success: 'text-[#10B981]',
                    info: 'text-[#3B82F6]',
                  };

                  return (
                    <div 
                      key={i} 
                      onClick={() => alert.targetTab && setActiveTab(alert.targetTab)}
                      className={`p-3 border border-[#CBD5E1] border-l-4 ${borderColors[alert.type] || 'border-l-[#64748B]'} rounded shadow-sm text-sm flex items-start space-x-2.5 hover:shadow-md hover:border-[#10B981] transition-all cursor-pointer group`}
                    >
                      <Icon size={16} className={`mt-0.5 shrink-0 ${iconColors[alert.type]}`} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-white border border-[#CBD5E1] text-[#334155]">
                            {alert.targetTab || 'system'}
                          </span>
                          <span className="text-[10px] text-[#64748B] font-mono">{alert.time}</span>
                        </div>
                        <p className="font-medium text-xs text-[#0F172A] leading-snug group-hover:text-[#10B981] transition-colors">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFarmers = () => {
    let filteredFarmers = farmers || [];
    if (activeClusterFilter) {
      filteredFarmers = filteredFarmers.filter(f => f.cluster === activeClusterFilter);
    }
    if (farmerSearch) {
      filteredFarmers = filteredFarmers.filter(f => f.name?.toLowerCase().includes(farmerSearch.toLowerCase()) || f.id?.toLowerCase().includes(farmerSearch.toLowerCase()));
    }
    const displayedFarmers = filteredFarmers.slice(0, 20);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 text-[#64748B]" size={18} />
            <input 
              type="text" 
              placeholder="Search farmers by name or ID..." 
              value={farmerSearch}
              onChange={(e) => setFarmerSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#10B981] bg-white text-sm"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-[#64748B]">Showing {displayedFarmers.length} of {filteredFarmers.length} farmers</span>
            {activeClusterFilter && (
              <button 
                onClick={() => setActiveClusterFilter(null)}
                className="flex items-center px-3 py-1.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded text-xs font-medium text-[#DC2626] hover:bg-[#FEE2E2]"
              >
                Clear Area Filter
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#CBD5E1] overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#64748B] uppercase bg-[#F8FAFC] border-b border-[#CBD5E1]">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Area</th>
                <th className="px-6 py-3">Village</th>
                <th className="px-6 py-3">Acres</th>
                <th className="px-6 py-3">Bank Linked</th>
                <th className="px-6 py-3">Zero-Burn</th>
                <th className="px-6 py-3">Payout</th>
              </tr>
            </thead>
            <tbody>
              {displayedFarmers.length > 0 ? displayedFarmers.map((f, i) => (
                <tr key={i} className="border-b border-[#CBD5E1] hover:bg-[#F0FDF4]">
                  <td className="px-6 py-4 font-mono text-[#0F172A]">{f.id}</td>
                  <td className="px-6 py-4 font-medium text-[#0F172A]">{f.name}</td>
                  <td className="px-6 py-4 text-[#334155] font-semibold">{f.cluster}</td>
                  <td className="px-6 py-4 text-[#334155]">{f.village}</td>
                  <td className="px-6 py-4 text-[#334155]">{f.enrolledAcres}</td>
                  <td className="px-6 py-4">
                    {f.bankLinked ? <CheckCircle size={16} className="text-[#10B981]" /> : <AlertCircle size={16} className="text-[#EF4444]" />}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${f.zeroBurnConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {f.zeroBurnConfirmed ? 'Confirmed' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#334155]">{f.payoutStatus}</td>
                </tr>
              )) : (
                <tr><td colSpan="8" className="px-6 py-8 text-center text-[#64748B]">No farmers found matching your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-bold text-[#0F172A] uppercase pt-4">Operating Areas (Click to Filter)</h3>
        <div className="grid grid-cols-5 gap-4">
          {(clusters || []).map((clusterObj, i) => {
            const isActive = activeClusterFilter === clusterObj.name;
            return (
            <div 
              key={i} 
              onClick={() => setActiveClusterFilter(isActive ? null : clusterObj.name)}
              className={`p-4 rounded-lg shadow-sm border cursor-pointer transition-all ${isActive ? 'bg-[#F0FDF4] border-[#10B981] ring-1 ring-[#10B981]' : 'bg-white border-[#CBD5E1] hover:border-[#10B981]'}`}
            >
              <h4 className="font-bold text-[#0F172A] text-sm truncate" title={clusterObj.name}>{clusterObj.name}</h4>
              <p className="text-xs text-[#64748B] mt-1">{clusterObj.cluster || clusterObj.name}</p>
              <div className="mt-3 text-sm flex justify-between">
                <span className="text-[#64748B]">Members:</span>
                <span className="font-medium">{clusterObj.memberCount}</span>
              </div>
              <div className="mt-1 text-sm flex justify-between">
                <span className="text-[#64748B]">Acres:</span>
                <span className="font-medium">{clusterObj.totalAcres}</span>
              </div>
              <div className="mt-3 flex items-center text-xs">
                <span className={`px-2 py-0.5 rounded-full font-medium ${clusterObj.status === 'Active' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E]'}`}>
                  Active Area
                </span>
                <span className="ml-auto text-[#10B981] font-bold text-[10px] border border-[#10B981] px-1 rounded">Climate Smart</span>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    );
  }

  const renderKilnFleet = () => {
    const defaultKilns = Array.from({length: 25}).map((_,i) => ({
      id: `K-${String(i+1).padStart(2,'0')}`,
      cluster: ['Sangrur', 'Ludhiana', 'Karnal'][i % 3],
      status: ['idle', 'feeding', 'pyrolysis', 'quenching', 'complete'][Math.floor(Math.random()*5)],
      batches: Math.floor(Math.random()*20) + 5,
      output: (Math.random()*50 + 10).toFixed(1)
    }));
    
    const displayKilns = (kilns?.length ? kilns : defaultKilns).map(k => {
      const kilnBatches = batches.filter(b => b.kilnId === k.id);
      const totalOutputKg = kilnBatches.reduce((sum, b) => sum + (b.outputWeightKg || 0), 0);
      return {
        ...k,
        batches: k.batchesCompleted || kilnBatches.length || k.batches,
        output: totalOutputKg > 0 ? (totalOutputKg / 1000).toFixed(1) : (k.output || "0.0"),
        // Mock a real-time operational status for active kilns
        status: k.status === 'Maintenance' ? 'idle' : ['idle', 'feeding', 'pyrolysis', 'quenching', 'complete'][Math.floor(Math.random()*5)]
      };
    });
    
    const statusColors = {
      idle: 'bg-[#64748B]',
      feeding: 'bg-[#F59E0B]',
      pyrolysis: 'bg-[#EF4444]',
      quenching: 'bg-[#3B82F6]',
      complete: 'bg-[#10B981]'
    };

    return (
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-[#0F172A] uppercase">Active Fleet</h3>
        <div className="grid grid-cols-5 gap-4">
          {displayKilns.map((k, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-[#CBD5E1] flex flex-col relative">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-mono font-bold text-[#0F172A]">{k.id}</span>
                  <p className="text-xs text-[#64748B]">{k.cluster}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${statusColors[k.status]}`} title={k.status}></div>
              </div>
              <div className="mt-auto pt-3 border-t border-[#F8FAFC]">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#64748B]">Batches:</span>
                  <span className="font-medium text-[#0F172A]">{k.batches}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748B]">Output (t):</span>
                  <span className="font-medium text-[#0F172A]">{k.output}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-bold text-[#0F172A] uppercase pt-4">20-Day Batch Calendar</h3>
        <div className="bg-white rounded-lg border border-[#CBD5E1] overflow-x-auto shadow-sm p-4">
          <div className="min-w-[800px]">
            <div className="flex text-xs text-[#64748B] border-b border-[#CBD5E1] pb-2">
              <div className="w-16 font-medium">Kiln ID</div>
              {Array.from({length: 20}).map((_,i) => (
                <div key={i} className="flex-1 text-center font-medium">{i+1}</div>
              ))}
            </div>
            <div className="space-y-1 mt-2">
              {displayKilns.slice(0, 10).map((k, i) => {
                const idNum = parseInt(k.id.replace(/\D/g, '') || i);
                
                // Deterministically distribute completed batches over the first 19 days
                const pastDays = Array(19).fill(false);
                const batchesToPlace = Math.min(k.batches, 19);
                
                if (batchesToPlace > 0) {
                  const step = 19 / batchesToPlace;
                  for (let b = 0; b < batchesToPlace; b++) {
                    let targetIdx = Math.floor(b * step + (idNum % 2)); // some deterministic jitter
                    if (targetIdx > 18) targetIdx = 18;
                    // Find nearest empty slot to avoid collisions
                    let placed = false;
                    for (let search = 0; search < 19; search++) {
                      let tryIdx = (targetIdx + search) % 19;
                      if (!pastDays[tryIdx]) {
                        pastDays[tryIdx] = true;
                        placed = true;
                        break;
                      }
                    }
                  }
                }

                return (
                <div key={i} className="flex text-xs items-center h-6">
                  <div className="w-16 font-mono font-medium text-[#0F172A]">{k.id}</div>
                  {Array.from({length: 20}).map((_, day) => {
                    const isToday = day === 19;
                    let blockClass = "h-4 rounded-sm bg-[#F8FAFC] border border-[#CBD5E1]";
                    
                    if (isToday) {
                      // Day 20 shows the actual live current status
                      blockClass = `h-4 rounded-sm ${statusColors[k.status]} shadow-sm ${k.status !== 'idle' ? 'animate-pulse opacity-90' : 'opacity-80'}`;
                    } else if (pastDays[day]) {
                      // Past days can only be Complete (Green) or Idle (Gray outline)
                      blockClass = `h-4 rounded-sm ${statusColors['complete']} opacity-80`;
                    }

                    return (
                      <div key={day} className="flex-1 px-0.5">
                        <div className={blockClass} title={isToday ? `Today: ${k.status}` : (pastDays[day] ? 'Completed Batch' : 'Idle')}></div>
                      </div>
                    );
                  })}
                </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <span className="text-xs font-bold text-[#0F172A] uppercase mr-2">Status Legend:</span>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div><span className="text-xs text-[#64748B]">Feeding (Loading)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#EF4444]"></div><span className="text-xs text-[#64748B]">Pyrolysis (Burning)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div><span className="text-xs text-[#64748B]">Quenching (Cooling)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#10B981]"></div><span className="text-xs text-[#64748B]">Complete (Ready)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#64748B]"></div><span className="text-xs text-[#64748B]">Idle / Maint</span></div>
        </div>
      </div>
    );
  }

  const renderSatellite = () => {
    const descriptions = {
      NDVI: "Normalized Difference Vegetation Index. Measures general vegetation health. Bright green indicates dense, healthy crops (Pre-harvest). Red indicates bare soil (Post-harvest).",
      NBR: "Normalized Burn Ratio. Detects fire signatures. Burned scars appear dark black. The Post-harvest image shows natural soil colors, confirming Zero-Burn compliance.",
      NDRE: "Normalized Difference Red Edge. Highly sensitive to chlorophyll content. Blue/Cyan indicates high chlorophyll (Pre-harvest), while Orange indicates low chlorophyll (Post-harvest)."
    };

    let preVisuals = null;
    let postVisuals = null;
    
    if (activeSatelliteIndex === 'NDVI') {
      preVisuals = <div className="absolute inset-0 bg-gradient-to-tr from-[#16a34a] to-[#a3e635] opacity-60 mix-blend-color"></div>;
      postVisuals = <div className="absolute inset-0 bg-gradient-to-br from-[#ef4444] to-[#f97316] opacity-60 mix-blend-color"></div>;
    } else if (activeSatelliteIndex === 'NDRE') {
      preVisuals = <div className="absolute inset-0 bg-gradient-to-tr from-[#0284c7] to-[#2dd4bf] opacity-60 mix-blend-color"></div>;
      postVisuals = <div className="absolute inset-0 bg-gradient-to-br from-[#ea580c] to-[#fcd34d] opacity-60 mix-blend-color"></div>;
    } else {
      // NBR
      preVisuals = <div className="absolute inset-0 bg-[#84cc16] opacity-20 mix-blend-color"></div>;
      postVisuals = <div className="absolute inset-0 bg-[#d97706] opacity-20 mix-blend-color"></div>;
    }

    return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {['NDVI', 'NBR', 'NDRE'].map((idx, i) => (
            <button 
              key={i} 
              onClick={() => setActiveSatelliteIndex(idx)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeSatelliteIndex === idx ? 'bg-[#0B1914] text-white shadow' : 'bg-white text-[#334155] border border-[#CBD5E1] hover:bg-[#F8FAFC]'}`}>
              {idx} Index
            </button>
          ))}
        </div>
        <div className="bg-[#E0F2FE] text-[#0369A1] px-4 py-2 rounded-lg text-sm font-bold flex items-center">
          <Satellite size={16} className="mr-2" />
          Next Sentinel-2 Pass: 2 Days
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-lg border border-[#CBD5E1] shadow-sm p-4 h-96 flex flex-col">
          <h3 className="text-sm font-bold text-[#0F172A] uppercase mb-2">Before / After Comparison ({activeSatelliteIndex})</h3>
          <p className="text-xs text-[#64748B] mb-4 min-h-[32px]">{descriptions[activeSatelliteIndex]}</p>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="relative rounded-lg border border-[#CBD5E1] overflow-hidden bg-[#F0FDF4]">
              <div className="absolute inset-0 bg-[url('/pre_harvest.jpg')] bg-cover bg-center"></div>
              {preVisuals}
              <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-[#0F172A] shadow z-10">Pre-Harvest (Oct 1)</div>
            </div>
            <div className="relative rounded-lg border border-[#CBD5E1] overflow-hidden bg-[#F8FAFC]">
              <div className="absolute inset-0 bg-[url('/post_harvest.jpg')] bg-cover bg-center"></div>
              {postVisuals}
              <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-[#0F172A] shadow z-10">Post-Harvest (Oct 15)</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#CBD5E1] shadow-sm p-5 flex flex-col items-center justify-between">
          <h3 className="text-sm font-bold text-[#0F172A] uppercase mb-2 w-full text-left">Sentinel-2 Compliance</h3>
          <div className="relative w-44 h-44 flex items-center justify-center my-2">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="10" />
              <circle 
                cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="10" 
                strokeDasharray="251.2" 
                strokeDashoffset={251.2 * (1 - kpis.complianceRatePct / 100)} 
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-[#0F172A]">{kpis.complianceRatePct}%</span>
              <span className="text-[10px] text-[#64748B] font-bold mt-0.5 text-center">Zero-Burn<br/>Verified</span>
            </div>
          </div>
          <div className="w-full space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Verified Clear:</span>
              <span className="font-bold text-[#047857]">{farmers.filter(f => f.zeroBurnStatus === 'verified').length} plots (1,178 ac)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> In-Process Scan:</span>
              <span className="font-bold text-amber-600">{farmers.filter(f => f.zeroBurnStatus === 'in_process').length} plots (58 ac)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Flagged Anomaly:</span>
              <span className="font-bold text-red-600">{farmers.filter(f => f.zeroBurnStatus === 'flagged').length} plots (14 ac)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const renderCarbonCredits = () => {
    // Calculate dynamic stats from actual data
    const lots = creditLots || [];
    const stats = { pending: 0, minted: 0, issued: 0, sold: 0, retired: 0 };
    lots.forEach(lot => {
      if (stats[lot.status] !== undefined) {
        stats[lot.status] += lot.volume;
      }
    });

    // Apply filters
    let filteredLots = lots;
    if (lotStatusFilter !== 'All') {
      filteredLots = filteredLots.filter(l => l.status === lotStatusFilter.toLowerCase());
    }
    if (lotSearch) {
      filteredLots = filteredLots.filter(l => 
        l.lotId?.toLowerCase().includes(lotSearch.toLowerCase()) || 
        l.registry?.toLowerCase().includes(lotSearch.toLowerCase()) ||
        l.buyerName?.toLowerCase().includes(lotSearch.toLowerCase())
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: 'Pending', val: stats.pending, c: 'text-[#F59E0B]' },
            { label: 'Minted', val: stats.minted, c: 'text-[#3B82F6]' },
            { label: 'Issued', val: stats.issued, c: 'text-[#10B981]' },
            { label: 'Sold', val: stats.sold, c: 'text-[#0B1914]' },
            { label: 'Retired', val: stats.retired, c: 'text-[#64748B]' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-[#CBD5E1] flex flex-col items-center">
              <p className="text-xs text-[#64748B] font-semibold uppercase">{s.label}</p>
              <p className={`text-2xl font-bold mt-2 ${s.c}`}>{s.val}t</p>
            </div>
          ))}
        </div>

        {/* Cross-navigation bar if arriving from buyers or with active search */}
        <div className="flex justify-between items-center bg-[#F8FAFC] p-3 rounded-lg border border-[#CBD5E1]">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setActiveTab('buyers')}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#CBD5E1] hover:bg-[#F0FDF4] hover:border-[#10B981] text-[#0F172A] text-xs font-bold rounded shadow-sm transition-all"
            >
              <ArrowLeft size={14} className="text-[#10B981]" />
              <span>Back to Buyers Section</span>
            </button>
            {(lotSearch || lotStatusFilter !== 'All') && (
              <span className="text-xs text-[#64748B] flex items-center space-x-1 bg-white px-2.5 py-1 rounded border border-[#E2E8F0]">
                <span>Filtered by:</span>
                {lotSearch && <span className="font-bold text-[#0F172A]">"{lotSearch}"</span>}
                {lotStatusFilter !== 'All' && <span className="font-bold text-[#10B981]">Status: {lotStatusFilter}</span>}
              </span>
            )}
          </div>
          {(lotSearch || lotStatusFilter !== 'All') && (
            <button 
              onClick={() => {
                setLotSearch('');
                setLotStatusFilter('All');
              }}
              className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50 transition-all"
            >
              <X size={14} />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg border border-[#CBD5E1] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#CBD5E1] bg-[#F8FAFC] flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] uppercase">Credit Lots Directory</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Showing {filteredLots.length} of {lots.length} total lots</p>
            </div>
            <div className="flex space-x-4">
              <div className="relative w-72">
                <Search className="absolute left-3 top-2.5 text-[#64748B]" size={16} />
                <input 
                  type="text" 
                  placeholder="Search by Lot ID, Buyer, Registry..." 
                  value={lotSearch}
                  onChange={(e) => setLotSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 border border-[#CBD5E1] rounded text-sm focus:outline-none focus:border-[#10B981] bg-white"
                />
                {lotSearch && (
                  <button 
                    onClick={() => setLotSearch('')}
                    className="absolute right-2.5 top-2.5 text-[#94A3B8] hover:text-[#0F172A]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <select 
                value={lotStatusFilter}
                onChange={(e) => setLotStatusFilter(e.target.value)}
                className="py-1.5 px-3 border border-[#CBD5E1] rounded text-sm text-[#334155] focus:outline-none focus:border-[#10B981] bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Minted">Minted</option>
                <option value="Issued">Issued</option>
                <option value="Sold">Sold</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#64748B] uppercase bg-[#F8FAFC] border-b border-[#CBD5E1]">
              <tr>
                <th className="px-6 py-3">Lot ID</th>
                <th className="px-6 py-3">Registry</th>
                <th className="px-6 py-3">Volume (tCO2e)</th>
                <th className="px-6 py-3">Vintage</th>
                <th className="px-6 py-3">Batches</th>
                <th className="px-6 py-3">Buyer / Offtake</th>
                <th className="px-6 py-3">Est/Realized Price</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLots.length > 0 ? filteredLots.map((lot, i) => (
                <tr key={i} className="border-b border-[#CBD5E1] hover:bg-[#F0FDF4]">
                  <td className="px-6 py-4 font-mono font-medium text-[#0F172A]">{lot.lotId}</td>
                  <td className="px-6 py-4 text-[#334155]">{lot.registry}</td>
                  <td className="px-6 py-4 font-medium text-[#0F172A]">{lot.volume}</td>
                  <td className="px-6 py-4 text-[#334155]">{lot.vintage}</td>
                  <td className="px-6 py-4 text-[#334155]">{lot.batchIds ? lot.batchIds.length : 0}</td>
                  <td className="px-6 py-4">
                    {lot.buyerName ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#E0F2FE] text-[#0369A1]">
                        {lot.buyerName}
                      </span>
                    ) : (
                      <span className="text-xs text-[#94A3B8] italic">Unallocated</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[#10B981] font-medium">{lot.indicativePrice || lot.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize 
                      ${lot.status === 'issued' ? 'bg-green-100 text-green-800' : 
                        lot.status === 'sold' ? 'bg-slate-800 text-white' : 
                        lot.status === 'retired' ? 'bg-slate-200 text-slate-800' : 
                        lot.status === 'minted' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {lot.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-[#64748B]">No credit lots found matching your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderBuyers = () => {
    const displayBuyers = buyers || [];

    return (
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-[#0F172A] uppercase">Corporate Buyers</h3>
        <div className="grid grid-cols-4 gap-4">
          {displayBuyers.map((b, i) => {
            const percent = (b.deliveredVolume / b.contractedVolume) * 100;
            const isActive = activeBuyer?.id === b.id;
            const buyerLots = (creditLots || []).filter(l => l.buyerId === b.id);
            return (
              <div 
                key={i} 
                onClick={() => setActiveBuyer(isActive ? null : b)}
                className={`p-5 rounded-lg shadow-sm border cursor-pointer transition-all ${isActive ? 'bg-[#F0FDF4] border-[#10B981] ring-1 ring-[#10B981]' : 'bg-white border-[#CBD5E1] hover:border-[#10B981]'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] truncate" title={b.name}>{b.name}</h3>
                    <p className="text-xs text-[#64748B] mt-1">Price: <span className="font-medium text-[#10B981]">{b.pricePerTonne}</span></p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-[#334155]">Allocated</span>
                    <span className="text-[#0F172A] font-bold">{buyerLots.reduce((acc, l) => acc + l.volume, 0)}t ({buyerLots.length} lots)</span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                    <div className="bg-[#10B981] h-full rounded-full" style={{ width: `${Math.min(100, percent)}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {activeBuyer ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#CBD5E1] mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-[#F8FAFC] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">{activeBuyer.name} — Tracking & Registry Linkage</h3>
                <p className="text-sm text-[#64748B]">Contract ID: {activeBuyer.id} • Next Delivery: <span className="font-medium text-[#0F172A]">{activeBuyer.nextDeliveryDate}</span> • Term: {activeBuyer.term}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-md text-xs font-bold ${activeBuyer.status === 'Active' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E]'}`}>
                {activeBuyer.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-[#0F172A] uppercase">Allocated Credit Lots in Registry</h4>
                  <span className="text-xs text-[#64748B]">Click lot to jump to Carbon Credits</span>
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                  {(() => {
                    const buyerLots = (creditLots || []).filter(l => l.buyerId === activeBuyer.id);
                    if (buyerLots.length === 0) {
                      return <p className="text-xs text-[#64748B] italic">No lots currently allocated to this buyer.</p>;
                    }
                    return buyerLots.map((lot, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => {
                          setActiveTab('credits');
                          setLotSearch(lot.lotId);
                          setLotStatusFilter('All');
                        }}
                        className="p-3 border border-[#CBD5E1] rounded-lg bg-[#F8FAFC] hover:bg-[#F0FDF4] hover:border-[#10B981] cursor-pointer transition-all flex justify-between items-center"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-mono text-sm font-bold text-[#0F172A]">{lot.lotId}</p>
                            <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-[#0F172A] text-white">{lot.status}</span>
                          </div>
                          <p className="text-xs text-[#64748B] mt-1">{lot.registry} • Vintage {lot.vintage} • {lot.batchIds ? lot.batchIds.length : 0} batches</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#10B981] text-base">{lot.volume} tCO2e</p>
                          <span className="text-[11px] text-blue-600 font-medium flex items-center justify-end mt-1 hover:underline">
                            Inspect in Registry <ExternalLink size={11} className="ml-1"/>
                          </span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A] uppercase mb-4">Delivery Timeline & Offtake</h4>
                <div className="relative border-l-2 border-[#CBD5E1] ml-3 space-y-6">
                  <div className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-[#10B981] rounded-full -left-[7px] top-1 border-2 border-white"></div>
                    <p className="text-xs text-[#64748B] font-bold">Today (Delivered)</p>
                    <p className="text-sm text-[#0F172A] mt-1 font-medium">{activeBuyer.deliveredVolume}t Delivered to {activeBuyer.name}</p>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-[#F59E0B] rounded-full -left-[7px] top-1 border-2 border-white animate-pulse"></div>
                    <p className="text-xs text-[#64748B] font-bold">{activeBuyer.nextDeliveryDate}</p>
                    <p className="text-sm text-[#0F172A] mt-1 font-medium">Scheduled Batch Delivery ({activeBuyer.contractedVolume - activeBuyer.deliveredVolume}t remaining)</p>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-[#CBD5E1] rounded-full -left-[7px] top-1 border-2 border-white"></div>
                    <p className="text-xs text-[#64748B] font-bold">Contract End ({activeBuyer.term})</p>
                    <p className="text-sm text-[#0F172A] mt-1 font-medium">Full Fulfillment of {activeBuyer.contractedVolume}t</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#F8FAFC] border border-[#CBD5E1] border-dashed rounded-lg p-8 text-center mt-6">
            <Briefcase size={32} className="mx-auto text-[#94A3B8] mb-3" />
            <p className="text-sm font-medium text-[#334155]">Select a buyer to view tracking, registry allocations & provenance details</p>
          </div>
        )}
      </div>
    );
  };


  const renderPayouts = () => {
    // Filter payouts
    let filteredPayouts = payouts || [];
    if (payoutStatusFilter !== 'All') {
      filteredPayouts = filteredPayouts.filter(p => p.status.toLowerCase() === payoutStatusFilter.toLowerCase());
    }
    if (payoutSearch) {
      const q = payoutSearch.toLowerCase();
      filteredPayouts = filteredPayouts.filter(p => 
        p.farmerId.toLowerCase().includes(q) ||
        p.farmerName.toLowerCase().includes(q) ||
        p.cluster.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        (p.pfmsRef && p.pfmsRef.toLowerCase().includes(q))
      );
    }

    const itemsPerPage = 20;
    const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage) || 1;
    const currentPage = Math.min(payoutPage, totalPages);
    const displayedPayouts = filteredPayouts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalDisbursedRs = (payouts || []).filter(p => p.status === 'Success').reduce((s, p) => s + p.amount, 0);
    const totalProcessingRs = (payouts || []).filter(p => p.status === 'Processing').reduce((s, p) => s + p.amount, 0);

    return (
      <div className="space-y-6">
        {/* Top Financial KPI Strip */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: 'Pilot Farmer Payout Pool', val: '₹1.138 Cr', sub: '1,250 ac @ ₹9,100/ac', c: 'text-[#10B981]' },
            { label: 'Total Disbursed (PFMS)', val: `₹${(totalDisbursedRs / 10000000).toFixed(3)} Cr`, sub: `${(payouts || []).filter(p => p.status === 'Success').length}/500 Farmers Paid`, c: 'text-[#0F172A]' },
            { label: 'Pending Disbursement', val: `₹${(totalProcessingRs / 100000).toFixed(2)} L`, sub: `${(payouts || []).filter(p => p.status === 'Processing').length} in PFMS Pipeline`, c: 'text-[#F59E0B]' },
            { label: 'Platform Gross Revenue', val: '₹44.75 L', sub: 'Carbon & Tech Fee', c: 'text-[#3B82F6]' },
            { label: 'Net Operating Margin', val: '₹15.00 L', sub: '33.5% Pilot Net Margin', c: 'text-[#10B981]' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-[#CBD5E1]">
              <p className="text-xs text-[#64748B] font-semibold uppercase">{kpi.label}</p>
              <p className={`text-2xl font-bold mt-1 ${kpi.c}`}>{kpi.val}</p>
              <p className="text-[11px] text-[#64748B] mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Financial Graph Card */}
          <div className="col-span-2 bg-white p-5 rounded-lg shadow-sm border border-[#CBD5E1]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] uppercase flex items-center space-x-2">
                  <TrendingUp size={16} className="text-[#10B981]" />
                  <span>Pilot Financial Model & P&L Waterfall</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">Comprehensive cost bridge for 500-farmer / 2,188 CORC pilot</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-[#F1F5F9] p-0.5 rounded-lg flex text-xs font-semibold">
                  <button
                    onClick={() => setFinanceChartMode('waterfall')}
                    className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1 ${
                      financeChartMode === 'waterfall'
                        ? 'bg-white text-[#0F172A] shadow-sm font-bold'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <BarChart3 size={13} />
                    <span>Waterfall Bridge</span>
                  </button>
                  <button
                    onClick={() => setFinanceChartMode('unit_econ')}
                    className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1 ${
                      financeChartMode === 'unit_econ'
                        ? 'bg-white text-[#0F172A] shadow-sm font-bold'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <PieChart size={13} />
                    <span>Unit Economics</span>
                  </button>
                </div>
              </div>
            </div>

            {financeChartMode === 'waterfall' ? (
              <div>
                {/* Visual Waterfall Graph with High-Visibility Numerical Badges */}
                <div className="relative h-80 border-b border-slate-200 mt-4 pt-12 pb-3 px-2 flex items-end justify-between bg-gradient-to-b from-[#F8FAFC] to-white rounded-xl">
                  {/* Background Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50 px-3 py-4">
                    {[50, 40, 30, 20, 10, 0].map((val, idx) => (
                      <div key={idx} className="border-b border-dashed border-slate-300 w-full flex justify-between">
                        <span className="text-[10px] text-slate-400 font-mono font-bold -mt-3">₹{val}L</span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold -mt-3">₹{val}L</span>
                      </div>
                    ))}
                  </div>

                  {/* Waterfall Bars */}
                  {[
                    { label: 'Gross Revenue', start: 0, end: 44.75, delta: 44.75, type: 'start', col: 'bg-[#047857]', note: '2,188 CORCs @ €140 (~₹2,045/t)' },
                    { label: 'Field Ops', start: 36.25, end: 44.75, delta: -8.50, type: 'sub', col: 'bg-[#DC2626]', note: 'Farmer mobilization, collection & transport' },
                    { label: 'Kilns Capex/Ops', start: 29.25, end: 36.25, delta: -7.00, type: 'sub', col: 'bg-[#EF4444]', note: '25 kilns setup, operation & repairs' },
                    { label: 'dMRV Tech', start: 24.00, end: 29.25, delta: -5.25, type: 'sub', col: 'bg-[#F87171]', note: 'Sentinel-2 imagery & pipeline verification' },
                    { label: 'Registry & Lab', start: 19.50, end: 24.00, delta: -4.50, type: 'sub', col: 'bg-[#F87171]', note: 'Eurofins H:Corg & Puro auditing' },
                    { label: 'Training', start: 17.00, end: 19.50, delta: -2.50, type: 'sub', col: 'bg-[#FCA5A5]', note: 'FPO workshops & farmer digital literacy' },
                    { label: 'Overhead', start: 15.00, end: 17.00, delta: -2.00, type: 'sub', col: 'bg-[#FCA5A5]', note: 'Legal, cloud hosting & contingency' },
                    { label: 'Net Profit', start: 0, end: 15.00, delta: 15.00, type: 'end', col: 'bg-[#0B1914]', note: '33.5% Pilot Net Margin retained' },
                  ].map((step, idx) => {
                    const maxScale = 52;
                    const bottomPct = (step.start / maxScale) * 100;
                    const heightPct = (Math.abs(step.delta) / maxScale) * 100;
                    const isHovered = hoveredWaterfallStep === idx;

                    return (
                      <div 
                        key={idx}
                        onMouseEnter={() => setHoveredWaterfallStep(idx)}
                        onMouseLeave={() => setHoveredWaterfallStep(null)}
                        className="relative flex-1 flex flex-col items-center h-full justify-end group z-10 px-1"
                      >
                        {/* Hover Tooltip */}
                        {isHovered && (
                          <div className="absolute -top-14 z-30 bg-[#0F172A] text-white text-[11px] px-3 py-2 rounded-xl shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 border border-slate-700">
                            <p className="font-black text-[#10B981]">{step.label}: {step.delta > 0 ? `+₹${step.delta.toFixed(2)}L` : `-₹${Math.abs(step.delta).toFixed(2)}L`}</p>
                            <p className="text-[10px] text-slate-300 mt-0.5">{step.note}</p>
                          </div>
                        )}

                        {/* Highly Visible Value Badge Above Bar */}
                        <div 
                          className="absolute whitespace-nowrap transition-all z-20"
                          style={{ bottom: `calc(${bottomPct + heightPct}% + 6px)` }}
                        >
                          <span className={`px-2 py-0.5 rounded-md font-mono font-black text-xs shadow-xs border ${
                            step.type === 'start' ? 'text-white bg-[#047857] border-[#047857]' : 
                            step.type === 'end' ? 'text-[#10B981] bg-[#0B1914] border-[#10B981]' : 
                            'text-[#B91C1C] bg-red-50 border-red-200'
                          }`}>
                            {step.delta > 0 ? `+₹${step.delta.toFixed(2)}L` : `-₹${Math.abs(step.delta).toFixed(2)}L`}
                          </span>
                        </div>

                        {/* Floating Bar Container */}
                        <div 
                          className="w-full relative"
                          style={{ height: '100%' }}
                        >
                          <div 
                            className={`w-full rounded-md transition-all duration-200 cursor-pointer shadow-sm ${step.col} ${isHovered ? 'ring-2 ring-[#0F172A] scale-105' : ''}`}
                            style={{ 
                              position: 'absolute',
                              bottom: `${bottomPct}%`, 
                              height: `${heightPct}%`,
                              minHeight: '6px'
                            }}
                          ></div>
                        </div>

                        {/* Step Label below chart */}
                        <div className="text-center mt-2.5 w-full bg-slate-50/80 p-1.5 rounded-lg border border-slate-200/60">
                          <p className="text-[10px] font-bold text-[#0F172A] truncate" title={step.label}>{step.label}</p>
                          <p className="text-[10px] font-mono font-bold text-slate-700 mt-0.5">
                            {step.type === 'end' ? '₹15.00L' : step.type === 'start' ? '₹44.75L' : `₹${step.start.toFixed(2)}L`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Bridge Summary */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-4 pt-3 text-xs text-slate-600 border-t border-slate-200">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center font-semibold text-slate-800">
                      <span className="w-3 h-3 bg-[#047857] rounded-sm mr-1.5"></span> Gross Revenue (+₹44.75L)
                    </span>
                    <span className="flex items-center font-semibold text-slate-800">
                      <span className="w-3 h-3 bg-[#DC2626] rounded-sm mr-1.5"></span> Cost Deductions (-₹29.75L)
                    </span>
                    <span className="flex items-center font-semibold text-slate-800">
                      <span className="w-3 h-3 bg-[#0B1914] border border-[#10B981] rounded-sm mr-1.5"></span> Net Margin (+₹15.00L)
                    </span>
                  </div>
                  <span className="font-mono font-black text-sm text-[#047857] bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
                    Net Platform EBITDA: 33.5%
                  </span>
                </div>
              </div>
            ) : (
              /* Unit Economics View */
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  {/* Per Ton CORC Economics */}
                  <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1]">
                    <h4 className="text-xs font-bold text-[#0F172A] uppercase mb-3 flex items-center justify-between">
                      <span>Per-Tonne CORC Economics</span>
                      <span className="text-[#10B981] font-mono font-bold">2,188 tCO2e Total</span>
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-[#334155]">Offtake Realization</span>
                          <span className="text-[#10B981] font-bold">₹2,045 / tCO2e (€140)</span>
                        </div>
                        <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                          <div className="bg-[#10B981] h-2 rounded-full w-full"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-[#334155]">Total Delivery Cost</span>
                          <span className="text-[#EF4444] font-bold">₹1,360 / tCO2e (€93)</span>
                        </div>
                        <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                          <div className="bg-[#EF4444] h-2 rounded-full w-[66.5%]"></div>
                        </div>
                      </div>
                      <div className="p-2.5 rounded bg-white border border-[#CBD5E1] flex justify-between items-center">
                        <span className="text-xs font-bold text-[#0F172A]">Platform Net Margin / Ton</span>
                        <span className="text-sm font-bold text-[#0B1914] font-mono">+₹685 / tCO2e (33.5%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Farmer Economics & Stubble Value */}
                  <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1]">
                    <h4 className="text-xs font-bold text-[#0F172A] uppercase mb-3 flex items-center justify-between">
                      <span>Farmer Value Creation</span>
                      <span className="text-[#3B82F6] font-mono font-bold">500 Farmers</span>
                    </h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                        <span className="text-[#64748B]">Per-Acre Direct Payout:</span>
                        <span className="font-bold text-[#0F172A]">₹9,100 / acre</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                        <span className="text-[#64748B]">Total Farmer Payout Pool:</span>
                        <span className="font-bold text-[#10B981]">₹1.138 Crore</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                        <span className="text-[#64748B]">Stubble Monetization:</span>
                        <span className="font-bold text-[#0F172A]">₹3,640 / ton stubble</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-[#64748B]">Biochar Returned to Soil:</span>
                        <span className="font-bold text-[#0F172A]">875 Tonnes (0.7t/ac)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pilot Budget Breakdown & Efficiency Card */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-[#CBD5E1] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-[#0F172A] uppercase">Pilot Budget Allocation</h3>
                <span className="text-[10px] font-bold text-[#10B981] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#10B981]">
                  88.1% Spent
                </span>
              </div>
              <p className="text-xs text-[#64748B] mb-4">Total Budget: <span className="font-bold text-[#0F172A]">₹29.75L</span> | Total Spent: <span className="font-bold text-[#10B981]">₹26.20L</span></p>
              
              <div className="space-y-3">
                {(budgetBreakdown || [
                  { category: 'Field Operations', budgetL: 8.5, spentL: 7.2 },
                  { category: 'Kiln Procurement & Maint.', budgetL: 7.0, spentL: 6.8 },
                  { category: 'dMRV & Satellite Monitoring', budgetL: 5.25, spentL: 4.9 },
                  { category: 'Registry & Lab Testing', budgetL: 4.5, spentL: 3.8 },
                  { category: 'Training & Capacity Building', budgetL: 2.5, spentL: 2.1 },
                  { category: 'Overhead & Contingency', budgetL: 2.0, spentL: 1.4 },
                ]).map((b, idx) => {
                  const pct = (b.spentL / b.budgetL) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="text-[#334155]">{b.category}</span>
                        <span className="text-[#0F172A] font-semibold">₹{b.spentL}L / ₹{b.budgetL}L</span>
                      </div>
                      <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${pct > 90 ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}`} 
                          style={{ width: `${Math.min(100, pct)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex justify-between items-center text-xs">
              <span className="text-[#64748B]">Unspent Contingency:</span>
              <span className="font-bold text-[#10B981] font-mono">₹3.55 Lakhs Available</span>
            </div>
          </div>
        </div>

        {/* 1:1 DBT Payout Ledger matching all 500 farmers */}
        <div className="bg-white rounded-lg border border-[#CBD5E1] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#CBD5E1] bg-[#F8FAFC] flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] uppercase">DBT Payout Ledger (Direct Benefit Transfer)</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Showing {displayedPayouts.length} of {filteredPayouts.length} filtered transactions (Total 500 Pilot Farmers)
              </p>
            </div>
            <div className="flex space-x-4">
              <div className="relative w-72">
                <Search className="absolute left-3 top-2.5 text-[#64748B]" size={16} />
                <input 
                  type="text" 
                  placeholder="Search Farmer ID, Name, PFMS Ref..." 
                  value={payoutSearch}
                  onChange={(e) => {
                    setPayoutSearch(e.target.value);
                    setPayoutPage(1);
                  }}
                  className="w-full pl-9 pr-8 py-1.5 border border-[#CBD5E1] rounded text-sm focus:outline-none focus:border-[#10B981] bg-white"
                />
                {payoutSearch && (
                  <button 
                    onClick={() => {
                      setPayoutSearch('');
                      setPayoutPage(1);
                    }}
                    className="absolute right-2.5 top-2.5 text-[#94A3B8] hover:text-[#0F172A]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <select 
                value={payoutStatusFilter}
                onChange={(e) => {
                  setPayoutStatusFilter(e.target.value);
                  setPayoutPage(1);
                }}
                className="py-1.5 px-3 border border-[#CBD5E1] rounded text-sm text-[#334155] focus:outline-none focus:border-[#10B981] bg-white"
              >
                <option value="All">All Payout Statuses</option>
                <option value="Success">Disbursed (Success)</option>
                <option value="Processing">PFMS Processing</option>
              </select>
            </div>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#64748B] uppercase bg-[#F8FAFC] border-b border-[#CBD5E1]">
              <tr>
                <th className="px-6 py-3">Farmer ID</th>
                <th className="px-6 py-3">Farmer Name</th>
                <th className="px-6 py-3">Area / Cluster</th>
                <th className="px-6 py-3">Village</th>
                <th className="px-6 py-3">Acres</th>
                <th className="px-6 py-3">Acre Rate</th>
                <th className="px-6 py-3">Total Payout (₹)</th>
                <th className="px-6 py-3">Disbursed Date</th>
                <th className="px-6 py-3">PFMS Ref</th>
                <th className="px-6 py-3">DBT Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedPayouts.length > 0 ? displayedPayouts.map((p, i) => (
                <tr key={i} className="border-b border-[#CBD5E1] hover:bg-[#F0FDF4]">
                  <td className="px-6 py-4 font-mono font-bold text-[#0F172A]">
                    <button 
                      onClick={() => {
                        setActiveTab('farmers');
                        setFarmerSearch(p.farmerId);
                      }}
                      className="text-blue-600 hover:underline flex items-center font-mono"
                      title="Inspect farmer in Farmers tab"
                    >
                      {p.farmerId}
                      <ExternalLink size={10} className="ml-1 opacity-70" />
                    </button>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#0F172A]">{p.farmerName}</td>
                  <td className="px-6 py-4 text-[#334155] font-semibold">{p.cluster}</td>
                  <td className="px-6 py-4 text-[#64748B]">{p.village}</td>
                  <td className="px-6 py-4 text-[#0F172A] font-medium">{p.enrolledAcres} ac</td>
                  <td className="px-6 py-4 text-[#64748B]">₹9,100</td>
                  <td className="px-6 py-4 font-bold text-[#10B981]">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-[#334155]">{p.date}</td>
                  <td className="px-6 py-4 font-mono text-xs text-[#64748B]">{p.pfmsRef}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      p.status === 'Success' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center text-[#64748B]">
                    No DBT payout transactions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-[#CBD5E1] bg-[#F8FAFC] flex justify-between items-center">
              <p className="text-xs text-[#64748B]">
                Showing Page <span className="font-bold text-[#0F172A]">{currentPage}</span> of <span className="font-bold text-[#0F172A]">{totalPages}</span> ({filteredPayouts.length} farmers)
              </p>
              <div className="flex space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setPayoutPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 bg-white border border-[#CBD5E1] rounded text-xs font-medium text-[#334155] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F1F5F9]"
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPayoutPage(pageNum)}
                        className={`px-2.5 py-1 rounded text-xs font-medium ${
                          currentPage === pageNum 
                            ? 'bg-[#10B981] text-white font-bold' 
                            : 'bg-white border border-[#CBD5E1] text-[#334155] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && <span className="px-1 text-[#94A3B8] text-xs self-center">...</span>}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setPayoutPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 bg-white border border-[#CBD5E1] rounded text-xs font-medium text-[#334155] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F1F5F9]"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-[#CBD5E1]">
        <h3 className="text-sm font-bold text-[#0F172A] mb-4 uppercase">Command Center Team</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Dr. Anjali Sharma', role: 'Ops Lead', access: 'Full Admin' },
            { name: 'Vikram Mehta', role: 'Finance Head', access: 'Finance Admin' },
            { name: 'Priya Desai', role: 'Remote Sensing Lead', access: 'Data Analyst' },
            { name: 'Rahul Singh', role: 'Field Coordinator Lead', access: 'Field Ops' },
          ].map((member, i) => (
            <div key={i} className="flex items-center p-4 border border-[#CBD5E1] rounded-lg bg-[#F8FAFC]">
              <div className="w-10 h-10 rounded-full bg-[#0B1914] text-white flex items-center justify-center font-bold mr-4">
                {member.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
              </div>
              <div>
                <p className="font-bold text-[#0F172A] text-sm">{member.name}</p>
                <p className="text-xs text-[#64748B]">{member.role}</p>
              </div>
              <div className="ml-auto">
                <span className="text-[10px] uppercase font-bold text-[#10B981] bg-[#F0FDF4] px-2 py-1 rounded border border-[#10B981]">
                  {member.access}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, render: renderDashboard },
    { id: 'farmers', label: 'Farmers & FPO', icon: Users, render: renderFarmers },
    { id: 'kilns', label: 'Kiln Fleet', icon: Flame, render: renderKilnFleet },
    { id: 'satellite', label: 'Satellite Monitor', icon: Satellite, render: renderSatellite },
    { id: 'credits', label: 'Carbon Credits', icon: CreditCard, render: renderCarbonCredits },
    { id: 'buyers', label: 'Buyers', icon: Briefcase, render: renderBuyers },
    { id: 'finance', label: 'Payouts & Finance', icon: Wallet, render: renderPayouts },
    { id: 'settings', label: 'Settings', icon: Settings, render: renderSettings },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#0B1914] text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-[#132E27]">
          <h1 className="text-lg font-black tracking-wider text-[#10B981]">AGRI-CARBON</h1>
          <p className="text-xs text-[#94A3B8] font-medium tracking-widest mt-1 uppercase">Command Center</p>
        </div>
        <div className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button 
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-[#132E27] text-[#10B981] border-r-4 border-[#10B981]' 
                        : 'text-[#94A3B8] hover:bg-[#1a3f35] hover:text-white'
                    }`}
                  >
                    <Icon size={18} className="mr-3" />
                    {tab.label}
                    {isActive && <ChevronRight size={16} className="ml-auto" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="p-4 border-t border-[#132E27] text-xs text-[#64748B] flex items-center justify-between">
          <span>v2.4.0-stable</span>
          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-[#CBD5E1] px-8 py-4 flex items-center justify-between shadow-sm z-0">
          <h2 className="text-xl font-bold text-[#0F172A]">{tabs.find(t => t.id === activeTab)?.label}</h2>
          <div className="flex items-center space-x-4 text-sm text-[#334155] font-medium">
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#10B981] mr-2"></span> System Online
            </div>
            <div className="bg-[#F8FAFC] border border-[#CBD5E1] px-3 py-1 rounded">
              Season: <span className="font-bold text-[#0F172A]">Kharif 2025</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          {tabs.find(t => t.id === activeTab)?.render()}
        </main>
      </div>
    </div>
  );
}
