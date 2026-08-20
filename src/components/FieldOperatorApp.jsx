import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Package, 
  Flame, 
  QrCode, 
  ClipboardList, 
  Search, 
  Camera, 
  Lock, 
  Plus, 
  Minus, 
  Play, 
  Pause, 
  Droplet, 
  Check, 
  Clock, 
  AlertTriangle,
  FileWarning,
  Activity,
  History,
  CheckCircle,
  Menu,
  ChevronRight,
  Battery,
  Wifi,
  Signal,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { farmers, kilns, batches, coordinators } from '../data/mockDataset.js';

const FieldOperatorApp = () => {
  const [activeScreen, setActiveScreen] = useState('kiln'); // Default to kiln to easily test the fix
  const [intakeWeight, setIntakeWeight] = useState(125);
  const [intakeConfirmed, setIntakeConfirmed] = useState(false);
  const [kilnTimer, setKilnTimer] = useState(6135); // 01:42:15 in seconds
  const [isKilnRunning, setIsKilnRunning] = useState(true);
  const [quenchLogged, setQuenchLogged] = useState(false);
  const [quenchLitres, setQuenchLitres] = useState(150);
  const [currentTemp, setCurrentTemp] = useState(623);
  const [outputWeight, setOutputWeight] = useState(38);
  const [qrScanned, setQrScanned] = useState(false);
  
  const loggedInCoordinator = coordinators[0] || {
    id: 'COORD-001',
    name: 'Balwinder Singh',
    cluster: 'Sangrur',
    assignedKilns: ['K-001', 'K-002']
  };
  const assignedKiln = kilns.find(k => k.id === loggedInCoordinator.assignedKilns[0]) || kilns[0];
  const assignedBatches = batches.filter(b => b.kilnId === assignedKiln.id).slice(0, 10);
  
  // Format timer
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval;
    if (isKilnRunning && !quenchLogged) {
      interval = setInterval(() => {
        setKilnTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isKilnRunning, quenchLogged]);

  // Handle Water Quench Action
  const handleLogQuench = () => {
    setQuenchLogged(true);
    setIsKilnRunning(false);
    setCurrentTemp(85);
  };

  const handleResetQuench = () => {
    setQuenchLogged(false);
    setIsKilnRunning(true);
    setCurrentTemp(623);
  };

  // StatusBar Component
  const StatusBar = () => (
    <div className="flex justify-between items-center px-5 py-2.5 bg-[#05100B] text-white text-xs font-semibold shrink-0 rounded-t-[2.5rem] border-b border-[#132E27]">
      <span>09:41</span>
      <div className="flex space-x-2 items-center text-slate-300">
        <Signal size={13} />
        <Wifi size={13} />
        <Battery size={15} className="text-[#10B981]" />
      </div>
    </div>
  );

  // App Header
  const AppHeader = ({ title }) => (
    <div className="bg-[#0B1914] px-4 py-3 flex justify-between items-center border-b border-[#132E27] shrink-0">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-full bg-[#132E27] flex items-center justify-center text-white text-xs font-bold border-2 border-[#10B981] shadow-xs">
          {loggedInCoordinator.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h1 className="text-white font-bold text-base leading-tight">{title}</h1>
          <div className="text-[10px] text-[#94A3B8] flex items-center mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5 animate-pulse"></span>
            Kiln {assignedKiln.id} · {loggedInCoordinator.cluster} Hub
          </div>
        </div>
      </div>
      <div className="bg-[#132E27] px-2.5 py-1 rounded-full border border-[#1a3f35] text-[10px] font-bold text-[#10B981]">
        Online
      </div>
    </div>
  );

  // 1. Today's Route Screen
  const RouteScreen = () => (
    <div className="p-4 space-y-4 pb-8 bg-[#0B1914]">
      <div className="bg-[#132E27] rounded-2xl p-4 border border-[#1a3f35] shadow-xs">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-[#10B981] font-bold text-xs uppercase tracking-wider">Field Coordinator</h2>
            <p className="text-white font-black text-lg">{loggedInCoordinator.name}</p>
          </div>
          <div className="bg-[#0B1914] px-3 py-1 rounded-full border border-[#1a3f35] text-[#10B981] font-bold text-xs">
            {loggedInCoordinator.cluster}
          </div>
        </div>
        <p className="text-[#94A3B8] text-xs">Assigned Pyrolytic Kiln: <span className="text-white font-mono font-bold">{assignedKiln.id}</span></p>
      </div>

      <div className="mt-4">
        <h3 className="text-white font-bold text-sm mb-3 flex items-center">
          <Clock className="mr-2 text-[#F59E0B]" size={16} /> Today's Batch Schedule (Kharif 2025)
        </h3>
        
        <div className="space-y-2.5">
          {[
            { time: "08:00 AM", task: "Stubble Intake", farmer: "Amrit Singh (F-0042)", status: "done", action: () => setActiveScreen('intake') },
            { time: "09:30 AM", task: "Kiln Pyrolysis Run", farmer: "Batch B-0142 (Kiln K-001)", status: "in-progress", action: () => setActiveScreen('kiln') },
            { time: "11:30 AM", task: "Water Quench & Sampling", farmer: "Sample S-1183 (Eurofins)", status: "upcoming", action: () => setActiveScreen('kiln') },
            { time: "01:00 PM", task: "QR Sealing & Dispatch", farmer: "Batch B-0142 Sealing", status: "upcoming", action: () => setActiveScreen('qr') },
            { time: "03:30 PM", task: "Soil Biochar Application", farmer: "Kuldeep Sandhu (F-0089)", status: "upcoming", action: () => setActiveScreen('route') }
          ].map((item, i) => (
            <div 
              key={i} 
              onClick={item.action}
              className={`rounded-xl p-3.5 border flex items-center justify-between cursor-pointer transition-all hover:border-[#10B981] ${
                item.status === 'done' ? 'bg-[#0B1914] border-[#132E27] opacity-60' :
                item.status === 'in-progress' ? 'bg-[#132E27] border-[#F59E0B] shadow-md ring-1 ring-[#F59E0B]/30' :
                'bg-[#132E27]/70 border-[#1a3f35]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  item.status === 'done' ? 'bg-[#0B1914] text-[#10B981]' :
                  item.status === 'in-progress' ? 'bg-[#F59E0B] text-white animate-pulse' :
                  'bg-[#1a3f35] text-[#94A3B8]'
                }`}>
                  {item.task.includes("Intake") ? <Package size={18} /> : item.task.includes("Kiln") || item.task.includes("Quench") ? <Flame size={18} /> : item.task.includes("QR") ? <QrCode size={18} /> : <MapPin size={18} />}
                </div>
                <div>
                  <p className={`font-bold text-xs ${item.status === 'done' ? 'text-[#94A3B8]' : 'text-white'}`}>{item.task}</p>
                  <p className="text-[#94A3B8] text-[11px] mt-0.5">{item.farmer}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-mono font-bold ${item.status === 'in-progress' ? 'text-[#F59E0B]' : 'text-[#64748B]'}`}>{item.time}</p>
                {item.status === 'done' ? (
                  <CheckCircle size={14} className="text-[#10B981] inline mt-1" />
                ) : (
                  <ChevronRight size={14} className="text-[#64748B] inline mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 2. Batch Intake Screen
  const IntakeScreen = () => (
    <div className="p-4 space-y-4 pb-8 bg-[#0B1914]">
      {intakeConfirmed && (
        <div className="bg-[#10B981] text-[#0B1914] p-3.5 rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle size={20} className="shrink-0" />
            <span className="font-bold text-xs">Biomass Intake Logged: {intakeWeight}kg (Farmer F-0042)</span>
          </div>
          <button 
            onClick={() => setActiveScreen('kiln')}
            className="px-2.5 py-1 bg-[#0B1914] text-[#10B981] font-bold text-[10px] rounded-lg"
          >
            Start Kiln →
          </button>
        </div>
      )}

      <div className="bg-[#132E27] p-4 rounded-xl border border-[#1a3f35]">
        <label className="text-[#94A3B8] text-xs font-bold uppercase block mb-1.5">Enrolled Farmer</label>
        <div className="bg-[#0B1914] p-3 rounded-lg flex items-center justify-between border border-[#1a3f35]">
          <div>
            <span className="text-white text-sm font-bold">Amrit Singh (F-0042)</span>
            <p className="text-[11px] text-[#94A3B8]">Sangrur Cluster · 2.5 Acres Enrolled</p>
          </div>
          <Search className="text-[#64748B]" size={18} />
        </div>
      </div>

      <div className="bg-[#132E27] p-5 rounded-xl border border-[#1a3f35] text-center">
        <label className="text-[#94A3B8] text-xs font-bold uppercase block mb-3">Stubble Intake Weight (kg)</label>
        <div className="flex items-center justify-center space-x-4">
          <button 
            className="w-12 h-12 rounded-full bg-[#1a3f35] hover:bg-[#224f43] flex items-center justify-center text-white active:scale-95 transition-all"
            onClick={() => setIntakeWeight(w => Math.max(10, w - 5))}
          >
            <Minus size={20} />
          </button>
          <div className="text-5xl font-mono text-[#10B981] font-black bg-[#0B1914] px-6 py-2 rounded-xl border-2 border-[#1a3f35] min-w-[140px]">
            {intakeWeight}
          </div>
          <button 
            className="w-12 h-12 rounded-full bg-[#1a3f35] hover:bg-[#224f43] flex items-center justify-center text-white active:scale-95 transition-all"
            onClick={() => setIntakeWeight(w => w + 5)}
          >
            <Plus size={20} />
          </button>
        </div>
        <p className="text-[11px] text-[#94A3B8] mt-3">Moisture Content: <span className="text-[#10B981] font-bold">11.4% (Pass &lt; 15%)</span></p>
      </div>

      <div className="bg-[#0B1914] p-3.5 rounded-xl border border-[#1a3f35] flex items-center space-x-3">
        <Lock className="text-[#F59E0B]" size={20} />
        <div className="text-[11px] text-[#94A3B8] space-y-0.5">
          <p><span className="text-white font-medium">GPS Coordinates:</span> 30.9012° N, 75.8573° E (±2m)</p>
          <p><span className="text-white font-medium">Timestamp:</span> Kharif 2025 · 09:41:20 IST</p>
          <p><span className="text-white font-medium">Operator Auth:</span> {loggedInCoordinator.id}</p>
        </div>
      </div>

      <button 
        onClick={() => setIntakeConfirmed(true)}
        className="w-full bg-[#10B981] hover:bg-[#059669] text-[#0B1914] font-black text-base py-4 rounded-xl shadow-lg flex items-center justify-center active:scale-95 transition-all cursor-pointer"
      >
        <Check size={22} className="mr-2 stroke-[3]" />
        Confirm Stubble Intake
      </button>
    </div>
  );

  // 3. Kiln Run Monitor Screen (Fully Scrollable & Interactive Quench)
  const KilnScreen = () => (
    <div className="p-4 space-y-4 pb-12 bg-[#0B1914]">
      {/* Batch Header Bar */}
      <div className="flex justify-between items-center bg-[#132E27] p-3.5 rounded-xl border border-[#1a3f35]">
        <div>
          <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">Active Pyrolysis Unit</span>
          <span className="text-white font-bold text-sm">Batch #B-0142 · Kiln {assignedKiln.id}</span>
        </div>
        <div className={`px-2.5 py-1 text-xs font-black rounded-lg uppercase tracking-wider ${
          quenchLogged 
            ? 'bg-[#3B82F6] text-white shadow-xs' 
            : 'bg-[#F59E0B] text-[#0B1914] animate-pulse'
        }`}>
          {quenchLogged ? 'Quenched (Cooling)' : 'Pyrolysis (623°C)'}
        </div>
      </div>

      {/* Quench Verified Banner */}
      {quenchLogged && (
        <div className="bg-[#1E3A8A]/80 border border-[#3B82F6] p-4 rounded-2xl text-white shadow-lg space-y-2 animate-in fade-in">
          <div className="flex items-center space-x-2 text-[#60A5FA]">
            <Droplet size={20} className="text-[#60A5FA] shrink-0" />
            <span className="font-black text-sm">Water Quench Logged Successfully!</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            150L water injected. Reaction extinguished. Core temperature safely dropped from <span className="font-bold text-[#F59E0B]">623°C</span> to <span className="font-bold text-[#60A5FA]">85°C</span>.
          </p>
          <div className="pt-2 flex items-center justify-between border-t border-blue-800/60">
            <button 
              onClick={handleResetQuench}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 underline"
            >
              <RotateCcw size={12} /> Reset Status
            </button>
            <button 
              onClick={() => setActiveScreen('qr')}
              className="px-3 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-sm"
            >
              Proceed to Seal Sample <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Timer & Core Controls */}
      <div className="bg-[#132E27] p-5 rounded-2xl border border-[#1a3f35] text-center relative overflow-hidden shadow-xs">
        <h3 className="text-[#94A3B8] font-bold uppercase text-xs mb-2">Cycle Elapsed Time</h3>
        <div className="text-4xl font-mono text-white font-black tracking-widest">{formatTime(kilnTimer)}</div>
        <p className="text-[#64748B] text-xs mt-1">Pyrolysis Target: 02:30:00 (600°C - 700°C)</p>
        
        <div className="mt-4 flex gap-2">
          <button 
            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
              isKilnRunning ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]' : 'bg-[#10B981] text-[#0B1914] hover:bg-[#059669]'
            }`}
            onClick={() => setIsKilnRunning(!isKilnRunning)}
          >
            {isKilnRunning ? <><Pause size={16} className="mr-1.5" /> Pause Flame</> : <><Play size={16} className="mr-1.5" /> Resume Cycle</>}
          </button>
        </div>
      </div>

      {/* Real-time Temperature Telemetry Card */}
      <div className="bg-[#132E27] p-4 rounded-2xl border border-[#1a3f35] shadow-xs">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-[#94A3B8] font-bold uppercase text-xs">Core Thermocouple</h3>
            <span className="text-[10px] text-[#64748B]">Sensor TC-04 · Type K</span>
          </div>
          <span className={`text-3xl font-black font-mono ${quenchLogged ? 'text-[#60A5FA]' : 'text-[#F59E0B]'}`}>
            {currentTemp}°C
          </span>
        </div>
        
        {/* SVG Pyrolysis Telemetry Curve */}
        <div className="h-28 bg-[#0B1914] rounded-xl border border-[#1a3f35] relative p-2 overflow-hidden">
          {/* Target band (500-700°C) */}
          <div className="absolute left-0 right-0 top-[20%] bottom-[35%] bg-[#10B981]/15 z-0"></div>
          
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0 z-10">
            <line x1="0" y1="20" x2="100" y2="20" stroke="#1a3f35" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="65" x2="100" y2="65" stroke="#1a3f35" strokeWidth="1" strokeDasharray="3 3" />
            
            {quenchLogged ? (
              /* Temperature plunge after quench */
              <polyline 
                points="0,85 15,65 30,35 45,28 60,25 75,26 82,24 88,75 100,85" 
                fill="none" 
                stroke="#60A5FA" 
                strokeWidth="3"
              />
            ) : (
              /* Steady steady-state pyrolysis */
              <polyline 
                points="0,85 15,65 30,35 45,28 60,25 75,26 88,24 100,24" 
                fill="none" 
                stroke="#F59E0B" 
                strokeWidth="3"
              />
            )}
            <circle cx="100" cy={quenchLogged ? "85" : "24"} r="4" fill={quenchLogged ? "#60A5FA" : "#F59E0B"} />
          </svg>
          <div className="absolute right-2 top-2 text-[9px] text-[#10B981] font-bold bg-[#0B1914]/90 px-1.5 py-0.5 rounded border border-[#10B981]/40">
            EBC TARGET: 500-700°C
          </div>
        </div>
      </div>

      {/* Water Quench Action Section (Prominent & Unclipped) */}
      <div className="bg-[#0B1914] p-4 rounded-2xl border border-[#1a3f35] space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#94A3B8] font-bold uppercase">Quench Water Volume:</span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setQuenchLitres(l => Math.max(50, l - 10))}
              className="w-6 h-6 rounded bg-[#132E27] text-white flex items-center justify-center font-bold text-xs"
            >
              -
            </button>
            <span className="text-white font-mono font-bold text-sm">{quenchLitres} L</span>
            <button 
              onClick={() => setQuenchLitres(l => Math.min(300, l + 10))}
              className="w-6 h-6 rounded bg-[#132E27] text-white flex items-center justify-center font-bold text-xs"
            >
              +
            </button>
          </div>
        </div>

        <button 
          onClick={handleLogQuench}
          disabled={quenchLogged}
          className={`w-full font-black text-base py-4 rounded-xl shadow-xl flex items-center justify-center transition-all cursor-pointer ${
            quenchLogged 
              ? 'bg-[#1E3A8A] text-[#93C5FD] opacity-75 cursor-not-allowed'
              : 'bg-[#3B82F6] hover:bg-[#2563EB] active:scale-95 text-white'
          }`}
        >
          <Droplet size={22} className="mr-2 fill-current" />
          {quenchLogged ? '✓ Quench Logged (150L @ 85°C)' : 'Log Water Quench (Extinguish Batch)'}
        </button>
      </div>

      {/* Next Step Link */}
      <div className="pt-2">
        <button 
          onClick={() => setActiveScreen('qr')}
          className="w-full bg-[#132E27] hover:bg-[#1a3f35] border border-[#1a3f35] text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5"
        >
          <QrCode size={16} className="text-[#10B981]" />
          <span>Go to QR Sealing & Lab Chain of Custody</span>
          <ChevronRight size={14} className="text-[#64748B]" />
        </button>
      </div>
    </div>
  );

  // 4. QR Sample Sealing Screen
  const QrScreen = () => (
    <div className="p-4 space-y-4 pb-8 bg-[#0B1914]">
      {qrScanned && (
        <div className="bg-[#10B981] text-[#0B1914] p-4 rounded-xl flex items-start space-x-3 shadow-lg">
          <CheckCircle size={22} className="shrink-0 mt-0.5 text-[#0B1914]" />
          <div>
            <p className="font-bold text-sm">Batch #B-0142 Sealed & Logged</p>
            <p className="text-xs opacity-90 mt-0.5">Sample #S-1183 linked to Eurofins Lab testing queue.</p>
          </div>
        </div>
      )}

      <div className="bg-[#132E27] rounded-xl border border-[#1a3f35] overflow-hidden">
        <div className="bg-[#1a3f35] p-3 border-b border-[#132E27] flex justify-between items-center">
          <span className="text-white font-bold text-xs uppercase tracking-wider">Batch Summary</span>
          <span className="text-[#10B981] font-mono font-bold text-sm">Batch #B-0142</span>
        </div>
        <div className="p-3.5 grid grid-cols-3 gap-2 text-center divide-x divide-[#1a3f35]">
          <div>
            <p className="text-[#94A3B8] text-[10px] uppercase font-bold">Intake</p>
            <p className="text-white font-mono font-bold text-base">125 kg</p>
          </div>
          <div>
            <p className="text-[#94A3B8] text-[10px] uppercase font-bold">Biochar Out</p>
            <p className="text-white font-mono font-bold text-base">{outputWeight} kg</p>
          </div>
          <div>
            <p className="text-[#94A3B8] text-[10px] uppercase font-bold">Yield</p>
            <p className="text-[#10B981] font-mono font-bold text-base">{((outputWeight / 125) * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="bg-[#132E27] p-5 rounded-xl border border-[#1a3f35] text-center">
        <label className="text-[#94A3B8] text-xs font-bold uppercase block mb-3">Extracted Biochar Weight (kg)</label>
        <div className="flex items-center justify-center space-x-5">
          <button 
            className="w-11 h-11 rounded-full bg-[#1a3f35] hover:bg-[#224f43] flex items-center justify-center text-white"
            onClick={() => setOutputWeight(w => Math.max(10, w - 1))}
          >
            <Minus size={18} />
          </button>
          <div className="text-4xl font-mono text-white font-bold bg-[#0B1914] px-5 py-2 rounded-xl border-2 border-[#1a3f35] min-w-[120px]">
            {outputWeight}
          </div>
          <button 
            className="w-11 h-11 rounded-full bg-[#1a3f35] hover:bg-[#224f43] flex items-center justify-center text-white"
            onClick={() => setOutputWeight(w => w + 1)}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="bg-[#F8FAFC] p-5 rounded-2xl text-center shadow-lg relative">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[#0F172A] font-extrabold text-sm">Eurofins Chain-of-Custody</span>
          <span className="text-xs font-mono font-bold text-[#059669] bg-green-100 px-2 py-0.5 rounded">Sample: S-1183</span>
        </div>
        
        {/* Visual QR Code Box */}
        <div className="w-40 h-40 mx-auto bg-white p-2 border-4 border-[#0F172A] flex flex-wrap content-start rounded-xl shadow-inner relative">
          <div className="absolute w-9 h-9 border-4 border-black left-2 top-2 flex items-center justify-center"><div className="w-4 h-4 bg-black"></div></div>
          <div className="absolute w-9 h-9 border-4 border-black right-2 top-2 flex items-center justify-center"><div className="w-4 h-4 bg-black"></div></div>
          <div className="absolute w-9 h-9 border-4 border-black left-2 bottom-2 flex items-center justify-center"><div className="w-4 h-4 bg-black"></div></div>
          
          {Array.from({length: 120}).map((_, i) => (
            <div key={i} className={`w-[12px] h-[12px] ${(i % 3 === 0 || i % 7 === 0 || i % 11 === 0) ? 'bg-black' : 'bg-transparent'}`}></div>
          ))}
        </div>
        
        <button 
          className={`mt-4 w-full font-bold text-sm py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            qrScanned 
              ? 'bg-[#10B981] text-[#0B1914]' 
              : 'bg-[#0F172A] text-white hover:bg-slate-800 active:scale-95'
          }`}
          onClick={() => setQrScanned(true)}
        >
          <QrCode size={18} />
          <span>{qrScanned ? '✓ Bag QR Tag Affixed & Sealed' : 'Scan Tamper-Evident Bag Tag'}</span>
        </button>
      </div>
    </div>
  );

  // 5. History Screen
  const HistoryScreen = () => (
    <div className="p-4 space-y-3 pb-8 bg-[#0B1914]">
      <div className="bg-[#1a3f35] text-white p-3 rounded-xl flex items-center justify-between border border-[#10B981]/40">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="text-[#10B981]" size={18} />
          <span className="font-bold text-xs">dMRV Digital Ledger Synced</span>
        </div>
        <span className="text-[10px] bg-[#0B1914] px-2 py-0.5 rounded text-[#10B981] font-mono">10 Batches</span>
      </div>

      <div className="space-y-2.5">
        {assignedBatches.map((batch, i) => (
          <div key={batch.batchId || i} className="bg-[#132E27] p-3.5 rounded-xl border border-[#1a3f35]">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-white font-bold text-sm">{batch.batchId}</h4>
                <p className="text-[#94A3B8] text-[11px] mt-0.5">
                  {batch.startTime ? new Date(batch.startTime).toLocaleDateString() : 'Oct 2025'} · Kiln {assignedKiln.id}
                </p>
              </div>
              <div className="flex items-center space-x-1 text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-full text-[10px] font-bold">
                <Check size={12} /> <span>Audited</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-[#0B1914] p-2 rounded-lg text-center border border-[#1a3f35]/50">
                <p className="text-[#64748B] text-[9px] uppercase font-bold">Biomass Intake</p>
                <p className="text-white font-mono font-bold text-xs">{batch.inputWeight || 125} kg</p>
              </div>
              <div className="bg-[#0B1914] p-2 rounded-lg text-center border border-[#1a3f35]/50">
                <p className="text-[#64748B] text-[9px] uppercase font-bold">Biochar Yield</p>
                <p className="text-[#10B981] font-mono font-bold text-xs">{batch.yieldPercentage || 28.5}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#07110e] flex items-center justify-center p-0 sm:p-4">
      {/* Phone Frame */}
      <div className="w-full sm:w-[385px] h-[100dvh] sm:h-[820px] bg-black sm:rounded-[3rem] sm:shadow-2xl relative overflow-hidden sm:border-[8px] sm:border-neutral-800 flex flex-col">
        
        {/* Notch on Desktop */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-black rounded-b-2xl z-50"></div>

        {/* Top Status Bar */}
        <StatusBar />
        
        {/* App Bar Header */}
        <AppHeader 
          title={
            activeScreen === 'route' ? 'Daily Schedule' :
            activeScreen === 'intake' ? 'Biomass Intake' :
            activeScreen === 'kiln' ? 'Kiln Monitor' :
            activeScreen === 'qr' ? 'Seal & Sampling' :
            'Batch History'
          } 
        />

        {/* Content Area - Scrollable Container */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-[#0B1914] relative">
          {activeScreen === 'route' && <RouteScreen />}
          {activeScreen === 'intake' && <IntakeScreen />}
          {activeScreen === 'kiln' && <KilnScreen />}
          {activeScreen === 'qr' && <QrScreen />}
          {activeScreen === 'history' && <HistoryScreen />}
        </div>

        {/* Bottom Navigation Bar - Fully Fixed in Flex Layout (Never overlaps screen content) */}
        <div className="bg-[#05100B] h-18 shrink-0 border-t border-[#132E27] flex justify-around items-center px-2 py-2 z-40">
          {[
            { id: 'route', icon: MapPin, label: 'Schedule' },
            { id: 'intake', icon: Package, label: 'Intake' },
            { id: 'kiln', icon: Flame, label: 'Kiln' },
            { id: 'qr', icon: QrCode, label: 'Sampling' },
            { id: 'history', icon: History, label: 'History' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveScreen(tab.id)}
              className={`flex flex-col items-center justify-center w-16 space-y-1 p-1 rounded-xl transition-all cursor-pointer ${
                activeScreen === tab.id 
                  ? 'text-[#10B981] bg-[#132E27]/60' 
                  : 'text-[#64748B] hover:text-slate-300'
              }`}
            >
              <tab.icon size={20} className={activeScreen === tab.id ? 'stroke-[2.5]' : ''} />
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldOperatorApp;
