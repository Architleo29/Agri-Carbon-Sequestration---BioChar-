import React, { useState, useEffect } from 'react';
import { 
  Database, FlaskConical, Satellite, Layers, Link2, 
  AlertTriangle, Award, Download, ChevronDown, ChevronUp, 
  CheckCircle2, XCircle, Clock, Search, Filter, RefreshCw, 
  FileText, ArrowRight, ShieldCheck, Camera, MapPin, Box,
  ExternalLink, Copy, Check, Info, Sparkles, ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { batches, creditLots, farmers, kilns, kpis, clusters, pipelineSummary } from '../data/mockDataset.js';

export default function VerificationConsole() {
  const [activeTab, setActiveTab] = useState('ledger');
  const [expandedBatchId, setExpandedBatchId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState('All');
  
  // Pagination states
  const [ledgerPage, setLedgerPage] = useState(1);
  const [ledgerPageSize, setLedgerPageSize] = useState(25);
  const [limsPage, setLimsPage] = useState(1);
  const [fieldPage, setFieldPage] = useState(1);
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [selectedPlotIndex, setSelectedPlotIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 250);
  };

  // Reset page when filter or search query changes
  useEffect(() => {
    setLedgerPage(1);
  }, [searchQuery, selectedClusterFilter]);

  // Synchronized batch dataset directly mapped from mockDataset.js
  const verifiedBatches = batches.map((b, i) => {
    const isPass = b.labStatus === 'pass';
    const hCorg = b.labResults?.hcorg || (isPass ? 0.28 : 0.48);
    const moisture = b.labResults?.moisturePct || 5.2;
    const ash = b.labResults?.ashPct || 11.8;
    const farmer = farmers[i % farmers.length] || farmers[0];

    return {
      ...b,
      id: b.batchId,
      sampleId: b.sampleId,
      date: `2025-04-${String((i % 20) + 1).padStart(2, '0')}`,
      farmerId: farmer.id,
      farmerName: farmer.name,
      village: farmer.village,
      cluster: b.cluster || farmer.cluster,
      inputWeight: b.inputWeightKg || 125,
      outputWeight: b.outputWeightKg || 38,
      yieldPct: b.yieldPct || 28.5,
      isPass,
      hCorg,
      moisture,
      ash,
      operator: b.coordinatorName || `Balwinder Gill`,
      hash: b.ledgerHash || `0x${Math.abs(i * 9999).toString(16).padStart(12, '0')}a9f4c`,
      gps: b.gps ? `${b.gps.lat.toFixed(4)}°N, ${b.gps.lng.toFixed(4)}°E` : `30.9012°N, 75.8573°E`,
      peakTemp: b.peakTempC || 623,
    };
  });

  const totalBatches = verifiedBatches.length;
  const passedBatches = verifiedBatches.filter(b => b.isPass);
  const failedBatches = verifiedBatches.filter(b => !b.isPass);
  const passRate = Math.round((passedBatches.length / totalBatches) * 100);

  // Filtered batches for the ledger
  const filteredBatches = verifiedBatches.filter(b => {
    const matchSearch = b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.sampleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.hash.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCluster = selectedClusterFilter === 'All' || b.cluster === selectedClusterFilter;
    return matchSearch && matchCluster;
  });

  const totalLedgerPages = Math.ceil(filteredBatches.length / ledgerPageSize) || 1;
  const currentLedgerBatches = filteredBatches.slice((ledgerPage - 1) * ledgerPageSize, ledgerPage * ledgerPageSize);

  const navItems = [
    { id: 'ledger', label: 'Batch Test Ledger', icon: Database, count: verifiedBatches.length },
    { id: 'lims', label: 'Lab Results (LIMS)', icon: FlaskConical, count: `${passRate}% Pass` },
    { id: 'field', label: 'Field Verification & NDVI', icon: Satellite },
    { id: 'aggregation', label: 'Credit Lot Aggregation', icon: Layers, count: creditLots.length },
    { id: 'twin', label: 'Digital Twin Audit', icon: Link2 },
    { id: 'quarantine', label: 'Exceptions Queue', icon: AlertTriangle, count: failedBatches.length },
    { id: 'certification', label: 'Registry Status Tracker', icon: Award },
    { id: 'export', label: 'VVB Export Center', icon: Download },
  ];

  // Reusable Pagination Component
  const renderPagination = (currentPage, setPage, totalItems, pageSize, setPageSize) => {
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const startIdx = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endIdx = Math.min(currentPage * pageSize, totalItems);

    return (
      <div className="p-4 bg-[#F8FAFC] border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
        <div className="text-slate-600 font-medium">
          Showing <strong className="text-slate-900">{startIdx}</strong> to <strong className="text-slate-900">{endIdx}</strong> of <strong className="text-[#047857]">{totalItems}</strong> entries
        </div>

        <div className="flex items-center gap-3">
          {setPageSize && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
            >
              First
            </button>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-0.5"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            
            <span className="px-3 py-1 font-mono font-bold text-[#047857] bg-green-50 rounded-lg border border-green-200">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-2 py-1 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-0.5"
            >
              Next <ChevronRightIcon size={14} />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ledger':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-[#0F172A] flex items-center gap-2.5">
                  <Link2 className="text-[#10B981]" size={26} />
                  Immutable Batch Verification Ledger
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Cryptographically verified evidence chain for all {verifiedBatches.length} pyrolytic batches across 5 clusters.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-xs">
                  <Search size={15} className="text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search Hash, Batch, or Farmer..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="outline-none text-xs w-52 text-slate-800" 
                  />
                </div>
                <select
                  value={selectedClusterFilter}
                  onChange={(e) => setSelectedClusterFilter(e.target.value)}
                  className="bg-white border border-slate-300 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 shadow-xs focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                >
                  <option value="All">All Clusters ({clusters.length})</option>
                  {clusters.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Top KPI Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <p className="text-[11px] text-slate-500 font-bold uppercase">Total Batches</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">{totalBatches}</p>
                <p className="text-[10px] text-slate-400 font-mono">25 Pyrolytic Kilns</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <p className="text-[11px] text-[#047857] font-bold uppercase">Lab Passed (H:C ≤ 0.4)</p>
                <p className="text-2xl font-black text-[#10B981] mt-0.5">{passedBatches.length}</p>
                <p className="text-[10px] text-[#059669] font-semibold">{passRate}% EBC Durability Pass</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <p className="text-[11px] text-amber-600 font-bold uppercase">In-Process / Review</p>
                <p className="text-2xl font-black text-amber-600 mt-0.5">{failedBatches.length}</p>
                <p className="text-[10px] text-amber-700 font-semibold">{((failedBatches.length / totalBatches) * 100).toFixed(1)}% Under VVB Review</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <p className="text-[11px] text-slate-500 font-bold uppercase">Target Pilot CORCs</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">2,188</p>
                <p className="text-[10px] text-slate-400 font-mono">Puro.earth / Verra</p>
              </div>
            </div>

            {/* Ledger Table with Pagination */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#F8FAFC] text-slate-600 border-b border-slate-200 text-[11px] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-3.5">Batch ID</th>
                      <th className="p-3.5">Sample ID</th>
                      <th className="p-3.5">Cluster / Village</th>
                      <th className="p-3.5">Farmer Source</th>
                      <th className="p-3.5">Biomass → Biochar</th>
                      <th className="p-3.5">H:Corg (≤ 0.4)</th>
                      <th className="p-3.5">Lab Status</th>
                      <th className="p-3.5">Ledger Hash</th>
                      <th className="p-3.5 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {currentLedgerBatches.map((batch) => (
                      <React.Fragment key={batch.id}>
                        <tr 
                          className={`hover:bg-[#F0FDF4] cursor-pointer transition-colors ${expandedBatchId === batch.id ? 'bg-[#F8FAFC]' : ''}`}
                          onClick={() => setExpandedBatchId(expandedBatchId === batch.id ? null : batch.id)}
                        >
                          <td className="p-3.5 font-mono font-bold text-[#0F172A]">{batch.id}</td>
                          <td className="p-3.5 text-slate-500 font-mono">{batch.sampleId}</td>
                          <td className="p-3.5 text-slate-700 font-medium">{batch.cluster} <span className="text-slate-400 font-normal">({batch.village})</span></td>
                          <td className="p-3.5 text-slate-800 font-bold">{batch.farmerName}</td>
                          <td className="p-3.5 font-mono text-slate-700">{batch.inputWeight}kg → <strong className="text-slate-900">{batch.outputWeight}kg</strong> ({batch.yieldPct}%)</td>
                          <td className="p-3.5 font-mono font-bold text-slate-900">{batch.hCorg}</td>
                          <td className="p-3.5">
                            {batch.isPass ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F0FDF4] text-[#047857] border border-[#10B981]">
                                <CheckCircle2 size={11} /> PASS
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-300">
                                <XCircle size={11} /> QUARANTINE
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="font-mono text-[10px] bg-[#F1F5F9] px-2 py-0.5 rounded text-slate-600 border border-slate-200 select-all">
                              {batch.hash.substring(0, 14)}...
                            </span>
                          </td>
                          <td className="p-3.5 text-right text-slate-400">
                            {expandedBatchId === batch.id ? <ChevronUp size={16} className="inline text-[#10B981]" /> : <ChevronDown size={16} className="inline" />}
                          </td>
                        </tr>

                        {expandedBatchId === batch.id && (
                          <tr className="bg-[#0B1914] text-white">
                            <td colSpan="9" className="p-5">
                              <div className="space-y-3">
                                <div className="flex justify-between items-center border-b border-[#1a3f35] pb-2">
                                  <span className="text-[#10B981] font-bold text-xs uppercase tracking-wider">
                                    dMRV Chain-of-Custody Provenance (Batch #{batch.id})
                                  </span>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      showToast(`Copied complete hash: ${batch.hash}`);
                                    }}
                                    className="text-xs text-[#10B981] hover:underline flex items-center gap-1 font-mono cursor-pointer"
                                  >
                                    <Copy size={12} /> Copy Full Hash Signature
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                                  <div className="bg-[#132E27] p-3 rounded-xl border border-[#1a3f35]">
                                    <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">1. Origin Farmer</span>
                                    <p className="font-bold text-white mt-0.5">{batch.farmerName} ({batch.farmerId})</p>
                                    <p className="text-[11px] text-slate-300">{batch.cluster} Cluster · {batch.gps}</p>
                                  </div>
                                  <div className="bg-[#132E27] p-3 rounded-xl border border-[#1a3f35]">
                                    <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">2. Kiln Pyrolysis IoT</span>
                                    <p className="font-bold text-white mt-0.5">Kiln {batch.kilnId}</p>
                                    <p className="text-[11px] text-slate-300">Peak: {batch.peakTemp}°C · Water Quenched (150L)</p>
                                  </div>
                                  <div className="bg-[#132E27] p-3 rounded-xl border border-[#1a3f35]">
                                    <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">3. Eurofins Laboratory</span>
                                    <p className="font-bold text-white mt-0.5">Sample #{batch.sampleId}</p>
                                    <p className="text-[11px] text-[#10B981]">H:Corg {batch.hCorg} (Pass ≤ 0.4) · Ash {batch.ash}%</p>
                                  </div>
                                  <div className="bg-[#132E27] p-3 rounded-xl border border-[#1a3f35]">
                                    <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">4. Verification Status</span>
                                    <p className="font-bold text-white mt-0.5">Greenlit for CORC Minting</p>
                                    <p className="text-[11px] text-slate-300">Auditor: TÜV SÜD · Puro.earth</p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {renderPagination(ledgerPage, setLedgerPage, filteredBatches.length, ledgerPageSize, setLedgerPageSize)}
            </div>
          </div>
        );

      case 'lims':
        const limsPageSize = 25;
        const currentLimsBatches = verifiedBatches.slice((limsPage - 1) * limsPageSize, limsPage * limsPageSize);

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-[#0F172A] flex items-center gap-2.5">
                  <FlaskConical className="text-[#8B5CF6]" size={26} />
                  Eurofins Laboratory Information Management System (LIMS)
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Automated ISO 17025 laboratory data ingestion verifying European Biochar Certificate (EBC) threshold limits.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#047857] bg-green-50 px-3 py-1.5 rounded-full border border-[#10B981]/30">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                LIMS API Feed Synced (DIN EN 15104)
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Average H:Corg Ratio</p>
                <p className="text-2xl font-black text-[#0F172A] mt-0.5">0.28</p>
                <p className="text-[10px] text-[#10B981] font-bold">Standard Limit: ≤ 0.40</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] text-[#047857] font-bold uppercase">Lab Certified (Pass)</p>
                <p className="text-2xl font-black text-[#047857] mt-0.5">{passedBatches.length}</p>
                <p className="text-[10px] text-slate-400 font-mono">{passRate}% EBC Durability Pass</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] text-amber-600 font-bold uppercase">In-Process Analysis</p>
                <p className="text-2xl font-black text-amber-600 mt-0.5">21</p>
                <p className="text-[10px] text-amber-700 font-mono">3.4% Lab Titration Queue</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] text-red-600 font-bold uppercase">Quarantined (&gt; 0.40)</p>
                <p className="text-2xl font-black text-red-600 mt-0.5">11</p>
                <p className="text-[10px] text-red-700 font-mono">1.8% Excluded from CORCs</p>
              </div>
            </div>

            {/* LIMS Results Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#F8FAFC] text-slate-600 border-b border-slate-200 text-[11px] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-3.5">Sample ID</th>
                      <th className="p-3.5">Batch ID</th>
                      <th className="p-3.5">Cluster</th>
                      <th className="p-3.5">H:Corg Ratio</th>
                      <th className="p-3.5">Organic Carbon</th>
                      <th className="p-3.5">Moisture %</th>
                      <th className="p-3.5">Ash %</th>
                      <th className="p-3.5">EBC Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {currentLimsBatches.map((batch) => (
                      <tr key={`lims-${batch.id}`} className="hover:bg-[#F8FAFC]">
                        <td className="p-3.5 font-mono font-bold text-slate-900">{batch.sampleId}</td>
                        <td className="p-3.5 text-slate-500 font-mono">{batch.id}</td>
                        <td className="p-3.5 text-slate-700 font-medium">{batch.cluster}</td>
                        <td className="p-3.5 font-mono font-black text-slate-900">{batch.hCorg}</td>
                        <td className="p-3.5 font-mono text-slate-700">82.4%</td>
                        <td className="p-3.5 font-mono text-slate-700">{batch.moisture}%</td>
                        <td className="p-3.5 font-mono text-slate-700">{batch.ash}%</td>
                        <td className="p-3.5">
                          {batch.isPass ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-[#047857] border border-green-200">
                              <ShieldCheck size={12} /> Certified Durability
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                              <AlertTriangle size={12} /> Failed (&gt; 0.4)
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* LIMS Pagination */}
              {renderPagination(limsPage, setLimsPage, verifiedBatches.length, limsPageSize)}
            </div>
          </div>
        );

      case 'field':
        const fieldPageSize = 20;
        const currentPlots = farmers.slice((fieldPage - 1) * fieldPageSize, fieldPage * fieldPageSize);
        const samplePlot = farmers[selectedPlotIndex] || farmers[0];

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-[#0F172A] flex items-center gap-2.5">
                  <Satellite className="text-[#3B82F6]" size={26} />
                  Sentinel-2 Multi-Spectral Satellite Verification
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Automated European Space Agency (ESA) Sentinel-2 NDVI/NBR burn detection over all 500 farmer plots.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Farmer Plot Selector Queue with Pagination */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="p-3.5 bg-[#F8FAFC] border-b border-slate-200 font-bold text-xs text-slate-800 flex justify-between items-center">
                    <span>Enrolled Plots Queue</span>
                    <span className="text-[10px] font-mono text-slate-500">500 Plots Total</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
                    {currentPlots.map((f, idx) => {
                      const globalIdx = (fieldPage - 1) * fieldPageSize + idx;
                      return (
                        <div 
                          key={f.id}
                          onClick={() => setSelectedPlotIndex(globalIdx)}
                          className={`p-3 cursor-pointer transition-all ${selectedPlotIndex === globalIdx ? 'bg-[#F0FDF4] border-l-4 border-l-[#10B981]' : 'hover:bg-[#F8FAFC]'}`}
                        >
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold text-xs text-slate-900">{f.id} — {f.name}</span>
                            {f.zeroBurnStatus === 'verified' ? (
                              <span className="text-[10px] font-bold text-[#047857] bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                                Verified ✓
                              </span>
                            ) : f.zeroBurnStatus === 'in_process' ? (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                In-Process ⏳
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                                Flagged ⚠
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">{f.village} ({f.cluster}) · {f.enrolledAcres} Acres</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Plot list pagination */}
                <div className="p-3 bg-[#F8FAFC] border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-[11px] text-slate-500 font-mono">Page {fieldPage} of {Math.ceil(farmers.length / fieldPageSize)}</span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setFieldPage(p => Math.max(1, p - 1))}
                      disabled={fieldPage === 1}
                      className="px-2 py-0.5 rounded bg-white border border-slate-300 text-xs font-bold disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <button 
                      onClick={() => setFieldPage(p => Math.min(Math.ceil(farmers.length / fieldPageSize), p + 1))}
                      disabled={fieldPage >= Math.ceil(farmers.length / fieldPageSize)}
                      className="px-2 py-0.5 rounded bg-white border border-slate-300 text-xs font-bold disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Satellite High-Res Evidence Panel */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm text-[#0F172A]">
                      Sentinel-2 Pass: {samplePlot.name} ({samplePlot.id}) — {samplePlot.village}, {samplePlot.cluster}
                    </h3>
                    {samplePlot.zeroBurnStatus === 'verified' ? (
                      <span className="text-xs font-mono bg-green-100 text-[#047857] px-2.5 py-0.5 rounded-full font-bold">
                        Zero-Burn Confirmed (NBR: +0.14)
                      </span>
                    ) : samplePlot.zeroBurnStatus === 'in_process' ? (
                      <span className="text-xs font-mono bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">
                        Satellite Pass In-Process (Tile PB-04)
                      </span>
                    ) : (
                      <span className="text-xs font-mono bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-bold">
                        Thermal Anomaly (Field Audit Assigned)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative h-56 bg-[url('/pre_harvest.jpg')] bg-cover bg-center rounded-xl overflow-hidden border border-slate-200">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex flex-col justify-end p-3 text-white">
                        <span className="text-xs font-bold">Pre-Harvest Baseline Scan</span>
                        <span className="text-[10px] text-slate-300 font-mono">10 Oct 2025 · Sentinel-2 MSI</span>
                      </div>
                    </div>

                    <div className={`relative h-56 bg-[url('/post_harvest.jpg')] bg-cover bg-center rounded-xl overflow-hidden border-2 ${
                      samplePlot.zeroBurnStatus === 'verified' ? 'border-[#10B981]' : samplePlot.zeroBurnStatus === 'in_process' ? 'border-amber-400' : 'border-red-400'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex flex-col justify-end p-3 text-white">
                        <span className="text-xs font-bold">
                          {samplePlot.zeroBurnStatus === 'verified' ? 'Post-Harvest Clearance Pass' : samplePlot.zeroBurnStatus === 'in_process' ? 'Sentinel-2 Ingest Processing' : 'Anomaly Flagged for Re-Scan'}
                        </span>
                        <span className="text-[10px] text-slate-300 font-mono">
                          {samplePlot.zeroBurnStatus === 'verified' ? '02 Nov 2025 · Zero Thermal Anomalies' : samplePlot.zeroBurnStatus === 'in_process' ? 'Tile T43RFS Ingest · 4.2% Cloud Cover' : 'Ground Inspection Assigned to Gurpreet Singh'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 p-3 bg-[#F8FAFC] rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Coordinates:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {samplePlot.plotCenter?.lat?.toFixed(4) || '30.9012'}°N, {samplePlot.plotCenter?.lng?.toFixed(4) || '75.8573'}°E
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Enrolled Land Area:</span>
                      <span className="font-bold text-slate-800">{samplePlot.enrolledAcres} Acres</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Residue Stubble Diverted:</span>
                      <span className="font-bold text-[#047857]">{samplePlot.stubbleCollectedT} Tonnes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'aggregation':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-[#0F172A] flex items-center gap-2.5">
                  <Layers className="text-[#10B981]" size={26} />
                  Credit Lot Aggregation Matrix
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  1:Many cryptographic traceability linking micro-batches to registered Puro.earth and Verra CORC lots.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                {creditLots.length} Aggregated Credit Lots (2,188 CORCs)
              </span>
            </div>

            <div className="space-y-4">
              {creditLots.slice(0, 10).map((lot) => (
                <div key={lot.lotId} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-[#0F172A]">{lot.lotId}</span>
                        <span className="text-[10px] font-bold uppercase bg-[#0B1914] text-white px-2 py-0.5 rounded">
                          {lot.registry}
                        </span>
                        {lot.buyerName && (
                          <span className="text-[10px] font-bold text-[#047857] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                            Offtake: {lot.buyerName}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Certified: {lot.certificationDate || '2025-05-18'} · Vintage: {lot.vintage}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-[#047857]">{lot.volume} CORCs</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{(lot.batchIds || []).length || 8} Component Batches</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                    <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">Batches:</span>
                    {(lot.batchIds && lot.batchIds.length > 0 ? lot.batchIds.slice(0, 8) : ['A-0001', 'A-0002', 'A-0003', 'A-0004']).map((bId) => (
                      <span key={bId} className="px-2 py-1 bg-[#F8FAFC] border border-slate-200 rounded font-mono text-[10px] font-bold text-slate-700 whitespace-nowrap">
                        {bId}
                      </span>
                    ))}
                    <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">+ more</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'twin':
        const targetBatch = verifiedBatches[0];
        const twinEvents = [
          { title: "1. Stubble Biomass Intake", details: `Weight: ${targetBatch.inputWeight}kg | Source: ${targetBatch.farmerName} (${targetBatch.farmerId}) | ${targetBatch.gps}`, time: "08:15 IST", icon: Box },
          { title: "2. Pyrolysis Ignition & Telemetry", details: `Kiln ID: ${targetBatch.kilnId} | Peak Temp: ${targetBatch.peakTemp}°C | Operator: ${targetBatch.operator}`, time: "09:30 IST", icon: Clock },
          { title: "3. Water Quench & Biochar Extraction", details: `Volume: 150L Quenched | Extracted: ${targetBatch.outputWeight}kg Biochar (${targetBatch.yieldPct}% yield)`, time: "13:42 IST", icon: AlertTriangle },
          { title: "4. Tamper-Evident Bag Sealing", details: `QR Tag: ${targetBatch.sampleId} | Eurofins Chain of Custody Logged`, time: "14:45 IST", icon: ShieldCheck },
          { title: "5. Laboratory Chemical Analysis", details: `H:Corg: ${targetBatch.hCorg} (≤0.4 req) | Moisture: ${targetBatch.moisture}% | Ash: ${targetBatch.ash}%`, time: "Lab Passed", icon: FlaskConical },
          { title: "6. Credit Lot Allocation & Minting", details: `Puro.earth CORC Tokenization | Target Vintage: Kharif 2025`, time: "Issued", icon: Layers },
        ];

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-[#0F172A] flex items-center gap-2.5">
                  <Link2 className="text-[#3B82F6]" size={26} />
                  Digital Twin Audit Trail — Batch #{targetBatch.id}
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  100% end-to-end trace connecting physical straw in Punjab to verified carbon credit tokens on Puro.earth.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-3xl mx-auto space-y-6">
              <div className="relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 space-y-6">
                {twinEvents.map((ev, i) => (
                  <div key={i} className="relative flex items-start gap-4 pl-2">
                    <div className="w-8 h-8 rounded-full bg-[#0B1914] text-[#10B981] flex items-center justify-center border-2 border-white shadow-xs z-10 shrink-0">
                      <ev.icon size={14} />
                    </div>
                    <div className="flex-1 bg-[#F8FAFC] p-3.5 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-xs text-slate-900">{ev.title}</h4>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{ev.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600">{ev.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'quarantine':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-[#0F172A] flex items-center gap-2.5">
                  <AlertTriangle className="text-amber-500" size={26} />
                  Quarantine & Quality Exceptions Queue
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Batches quarantined from credit aggregation due to analytical or procedural deviations.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#F8FAFC] text-slate-600 border-b border-slate-200 text-[11px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-3.5">Batch ID</th>
                    <th className="p-3.5">Sample ID</th>
                    <th className="p-3.5">Cluster</th>
                    <th className="p-3.5">Deviation Reason</th>
                    <th className="p-3.5">H:Corg Value</th>
                    <th className="p-3.5">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {failedBatches.map((b) => (
                    <tr key={`q-${b.id}`} className="hover:bg-amber-50/50">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{b.id}</td>
                      <td className="p-3.5 font-mono text-slate-500">{b.sampleId}</td>
                      <td className="p-3.5 text-slate-700 font-medium">{b.cluster}</td>
                      <td className="p-3.5 text-amber-700 font-semibold">H:Corg Ratio &gt; 0.40 Threshold</td>
                      <td className="p-3.5 font-mono font-bold text-red-600">{b.hCorg}</td>
                      <td className="p-3.5">
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                          Quarantined (Excluded from CORCs)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'certification':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-[#0F172A] flex items-center gap-2.5">
                  <Award className="text-[#047857]" size={26} />
                  Registry & VVB Certification Tracker
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Live verification milestone progression across Puro.earth and Verra registry standards.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {creditLots.slice(0, 8).map((lot) => (
                <div key={lot.lotId} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{lot.lotId}</span>
                      <span className="text-[10px] font-bold bg-[#0B1914] text-white px-2 py-0.5 rounded">
                        {lot.registry}
                      </span>
                    </div>
                    <span className="font-bold text-[#047857] text-sm">{lot.volume} CORCs</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-green-50 border border-green-200 rounded-xl">
                      <span className="text-[10px] text-green-700 block font-bold">1. LIMS Lab Pass</span>
                      <span className="font-bold text-[#047857]">Verified ✓</span>
                    </div>
                    <div className="p-2 bg-green-50 border border-green-200 rounded-xl">
                      <span className="text-[10px] text-green-700 block font-bold">2. Zero-Burn Pass</span>
                      <span className="font-bold text-[#047857]">Sentinel-2 ✓</span>
                    </div>
                    <div className="p-2 bg-green-50 border border-green-200 rounded-xl">
                      <span className="text-[10px] text-green-700 block font-bold">3. VVB Audit (TÜV)</span>
                      <span className="font-bold text-[#047857]">Approved ✓</span>
                    </div>
                    <div className={`p-2 rounded-xl border ${lot.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-green-50 border-green-200 text-[#047857]'}`}>
                      <span className="text-[10px] block font-bold">4. Registry Minting</span>
                      <span className="font-bold">{lot.status === 'pending' ? 'In Queue' : 'Minted ✓'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'export':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-[#0F172A] flex items-center gap-2.5">
                  <Download className="text-[#3B82F6]" size={26} />
                  VVB Third-Party Audit Export Center
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Compile verified evidence packages for third-party auditing by TÜV SÜD and registry issuance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider border-b border-slate-100 pb-2">
                  Kharif 2025 Audit Package Contents
                </h3>

                <ul className="space-y-3 text-xs">
                  <li className="flex justify-between items-center p-2.5 bg-[#F8FAFC] rounded-xl">
                    <span className="font-medium text-slate-800 flex items-center gap-2">
                      <FileText size={14} className="text-[#10B981]" /> Immutable Batch Ledger ({totalBatches} batches)
                    </span>
                    <span className="font-mono text-slate-400 font-bold">CSV · 4.2 MB</span>
                  </li>
                  <li className="flex justify-between items-center p-2.5 bg-[#F8FAFC] rounded-xl">
                    <span className="font-medium text-slate-800 flex items-center gap-2">
                      <FlaskConical size={14} className="text-[#8B5CF6]" /> Eurofins LIMS Lab Certificates (H:C ≤ 0.4)
                    </span>
                    <span className="font-mono text-slate-400 font-bold">PDF · 18.5 MB</span>
                  </li>
                  <li className="flex justify-between items-center p-2.5 bg-[#F8FAFC] rounded-xl">
                    <span className="font-medium text-slate-800 flex items-center gap-2">
                      <Satellite size={14} className="text-[#3B82F6]" /> Sentinel-2 NDVI 500 Plot Satellite Imagery
                    </span>
                    <span className="font-mono text-slate-400 font-bold">ZIP · 145 MB</span>
                  </li>
                </ul>

                {!isExporting && exportProgress === 0 && (
                  <button 
                    onClick={handleExport}
                    className="w-full bg-[#0B1914] hover:bg-[#132E27] text-white py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <Download size={16} /> Compile Cryptographic Audit Package (ZIP)
                  </button>
                )}

                {isExporting && exportProgress < 100 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Compiling cryptographic hashes & certificates...</span>
                      <span>{exportProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-[#10B981] h-2.5 rounded-full transition-all duration-300" style={{ width: `${exportProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {exportProgress === 100 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center space-y-2">
                    <CheckCircle2 size={32} className="text-[#10B981] mx-auto" />
                    <p className="text-xs font-bold text-slate-900">Audit-Ready Package Compiled Successfully</p>
                    <p className="text-[10px] text-slate-500 font-mono">SHA-256 Checksum: 0x98f4...e21a</p>
                    <button 
                      onClick={() => showToast('Downloaded agri_carbon_vvb_audit_2025.zip')}
                      className="px-4 py-2 bg-[#047857] hover:bg-[#065F46] text-white font-bold text-xs rounded-lg inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Download size={14} /> Download agri_carbon_vvb_audit_2025.zip
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-[#0B1914] p-6 rounded-2xl shadow-lg text-white border border-[#1a3f35] flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#10B981] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ShieldCheck size={18} /> Audit Integrity & Immutability
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    All exported evidence is cryptographically bound to the hashes published on the public ledger. Any alteration will invalidate the SHA-256 checksums during third-party VVB review.
                  </p>
                </div>

                <div className="mt-4 bg-[#132E27] p-3 rounded-xl border border-[#1a3f35] font-mono text-[10px] text-slate-400 space-y-1">
                  <div>NODE: <span className="text-[#10B981]">PUNJAB-DMRV-NODE-01</span></div>
                  <div>CONSENSUS: <span className="text-[#10B981]">SYNCHRONIZED (2,188 CORCs)</span></div>
                  <div>TIMESTAMP: <span className="text-white">Kharif 2025 Pilot Edition</span></div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] bg-[#F8FAFC] font-sans selection:bg-[#10B981] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0B1914] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center z-50 animate-in fade-in border border-[#10B981]/50">
          <CheckCircle2 className="w-5 h-5 mr-2.5 text-[#10B981]" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0B1914] text-white flex flex-col shadow-xl z-20 shrink-0 border-r border-[#1a3f35]">
        <div className="p-5 border-b border-[#1a3f35]">
          <div className="flex items-center gap-2 text-[#10B981] mb-1">
            <ShieldCheck size={20} />
            <span className="font-black tracking-wider text-xs uppercase">AGRI-CARBON dMRV</span>
          </div>
          <h1 className="text-lg font-black tracking-tight text-white leading-tight">Verification<br/>Console</h1>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">Pilot: Kharif 2025</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-3">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer
                      ${isActive 
                        ? 'bg-[#132E27] text-[#10B981] border border-[#10B981]/40 shadow-xs' 
                        : 'text-slate-400 hover:bg-[#132E27]/50 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-[#10B981]' : 'text-slate-500'} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-[#0B1914] text-slate-300">
                        {item.count}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#1a3f35] bg-[#07110e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#132E27] flex items-center justify-center text-[#10B981] font-bold text-xs border border-[#1a3f35]">
              VVB
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white">TÜV SÜD Auditor</div>
              <div className="text-[10px] text-slate-500 font-mono">ISO 14064 Verified</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-xs shrink-0">
          <div className="text-slate-600 font-medium flex items-center gap-2 text-xs">
            <span>Command Center</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">Verification Console</span>
            <span className="text-slate-300">/</span>
            <span className="text-[#047857] font-semibold uppercase">{activeTab}</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 bg-[#F0FDF4] px-2.5 py-1 rounded-full border border-green-200 text-[#047857] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              SHARED COMMAND CENTER SYNCED
            </span>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
