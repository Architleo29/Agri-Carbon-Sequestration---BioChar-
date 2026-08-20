import React, { useState, useEffect } from 'react';
import { 
  Home, MapPin, Flame, Wallet, Menu, CheckCircle, Bell, ArrowRight, 
  Activity, Calendar, PlayCircle, Phone, Leaf, CloudRain, Sun, 
  WifiOff, RefreshCw, Zap, BadgeCheck, Users, IndianRupee, Image as ImageIcon,
  Check, ChevronRight, MessageCircle, AlertTriangle, Sparkles, Volume2, ShieldCheck, Compass
} from 'lucide-react';
import { farmers, kilns, clusters as fpos, kpis } from '../data/mockDataset.js';
import translations from '../data/vernacular.js';

const FarmerApp = () => {
  const [lang, setLang] = useState(null);
  const [activeScreen, setActiveScreen] = useState('home');
  const [isOffline, setIsOffline] = useState(false);

  // Fallback to farmer index 42 or first
  const farmer = farmers[42] || farmers[0];
  const fpo = fpos.find(f => f.name === farmer.cluster) || fpos[0];
  const kiln = kilns.find(k => k.cluster === fpo.cluster) || kilns[0];

  // Helper for translations
  const t = (key) => {
    if (!key) return '';
    if (!lang || !translations || !translations[lang]) return key;
    return translations[lang][key] || translations['en']?.[key] || key;
  };

  const setLanguage = (selectedLang) => {
    setLang(selectedLang);
    setActiveScreen('home');
  };

  // ── Language Selection Screen ──
  if (!lang) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen min-h-[100dvh] bg-[#07110e] p-0 sm:p-4 font-sans select-none">
        <div className="relative w-full sm:w-[390px] h-[100dvh] sm:h-[844px] bg-gradient-to-b from-[#0B1914] via-[#071510] to-[#040E0A] text-white sm:rounded-[44px] sm:shadow-2xl overflow-hidden sm:border-[8px] sm:border-neutral-800 flex flex-col justify-between p-6">
          
          {/* Subtle Ambient Glow Aura */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-black rounded-b-2xl z-50"></div>

          {/* Header & Logo */}
          <div className="relative z-10 flex flex-col items-center pt-8 text-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#059669] to-[#34D399] p-0.5 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
                <div className="w-full h-full bg-[#0B1914] rounded-[22px] flex items-center justify-center">
                  <Leaf className="w-10 h-10 text-[#34D399] animate-pulse" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#10B981] border-2 border-[#0B1914]"></span>
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#132E27] border border-[#10B981]/40 text-[#10B981] text-[11px] font-black tracking-wide mb-2 shadow-xs">
                <Sparkles size={12} />
                <span>Kharif 2025 · Verified DBT Portal</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white">Punjab Agri-Carbon</h1>
              <p className="text-xs text-slate-400 mt-1 max-w-[260px]">
                Choose your native language / अपनी भाषा चुनें / ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ
              </p>
            </div>
          </div>

          {/* Language Cards */}
          <div className="relative z-10 space-y-3 w-full my-auto">
            {[
              { id: 'en', title: 'English', sub: 'Default interface & reports', script: 'EN', flag: '🌐' },
              { id: 'hi', title: 'हिंदी (Hindi)', sub: 'उत्तर भारत क्षेत्रीय भाषा', script: 'हिं', flag: '🇮🇳' },
              { id: 'pa', title: 'ਪੰਜਾਬੀ (Punjabi)', sub: 'ਪੰਜਾਬ ਖੇਤਰੀ ਭਾਸ਼ਾ (ਗੁਰਮੁਖੀ)', script: 'ਪੰ', flag: '🌾' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setLanguage(item.id)}
                className="w-full p-4 rounded-2xl bg-[#0F261F]/80 hover:bg-[#153B2F] border border-[#1A4D3D] hover:border-[#10B981] transition-all flex items-center justify-between text-left group shadow-lg active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#132E27] border border-[#10B981]/30 flex items-center justify-center text-lg font-black text-[#10B981] group-hover:scale-105 transition-transform">
                    {item.script}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-white group-hover:text-[#34D399] transition-colors">{item.title}</span>
                      <span className="text-xs">{item.flag}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#132E27] flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-[#10B981] transition-all">
                  <ChevronRight size={18} />
                </div>
              </button>
            ))}
          </div>

          {/* Audio Accessibility Hint & Footer */}
          <div className="relative z-10 text-center pb-4 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F261F] border border-[#1A4D3D] text-[11px] text-slate-300 font-medium">
              <Volume2 size={14} className="text-[#10B981]" />
              <span>Voice support enabled for rural access</span>
            </div>
            <p className="text-[10px] text-slate-500">Supported by NABARD, FPO & Puro.earth dMRV</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Top Bar ──
  const renderTopBar = () => (
    <div className="bg-white/95 backdrop-blur-md pt-10 pb-3 px-4 shadow-xs z-40 relative flex justify-between items-center border-b border-slate-100">
      <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-900 rounded-b-2xl z-50"></div>
      
      {/* Weather & Sync Indicator */}
      <div className="flex items-center space-x-2 mt-1">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700">
          <Sun size={13} className="text-amber-500 animate-spin-slow" />
          <span>29°C · Sangrur</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-[#047857] bg-green-50 px-2 py-1 rounded-full border border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
          <span>Online</span>
        </div>
      </div>
      
      {/* Quick Language Switcher & Notification Bell */}
      <div className="flex items-center space-x-2 mt-1">
        <div className="bg-slate-100 p-0.5 rounded-xl flex text-[10px] font-black border border-slate-200">
          {['en', 'hi', 'pa'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-0.5 rounded-lg transition-all ${lang === l ? 'bg-[#047857] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setActiveScreen('notifications')} 
          className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-700"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>
      </div>
    </div>
  );

  // ── Floating Native-Style Bottom Navigation Bar ──
  const renderBottomNav = () => (
    <div className="p-3 bg-gradient-to-t from-white via-white to-transparent shrink-0">
      <div className="bg-[#0B1914] text-white px-3 py-2 rounded-2xl shadow-2xl border border-[#1a3f35] flex justify-around items-center">
        <NavItem icon={Home} label={t('Home')} id="home" />
        <NavItem icon={MapPin} label={t('My Farm')} id="farm" />
        <NavItem icon={Flame} label={t('Kiln')} id="kiln" />
        <NavItem icon={Wallet} label={t('Earnings')} id="earnings" />
        <NavItem icon={Menu} label={t('More')} id="more" />
      </div>
    </div>
  );

  const NavItem = ({ icon: Icon, label, id }) => {
    const isActive = activeScreen === id;
    return (
      <button 
        onClick={() => setActiveScreen(id)}
        className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all min-w-[54px] cursor-pointer ${
          isActive 
            ? 'bg-[#10B981] text-white font-bold shadow-md scale-105' 
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Icon size={18} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] font-bold mt-0.5 leading-tight">{label}</span>
      </button>
    );
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen farmer={farmer} fpo={fpo} t={t} setActiveScreen={setActiveScreen} />;
      case 'farm':
        return <FarmScreen farmer={farmer} t={t} />;
      case 'kiln':
        return <KilnScreen kiln={kiln} t={t} />;
      case 'earnings':
        return <EarningsScreen farmer={farmer} t={t} />;
      case 'notifications':
        return <NotificationsScreen t={t} />;
      case 'more':
        return <MoreMenuScreen t={t} setActiveScreen={setActiveScreen} setLang={setLang} />;
      case 'community':
        return <CommunityScreen fpo={fpo} t={t} />;
      case 'help':
        return <HelpScreen t={t} />;
      default:
        return <HomeScreen farmer={farmer} fpo={fpo} t={t} setActiveScreen={setActiveScreen} />;
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen min-h-[100dvh] bg-[#07110e] sm:bg-[#F0FDF4] p-0 sm:p-4 font-sans select-none">
      <div className="relative w-full sm:w-[390px] h-[100dvh] sm:h-[844px] bg-slate-50 sm:rounded-[44px] sm:shadow-2xl sm:border-[8px] sm:border-neutral-800 flex flex-col overflow-hidden">
        {renderTopBar()}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 relative min-h-0">
          {renderScreen()}
        </div>
        {renderBottomNav()}
      </div>
    </div>
  );
};

// ── Screen Sub-Components ──

const HomeScreen = ({ farmer, fpo, t, setActiveScreen }) => {
  return (
    <div className="p-4 space-y-4 pb-12">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1914] via-[#0D241C] to-[#047857] p-5 text-white shadow-xl border border-[#1A4D3D]">
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#10B981]/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#34D399] bg-[#132E27] px-2.5 py-0.5 rounded-full border border-[#10B981]/40">
              🌾 Kharif 2025 Season
            </span>
            <h2 className="text-xl font-black text-white mt-2 leading-tight">
              {t('Hello')}, {farmer.name}
            </h2>
            <p className="text-xs text-slate-300 font-medium mt-0.5">{fpo.name} • {farmer.village}</p>
          </div>
          
          <div className="w-12 h-12 rounded-2xl bg-[#132E27] border border-[#10B981]/40 flex items-center justify-center shadow-inner">
            <BadgeCheck size={26} className="text-[#34D399]" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></div>
            <span className="text-slate-200 font-semibold">{t('Stubble Collected')}</span>
          </div>
          <span className="font-mono font-black text-[#34D399]">{farmer.stubbleCollectedT} Tonnes</span>
        </div>
      </div>

      {/* Season Timeline Stepper */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">{t('Season Progress')}</h4>
          <span className="text-[11px] font-bold text-[#047857] bg-green-50 px-2 py-0.5 rounded-full border border-green-200">Step 3 of 5</span>
        </div>
        
        <div className="flex justify-between relative px-2 pt-2">
          {/* Connecting Track */}
          <div className="absolute top-6 left-6 right-6 h-1 bg-slate-100 rounded-full -z-0"></div>
          <div className="absolute top-6 left-6 w-1/2 h-1 bg-[#10B981] rounded-full -z-0"></div>
          
          <ProgressStep icon={<Check size={14} />} label={t('Enrolled')} active={true} completed={true} />
          <ProgressStep icon={<Leaf size={14} />} label={t('Collected')} active={true} completed={true} />
          <ProgressStep icon={<Flame size={14} />} label={t('Kiln')} active={true} completed={false} />
          <ProgressStep icon={<Zap size={14} />} label={t('Biochar')} active={false} completed={false} />
          <ProgressStep icon={<IndianRupee size={14} />} label={t('Paid')} active={false} completed={false} />
        </div>
      </div>

      {/* Enrolled Land & DBT Rate Bento Card */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">{t('Enrolled Area')}</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">
              {farmer.enrolledAcres || 2.5} {t('Acres')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold text-slate-500 uppercase">{t('Zero-Burn Verified')}</p>
            <span className="inline-flex items-center text-xs font-black text-[#047857] bg-green-50 px-2.5 py-1 rounded-full mt-0.5 border border-[#10B981]">
              <BadgeCheck className="w-3.5 h-3.5 mr-1 text-[#10B981]" /> {t('Verified')} ✓
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-slate-500 font-medium">{t('Rate: ₹9,100 / acre')}</span>
          <span className="font-mono font-black text-base text-[#047857]">
            ₹{((farmer.enrolledAcres || 2.5) * 9100).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Quick Action Button */}
      <button 
        onClick={() => setActiveScreen('farm')}
        className="w-full h-14 bg-[#047857] hover:bg-[#065F46] text-white rounded-2xl flex items-center justify-center space-x-3 text-base font-extrabold shadow-lg shadow-emerald-800/20 active:scale-98 transition-all cursor-pointer"
      >
        <MapPin size={20} />
        <span>{t('Open Land Area Calculator')}</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

const ProgressStep = ({ icon, label, active, completed }) => (
  <div className="flex flex-col items-center space-y-1.5 z-10">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all shadow-xs
      ${completed ? 'bg-[#10B981] text-white ring-4 ring-green-100' : active ? 'bg-[#0B1914] text-[#10B981] ring-4 ring-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold text-center ${active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
  </div>
);

const FarmScreen = ({ farmer, t }) => {
  const [acres, setAcres] = useState(farmer.enrolledAcres || 2.5);

  const ratePerAcre = 9100;
  const safeAcres = Math.max(0.1, Number(acres) || 0);
  const totalPayout = safeAcres * ratePerAcre;
  const carbonCash = totalPayout * 0.65;
  const fertilizerSavings = totalPayout * 0.35;
  const stubbleTonnes = safeAcres * 2.5;
  const biocharTonnes = safeAcres * 0.7;

  // Map Polygon Dynamic Boundary Scaling
  const factor = Math.min(1.3, Math.max(0.6, safeAcres / 2.5));
  const polyPoints = `${Math.round(40 * (2 - factor))},${Math.round(35 / factor)} ${Math.round(260 * factor)},${Math.round(30 / factor)} ${Math.round(310 * factor)},${Math.round(125 * factor)} ${Math.round(80 * (2 - factor))},${Math.round(145 * factor)}`;

  return (
    <div className="p-4 space-y-4 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900">{t('My Farm')}</h2>
          <p className="text-xs text-slate-500 font-medium">{farmer.village} • {farmer.cluster}</p>
        </div>
        <span className="text-[11px] text-[#047857] font-extrabold bg-green-50 px-3 py-1 rounded-full border border-[#10B981]">
          ₹9,100 / Acre Guaranteed
        </span>
      </div>
      
      {/* Interactive HUD Satellite Viewfinder */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/80">
        <div className="h-48 bg-[#0B1914] relative overflow-hidden">
          <img 
            src="/pre_harvest.jpg" 
            alt="Plot Boundary" 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
          
          {/* Cyber HUD Corner Reticles */}
          <div className="absolute top-2 left-2 text-[#10B981] font-mono text-[9px] font-bold">LAT: 30.2458°N</div>
          <div className="absolute top-2 right-2 text-[#10B981] font-mono text-[9px] font-bold">LON: 75.8421°E</div>
          
          {/* Dynamic Farm polygon highlight */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <polygon 
              points={polyPoints} 
              fill="rgba(16, 185, 129, 0.4)" 
              stroke="#10B981" 
              strokeWidth="3"
              strokeDasharray="4 2"
              className="transition-all duration-300"
            />
          </svg>

          {/* Centered Plot Beacon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <div className="w-4 h-4 bg-[#10B981] rounded-full animate-ping absolute"></div>
            <MapPin className="w-8 h-8 text-[#10B981] drop-shadow-lg z-10" />
            <span className="text-[11px] font-mono font-black text-white bg-[#0B1914]/90 px-2.5 py-0.5 rounded-full mt-1 border border-[#10B981]/50 shadow-md">
              {safeAcres} {t('Acres')}
            </span>
          </div>
        </div>

        {/* Acreage Input & Steppers */}
        <div className="p-4 bg-white border-t border-slate-100 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-black text-slate-700 uppercase">
              {t('Enter Land Area (Acres)')}
            </label>
            <span className="text-xs font-mono font-black text-[#047857]">
              ₹{(safeAcres * 9100).toLocaleString('en-IN')} Total
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input 
                type="number"
                step="0.1"
                min="0.1"
                max="50"
                value={acres}
                onChange={(e) => setAcres(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-base font-black text-slate-900 focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/30"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                {t('Acres')}
              </span>
            </div>

            <div className="flex space-x-1">
              {[
                { label: '-0.5', delta: -0.5 },
                { label: '+0.5', delta: 0.5 },
                { label: '+1.0', delta: 1.0 },
              ].map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => setAcres(a => Math.max(0.5, +(parseFloat(a || 0) + btn.delta).toFixed(1)))}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-xs font-black text-slate-700 rounded-xl transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-1">
            {[1.0, 2.5, 4.0, 5.0, 8.0, 10.0].map((preset) => (
              <button
                key={preset}
                onClick={() => setAcres(preset)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  acres === preset 
                    ? 'bg-[#047857] text-white shadow-xs' 
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {preset} ac
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Payout Card */}
      <div className="bg-gradient-to-br from-[#0B1914] via-[#047857] to-[#059669] rounded-3xl p-5 text-white shadow-xl space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-green-100 uppercase tracking-wider">{t('Estimated Total Payout')}</span>
            <span className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full text-white font-bold">{t('Direct Bank Transfer (PFMS)')}</span>
          </div>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-2xl font-black text-[#34D399]">₹</span>
            <span className="text-4xl font-black tracking-tight">{totalPayout.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20">
          <div className="bg-black/20 p-3 rounded-2xl backdrop-blur-xs">
            <p className="text-[10px] font-bold text-green-200 uppercase">{t('Carbon Direct Cash')} (65%)</p>
            <p className="text-base font-black text-white mt-0.5">₹{Math.round(carbonCash).toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-black/20 p-3 rounded-2xl backdrop-blur-xs">
            <p className="text-[10px] font-bold text-green-200 uppercase">{t('Fertilizer & Water Savings')} (35%)</p>
            <p className="text-base font-black text-white mt-0.5">₹{Math.round(fertilizerSavings).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Biomass & Biochar Output Calculations */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <Leaf className="w-4 h-4 text-[#10B981]" />
            <span className="text-xs font-bold">{t('Estimated Stubble Yield')}</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{stubbleTonnes.toFixed(1)} <span className="text-xs text-slate-400 font-normal">t</span></p>
          <span className="text-[10px] font-semibold text-slate-500 mt-1">@ 2.5 {t('tPerAcre')}</span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold">{t('Biochar to be Applied')}</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{biocharTonnes.toFixed(1)} <span className="text-xs text-slate-400 font-normal">t</span></p>
          <span className="text-[10px] font-semibold text-slate-500 mt-1">@ 0.7 {t('tPerAcre')} (28% yield)</span>
        </div>
      </div>
    </div>
  );
};

const KilnScreen = ({ kiln, t }) => {
  return (
    <div className="p-4 space-y-4 pb-12">
      <h2 className="text-xl font-black text-slate-900">{t('Kiln Schedule')}</h2>

      <div className="bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] rounded-3xl p-5 border border-[#F59E0B]/60 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B] flex items-center justify-center shadow-xs">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#92400E] text-base">{t('Your Cluster Kiln')}</h3>
              <p className="text-xs text-amber-800/80 font-medium">Kiln {kiln.id}</p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-200 text-amber-900">
            {t(kiln.status)}
          </span>
        </div>

        <div className="space-y-2 text-xs pt-2 border-t border-amber-200/60 font-medium text-amber-900">
          <div className="flex justify-between">
            <span className="text-amber-800/80">{t('Location')}:</span>
            <span className="font-bold">{kiln.location.village} Hub</span>
          </div>
          <div className="flex justify-between">
            <span className="text-amber-800/80">{t('Coordinator')}:</span>
            <span className="font-bold">{kiln.coordinator}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
        <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">{t('Next Batch')}</h4>
        <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="bg-white p-3 rounded-2xl shadow-sm flex flex-col items-center min-w-[65px] border border-slate-200">
            <span className="text-xs text-red-600 font-black uppercase">Oct</span>
            <span className="text-2xl font-black text-slate-900">24</span>
          </div>
          <div>
            <h5 className="font-extrabold text-slate-900 text-sm">{t('Morning Shift')}</h5>
            <p className="text-xs text-slate-500 font-medium">08:00 AM - 02:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const EarningsScreen = ({ farmer, t }) => {
  return (
    <div className="p-4 space-y-4 pb-12">
      <h2 className="text-xl font-black text-slate-900">{t('Earnings & Payouts')}</h2>

      <div className="bg-gradient-to-br from-[#0B1914] via-[#047857] to-[#10B981] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <p className="text-green-100 text-xs font-bold uppercase tracking-wider">{t('Total Earned This Season')}</p>
        <div className="flex items-baseline space-x-1 my-2">
          <span className="text-2xl font-black text-[#34D399]">₹</span>
          <span className="text-4xl font-black tracking-tight">{((farmer.enrolledAcres || 2.5) * 9100).toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between items-center bg-black/25 px-3.5 py-2 rounded-xl backdrop-blur-xs text-xs">
          <span>{t('PFMS Status')}: <strong className="text-[#34D399]">Disbursed</strong></span>
          <span className="font-mono text-[10px] text-slate-300">UTR: 98421098</span>
        </div>
      </div>
    </div>
  );
};

const NotificationsScreen = ({ t }) => (
  <div className="p-4 space-y-3 pb-12">
    <h2 className="text-xl font-black text-slate-900 mb-2">{t('Notifications')}</h2>
    {[
      { title: t('Payment Received'), desc: t('₹1,500 credited to your account'), time: '2h ago', icon: IndianRupee, col: 'bg-green-100 text-green-700' },
      { title: t('Kiln Batch Scheduled'), desc: t('Your stubble is scheduled for Oct 24'), time: '1d ago', icon: Flame, col: 'bg-amber-100 text-amber-700' },
      { title: t('Verification Passed'), desc: t('Zero-burn verified via satellite'), time: '3d ago', icon: BadgeCheck, col: 'bg-blue-100 text-blue-700' },
    ].map((n, i) => {
      const Icon = n.icon;
      return (
        <div key={i} className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200/80 flex items-start space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.col}`}>
            <Icon size={18} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-black text-slate-900 text-xs">{n.title}</h4>
              <span className="text-[10px] font-bold text-slate-400">{n.time}</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">{n.desc}</p>
          </div>
        </div>
      );
    })}
  </div>
);

const CommunityScreen = ({ fpo, t }) => (
  <div className="p-4 space-y-4 pb-12">
    <h2 className="text-xl font-black text-slate-900">{fpo.name}</h2>
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-[#0B1914] text-white p-4 rounded-2xl border border-[#1a3f35]">
        <Users className="w-5 h-5 text-[#10B981] mb-2" />
        <p className="text-2xl font-black">100</p>
        <p className="text-xs text-slate-400">{t('Farmers')}</p>
      </div>
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <MapPin className="w-5 h-5 text-slate-600 mb-2" />
        <p className="text-2xl font-black text-slate-900">250</p>
        <p className="text-xs text-slate-500">{t('Acres')}</p>
      </div>
    </div>
  </div>
);

const HelpScreen = ({ t }) => (
  <div className="p-4 space-y-4 pb-12">
    <h2 className="text-xl font-black text-slate-900">{t('Help & Training')}</h2>
    <button className="w-full h-16 bg-[#047857] text-white rounded-2xl flex items-center justify-center space-x-3 shadow-lg active:scale-98 transition-all cursor-pointer font-black text-sm">
      <Phone size={20} />
      <span>{t('Call Support (Toll-Free)')}</span>
    </button>
  </div>
);

const MoreMenuScreen = ({ t, setActiveScreen, setLang }) => (
  <div className="p-4 space-y-3 pb-12">
    <h2 className="text-xl font-black text-slate-900 mb-3">{t('More')}</h2>
    <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200/80">
      <button 
        onClick={() => setActiveScreen('community')}
        className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-green-50 text-[#047857] rounded-xl flex items-center justify-center">
            <Users size={18} />
          </div>
          <span className="font-bold text-slate-900 text-xs">{t('My FPO Community')}</span>
        </div>
        <ChevronRight size={16} className="text-slate-400" />
      </button>
      <button 
        onClick={() => setLang(null)}
        className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
            <RefreshCw size={18} />
          </div>
          <span className="font-bold text-slate-900 text-xs">{t('Change Language')}</span>
        </div>
        <ChevronRight size={16} className="text-slate-400" />
      </button>
    </div>
  </div>
);

export default FarmerApp;
