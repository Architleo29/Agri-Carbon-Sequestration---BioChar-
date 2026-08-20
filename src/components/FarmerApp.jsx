import React, { useState, useEffect } from 'react';
import { 
  Home, MapPin, Flame, Wallet, Menu, CheckCircle, Bell, ArrowRight, 
  Activity, Calendar, PlayCircle, Phone, Leaf, CloudRain, Sun, 
  WifiOff, RefreshCw, Zap, BadgeCheck, Users, IndianRupee, Image as ImageIcon,
  Check, ChevronRight, MessageCircle, AlertTriangle
} from 'lucide-react';
import { farmers, kilns, clusters as fpos, kpis } from '../data/mockDataset.js';
import translations from '../data/vernacular.js';

const FarmerApp = () => {
  const [lang, setLang] = useState(null);
  const [activeScreen, setActiveScreen] = useState('home');
  const [isOffline, setIsOffline] = useState(false);

  // Fallback to first farmer if index 42 doesn't exist
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

  if (!lang) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen bg-[#F0FDF4] p-4 font-sans">
        <div className="relative w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-slate-900 flex flex-col items-center justify-center p-6">
          <div className="absolute top-0 w-[150px] h-[30px] bg-slate-900 rounded-b-[20px] z-50"></div>
          
          <div className="w-full max-w-sm flex flex-col items-center space-y-10">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-[#059669] rounded-full flex items-center justify-center shadow-lg">
                <Leaf className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#0B1914] text-center">Agri-Carbon Platform</h1>
              <p className="text-slate-500 text-center">Select your language / अपनी भाषा चुनें / ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ</p>
            </div>

            <div className="w-full space-y-4">
              <button 
                onClick={() => setLanguage('en')}
                className="w-full h-16 bg-[#F0FDF4] border-2 border-[#10B981] rounded-2xl flex items-center justify-center space-x-3 text-lg font-semibold text-[#047857] hover:bg-[#10B981] hover:text-white transition-colors shadow-sm"
              >
                <span>English</span>
              </button>
              <button 
                onClick={() => setLanguage('hi')}
                className="w-full h-16 bg-[#F0FDF4] border-2 border-[#10B981] rounded-2xl flex items-center justify-center space-x-3 text-lg font-semibold text-[#047857] hover:bg-[#10B981] hover:text-white transition-colors shadow-sm"
              >
                <span>हिंदी (Hindi)</span>
              </button>
              <button 
                onClick={() => setLanguage('pa')}
                className="w-full h-16 bg-[#F0FDF4] border-2 border-[#10B981] rounded-2xl flex items-center justify-center space-x-3 text-lg font-semibold text-[#047857] hover:bg-[#10B981] hover:text-white transition-colors shadow-sm"
              >
                <span>ਪੰਜਾਬੀ (Punjabi)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderTopBar = () => (
    <div className="bg-white pt-10 pb-3 px-4 shadow-sm z-40 relative flex justify-between items-center rounded-t-[32px]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[30px] bg-slate-900 rounded-b-[20px] z-50"></div>
      <div className="flex items-center space-x-2 mt-2">
        <div className={`w-2.5 h-2.5 rounded-full ${isOffline ? 'bg-amber-500' : 'bg-[#10B981]'}`}></div>
        <span className="text-[11px] font-medium text-slate-600">
          {isOffline ? t('Offline') : t('Offline Ready')} · {t('Last synced 3 min ago')}
        </span>
      </div>
      
      {/* Quick Language Switcher & Notification Bell */}
      <div className="flex items-center space-x-2 mt-2">
        <div className="bg-[#F1F5F9] p-0.5 rounded-lg flex text-[10px] font-bold">
          {['en', 'hi', 'pa'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-1.5 py-0.5 rounded ${lang === l ? 'bg-[#10B981] text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button onClick={() => setActiveScreen('notifications')} className="relative p-1.5 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>
    </div>
  );

  const renderBottomNav = () => (
    <div className="bg-white border-t border-slate-200 px-6 py-4 flex justify-between items-center rounded-b-[32px] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-6">
      <NavItem icon={<Home />} label={t('Home')} id="home" />
      <NavItem icon={<MapPin />} label={t('My Farm')} id="farm" />
      <NavItem icon={<Flame />} label={t('Kiln')} id="kiln" />
      <NavItem icon={<Wallet />} label={t('Earnings')} id="earnings" />
      <NavItem icon={<Menu />} label={t('More')} id="more" />
    </div>
  );

  const NavItem = ({ icon, label, id }) => (
    <button 
      onClick={() => setActiveScreen(id)}
      className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition-colors min-w-[48px] min-h-[48px] ${activeScreen === id ? 'text-[#10B981]' : 'text-slate-400 hover:text-[#10B981]'}`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="text-[10px] font-medium leading-tight">{label}</span>
    </button>
  );

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
    <div className="flex items-center justify-center w-full min-h-screen bg-[#F0FDF4] p-4 font-sans select-none">
      <div className="relative w-[375px] h-[812px] bg-slate-50 rounded-[40px] shadow-2xl border-[8px] border-slate-900 flex flex-col">
        {renderTopBar()}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 relative">
          {renderScreen()}
        </div>
        {renderBottomNav()}
      </div>
    </div>
  );
};

// Sub-components for screens

const HomeScreen = ({ farmer, fpo, t, setActiveScreen }) => {
  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-bold text-[#0B1914]">{t('Hello')}, {farmer.name}</h2>
        <p className="text-sm text-slate-500">{fpo.name} • {farmer.village}</p>
      </div>

      <div className="bg-[#10B981] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-100">{t('Current Status')}</p>
            <h3 className="text-xl font-bold">{t('Stubble Collected')}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <h4 className="font-semibold text-slate-800 mb-4">{t('Season Progress')}</h4>
        <div className="flex justify-between relative px-2">
          {/* Connecting line */}
          <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 rounded-full -z-10"></div>
          <div className="absolute top-4 left-6 w-1/4 h-1 bg-[#10B981] rounded-full -z-10"></div>
          
          <ProgressStep icon={<Check />} label={t('Enrolled')} active={true} completed={true} />
          <ProgressStep icon={<Leaf />} label={t('Collected')} active={true} completed={true} />
          <ProgressStep icon={<Flame />} label={t('Kiln')} active={true} completed={false} />
          <ProgressStep icon={<Zap />} label={t('Biochar')} active={false} completed={false} />
          <ProgressStep icon={<IndianRupee />} label={t('Paid')} active={false} completed={false} />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-500">{t('Enrolled Area')}</p>
            <p className="text-lg font-black text-slate-800 mt-0.5">
              {farmer.enrolledAcres || farmer.acresEnrolled || 2.5} {t('Acres')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">{t('Zero-Burn Verified')}</p>
            <span className="inline-flex items-center text-xs font-bold text-[#047857] bg-[#F0FDF4] px-2 py-0.5 rounded-full mt-0.5 border border-[#10B981]">
              <BadgeCheck className="w-3.5 h-3.5 mr-1 text-[#10B981]" /> {t('Verified')} ✓
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-3 text-xs">
          <span className="text-slate-500">{t('Rate: ₹9,100 / acre')}</span>
          <span className="font-bold text-[#047857]">
            ₹{((farmer.enrolledAcres || 2.5) * 9100).toLocaleString('en-IN')} {t('Total')}
          </span>
        </div>
      </div>

      <button 
        onClick={() => setActiveScreen('earnings')}
        className="w-full h-16 bg-[#047857] text-white rounded-2xl flex items-center justify-center space-x-3 text-lg font-bold shadow-lg hover:bg-[#065F46] active:scale-95 transition-all"
      >
        <IndianRupee className="w-6 h-6" />
        <span>{t('My Earnings')}</span>
      </button>
    </div>
  );
};

const ProgressStep = ({ icon, label, active, completed }) => (
  <div className="flex flex-col items-center space-y-2">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
      ${completed ? 'bg-[#10B981] text-white' : active ? 'bg-[#F0FDF4] border-2 border-[#10B981] text-[#10B981]' : 'bg-slate-100 text-slate-400'}`}>
      <div className="w-4 h-4">{icon}</div>
    </div>
    <span className={`text-[10px] font-medium text-center w-12 ${active ? 'text-slate-800' : 'text-slate-400'}`}>{label}</span>
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
    <div className="p-4 space-y-5 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#0B1914]">{t('My Farm')}</h2>
        <span className="text-xs text-[#047857] font-semibold bg-[#F0FDF4] px-2.5 py-1 rounded-full border border-[#10B981]">
          {farmer.village} • {farmer.cluster}
        </span>
      </div>
      
      {/* Interactive Map Card with Polygon Highlight */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
        <div className="h-44 bg-[#0B1914] relative overflow-hidden">
          <img 
            src="/pre_harvest.jpg" 
            alt="Plot Boundary" 
            className="w-full h-full object-cover opacity-70 mix-blend-luminosity" 
          />
          <div className="absolute inset-0 bg-radial from-transparent to-black/50"></div>
          
          {/* Dynamic Farm polygon highlight */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <polygon 
              points={polyPoints} 
              fill="rgba(16, 185, 129, 0.35)" 
              stroke="#10B981" 
              strokeWidth="2.5"
              strokeDasharray="4 2"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-3 h-3 bg-[#10B981] rounded-full animate-ping absolute"></div>
            <MapPin className="w-8 h-8 text-[#10B981] drop-shadow-lg z-10" />
            <span className="text-[10px] font-mono text-white bg-black/75 px-2 py-0.5 rounded-full mt-1 border border-white/20">
              {safeAcres} {t('Acres')}
            </span>
          </div>
        </div>

        {/* Acreage Input & Stepper Controls */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase">
              {t('Enter Land Area (Acres)')}
            </label>
            <span className="text-[11px] font-mono text-[#047857] font-semibold">
              {t('Payout Rate')}
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
                className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl px-4 py-2.5 text-base font-bold text-[#0F172A] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
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
                  className="px-2.5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] active:bg-[#CBD5E1] text-xs font-bold text-slate-700 rounded-xl transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center space-x-2 mt-2.5 overflow-x-auto no-scrollbar">
            {[1.0, 2.5, 4.0, 5.0, 8.0].map((preset) => (
              <button
                key={preset}
                onClick={() => setAcres(preset)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  acres === preset 
                    ? 'bg-[#047857] text-white shadow-xs' 
                    : 'bg-[#F8FAFC] border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {preset} {t('Acres')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Calculations Dashboard */}
      <div className="bg-gradient-to-br from-[#065F46] to-[#10B981] rounded-3xl p-5 text-white shadow-lg space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-green-100">{t('Estimated Total Payout')}</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-bold">{t('Direct Bank Transfer (PFMS)')}</span>
          </div>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-xl font-bold">₹</span>
            <span className="text-4xl font-black tracking-tight">{totalPayout.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20">
          <div className="bg-black/15 p-2.5 rounded-xl backdrop-blur-xs">
            <p className="text-[10px] text-green-100">{t('Carbon Direct Cash')} (65%)</p>
            <p className="text-sm font-bold text-white mt-0.5">₹{Math.round(carbonCash).toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-black/15 p-2.5 rounded-xl backdrop-blur-xs">
            <p className="text-[10px] text-green-100">{t('Fertilizer & Water Savings')} (35%)</p>
            <p className="text-sm font-bold text-white mt-0.5">₹{Math.round(fertilizerSavings).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Biomass & Biochar Output Calculations */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <Leaf className="w-4 h-4 text-[#10B981]" />
            <span className="text-xs font-medium">{t('Estimated Stubble Yield')}</span>
          </div>
          <p className="text-2xl font-bold text-[#0B1914]">{stubbleTonnes.toFixed(1)} <span className="text-xs text-slate-400 font-normal">t</span></p>
          <span className="text-[10px] text-slate-400 mt-1">@ 2.5 {t('tPerAcre')}</span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium">{t('Biochar to be Applied')}</span>
          </div>
          <p className="text-2xl font-bold text-[#0B1914]">{biocharTonnes.toFixed(1)} <span className="text-xs text-slate-400 font-normal">t</span></p>
          <span className="text-[10px] text-slate-400 mt-1">@ 0.7 {t('tPerAcre')} (28% yield)</span>
        </div>
      </div>

      {/* Zero Burn Badge */}
      <div className="bg-[#F0FDF4] rounded-2xl p-4 border border-[#10B981] flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#10B981] rounded-full flex items-center justify-center shrink-0 shadow-xs">
          <BadgeCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-[#047857] text-sm">{t('Zero-Burn Verified')} ✓</h4>
          <p className="text-[11px] text-[#065F46]">{t('Satellite confirmed on Oct 15')}</p>
        </div>
      </div>

      {/* Soil Health & SOC testing */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <h4 className="font-semibold text-slate-800 text-sm mb-3">{t('Soil Health & Biochar')}</h4>
        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl leading-relaxed">
          {t('Your soil organic carbon (SOC) is improving. Next testing in 3 months.')}
        </p>
      </div>
    </div>
  );
};


const KilnScreen = ({ kiln, t }) => {
  return (
    <div className="p-4 space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-[#0B1914]">{t('Kiln Schedule')}</h2>

      <div className="bg-[#FFFBEB] rounded-3xl p-5 border border-[#F59E0B] shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <Flame className="w-6 h-6 text-[#D97706]" />
          <h3 className="font-bold text-[#D97706] text-lg">{t('Your Cluster Kiln')}</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">{t('Location')}</span>
            <span className="font-medium text-slate-800">{kiln.location.village}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t('Coordinator')}</span>
            <span className="font-medium text-slate-800">{kiln.coordinator}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t('Status')}</span>
            <span className="font-bold text-[#10B981]">{t(kiln.status)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <h4 className="font-semibold text-slate-800 mb-4">{t('Next Batch')}</h4>
        <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl">
          <div className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center min-w-[70px]">
            <span className="text-xs text-red-500 font-bold uppercase">Oct</span>
            <span className="text-2xl font-bold text-slate-800">24</span>
          </div>
          <div>
            <h5 className="font-bold text-slate-800">{t('Morning Shift')}</h5>
            <p className="text-sm text-slate-500">08:00 AM - 02:00 PM</p>
          </div>
        </div>
      </div>

      <div className="bg-[#F8FAFC] rounded-3xl p-5 border border-slate-200">
        <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
          <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
          {t('Drop-off Instructions')}
        </h4>
        <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5 marker:text-[#10B981]">
          <li>{t('Ensure stubble is dry')}</li>
          <li>{t('Bring FPO ID card')}</li>
          <li>{t('Arrive 15 mins early')}</li>
        </ul>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <h4 className="font-semibold text-slate-800 mb-3">{t('Upcoming Dates')}</h4>
        <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
          {[24, 25, 26, 27, 28].map((day, i) => (
            <div key={day} className={`min-w-[64px] py-3 rounded-2xl flex flex-col items-center justify-center shrink-0 border ${i === 0 ? 'bg-[#10B981] text-white border-[#10B981]' : 'bg-white text-slate-600 border-slate-200'}`}>
              <span className="text-[10px] uppercase font-bold">{t('Oct')}</span>
              <span className="text-lg font-bold">{day}</span>
              {i === 0 && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EarningsScreen = ({ farmer, t }) => {
  return (
    <div className="p-4 space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-[#0B1914]">{t('Earnings & Payouts')}</h2>

      <div className="bg-gradient-to-br from-[#065F46] to-[#10B981] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <p className="text-green-100 text-sm font-medium mb-1">{t('Total Earned This Season')}</p>
        <div className="flex items-baseline space-x-1 mb-4">
          <span className="text-2xl font-bold">₹</span>
          <span className="text-5xl font-extrabold tracking-tight">12,450</span>
        </div>
        <div className="flex justify-between items-center bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
          <span className="text-xs">{t('Next Expected')}: ₹4,200</span>
          <span className="text-xs font-bold">Nov 15</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-[#ECFDF5] rounded-full flex items-center justify-center text-[#10B981] mb-2">
            <Leaf className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500 mb-1">{t('Carbon Cash (65%)')}</p>
          <p className="font-bold text-slate-800">₹8,092</p>
        </div>
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-2">
            <Zap className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500 mb-1">{t('Fertilizer Savings')}</p>
          <p className="font-bold text-slate-800">₹4,358</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <h4 className="font-semibold text-slate-800 mb-4">{t('Recent Transactions')}</h4>
        <div className="space-y-4">
          <TransactionCard 
            title={t('Advance Payment')} 
            date="Oct 01, 2024" 
            amount="+ ₹2,000" 
            status="completed" 
            t={t} 
          />
          <div className="h-px bg-slate-100 w-full"></div>
          <TransactionCard 
            title={t('Collection Bonus')} 
            date="Oct 10, 2024" 
            amount="+ ₹1,500" 
            status="completed" 
            t={t} 
          />
          <div className="h-px bg-slate-100 w-full"></div>
          <TransactionCard 
            title={t('Processing Share')} 
            date="Pending" 
            amount="+ ₹4,200" 
            status="pending" 
            t={t} 
          />
        </div>
      </div>
    </div>
  );
};

const TransactionCard = ({ title, date, amount, status, t }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'completed' ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-amber-50 text-amber-500'}`}>
        <IndianRupee className="w-5 h-5" />
      </div>
      <div>
        <p className="font-medium text-slate-800 text-sm">{title}</p>
        <p className="text-xs text-slate-500">{date}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-slate-800">{amount}</p>
      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
        {t(status)}
      </span>
    </div>
  </div>
);

const NotificationsScreen = ({ t }) => {
  return (
    <div className="p-4 space-y-4 pb-20">
      <h2 className="text-2xl font-bold text-[#0B1914] mb-2">{t('Notifications')}</h2>
      
      {[
        { type: 'payment', title: t('Payment Received'), desc: t('₹1,500 credited to your account'), time: '2h ago', icon: <IndianRupee />, color: 'bg-green-100 text-green-600' },
        { type: 'kiln', title: t('Kiln Batch Scheduled'), desc: t('Your stubble is scheduled for Oct 24'), time: '1d ago', icon: <Flame />, color: 'bg-amber-100 text-amber-600' },
        { type: 'verify', title: t('Verification Passed'), desc: t('Zero-burn verified via satellite'), time: '3d ago', icon: <BadgeCheck />, color: 'bg-blue-100 text-blue-600' },
        { type: 'training', title: t('Training Reminder'), desc: t('Biochar application training tomorrow'), time: '1w ago', icon: <PlayCircle />, color: 'bg-purple-100 text-purple-600' }
      ].map((n, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${n.color}`}>
            {React.cloneElement(n.icon, { className: 'w-6 h-6' })}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-slate-800 text-sm">{n.title}</h4>
              <span className="text-[10px] text-slate-400">{n.time}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{n.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const CommunityScreen = ({ fpo, t }) => {
  return (
    <div className="p-4 space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-[#0B1914]">{fpo.name}</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0B1914] text-white p-4 rounded-2xl">
          <Users className="w-6 h-6 text-[#10B981] mb-2" />
          <p className="text-2xl font-bold">142</p>
          <p className="text-xs text-slate-400">{t('Farmers')}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <MapPin className="w-6 h-6 text-slate-600 mb-2" />
          <p className="text-2xl font-bold text-slate-800">580</p>
          <p className="text-xs text-slate-500">{t('Acres')}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <Leaf className="w-6 h-6 text-[#10B981] mb-2" />
          <p className="text-2xl font-bold text-slate-800">1.2k</p>
          <p className="text-xs text-slate-500">{t('Tonnes Diverted')}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <IndianRupee className="w-6 h-6 text-amber-500 mb-2" />
          <p className="text-2xl font-bold text-slate-800">₹8.5L</p>
          <p className="text-xs text-slate-500">{t('Total Payouts')}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <h4 className="font-semibold text-slate-800 mb-4">{t('Announcements')}</h4>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-[#DCF8C6] rounded-2xl rounded-tl-none p-3 shadow-sm relative ml-2">
              <div className="absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-[#DCF8C6] border-l-[10px] border-l-transparent"></div>
              <p className="text-sm text-slate-800">{t('Important: The new kiln schedule for cluster A is now available. Please check your apps.')}</p>
              <div className="flex justify-end mt-1 items-center">
                <span className="text-[10px] text-slate-500 mr-1">10:42 AM</span>
                <Check className="w-3 h-3 text-blue-500" />
                <Check className="w-3 h-3 text-blue-500 -ml-1.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <h4 className="font-semibold text-slate-800 mb-4">{t('Top Members')}</h4>
        <div className="space-y-3">
          {['Ramesh Singh', 'Gurpreet Kaur', 'Amit Kumar'].map((name, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                {name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-slate-800">{name}</p>
                <p className="text-xs text-slate-500">12 {t('Acres')}</p>
              </div>
              <BadgeCheck className={`w-5 h-5 ${i === 0 ? 'text-amber-500' : 'text-[#10B981]'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HelpScreen = ({ t }) => {
  return (
    <div className="p-4 space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-[#0B1914]">{t('Help & Training')}</h2>

      <button className="w-full h-20 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl flex items-center justify-center space-x-4 shadow-lg active:scale-95 transition-all">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Phone className="w-6 h-6" />
        </div>
        <div className="text-left">
          <p className="font-bold text-lg">{t('Call Support')}</p>
          <p className="text-xs text-blue-100">{t('Toll-free: 1800-123-4567')}</p>
        </div>
      </button>

      <div>
        <h4 className="font-semibold text-slate-800 mb-4">{t('Video Guides')}</h4>
        <div className="space-y-4">
          {[
            { title: t('How to use Biochar'), duration: '3:45' },
            { title: t('Understanding Payouts'), duration: '2:10' },
            { title: t('Preparing Stubble'), duration: '4:20' }
          ].map((vid, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <div className="h-32 bg-slate-800 relative flex items-center justify-center">
                <img src={`https://picsum.photos/400/200?random=${i+10}`} alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                <PlayCircle className="w-12 h-12 text-white opacity-80 z-10" />
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded font-mono z-10">
                  {vid.duration}
                </span>
              </div>
              <div className="p-4">
                <h5 className="font-bold text-slate-800 text-sm">{vid.title}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MoreMenuScreen = ({ t, setActiveScreen, setLang }) => {
  return (
    <div className="p-4 space-y-4 pb-20">
      <h2 className="text-2xl font-bold text-[#0B1914] mb-4">{t('More')}</h2>
      
      <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100">
        <MenuButton icon={<Users />} label={t('My FPO Community')} onClick={() => setActiveScreen('community')} />
        <MenuButton icon={<PlayCircle />} label={t('Help & Training')} onClick={() => setActiveScreen('help')} />
        <div className="h-px bg-slate-100 my-2 mx-4"></div>
        <MenuButton icon={<RefreshCw />} label={t('Change Language')} onClick={() => setLang(null)} />
      </div>
    </div>
  );
};

const MenuButton = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors"
  >
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 bg-[#F0FDF4] text-[#10B981] rounded-full flex items-center justify-center">
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <span className="font-medium text-slate-800">{label}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-slate-400" />
  </button>
);

export default FarmerApp;
