import { useState } from 'react'
import {
  LayoutDashboard,
  Sprout,
  HardHat,
  Building2,
  ShieldCheck,
  ChevronRight,
  Leaf,
  Menu,
  X,
} from 'lucide-react'

// Lazy imports — these will be created by the build agents
import CommandCenter from './components/CommandCenter'
import FarmerApp from './components/FarmerApp'
import FieldOperatorApp from './components/FieldOperatorApp'
import BuyerPortal from './components/BuyerPortal'
import VerificationConsole from './components/VerificationConsole'

const interfaces = [
  {
    id: 'command-center',
    name: 'Command Center',
    shortName: 'Ops Console',
    icon: LayoutDashboard,
    user: 'Internal Ops Team',
    desc: 'Single pane of glass across farmers, kilns, MRV, credits, buyers, and finance',
    component: CommandCenter,
    color: '#10B981',
  },
  {
    id: 'farmer-app',
    name: 'Farmer / FPO App',
    shortName: 'Farmer App',
    icon: Sprout,
    user: 'Smallholder Farmers & FPO Leaders',
    desc: 'Enroll, track kiln schedule, see earnings, receive payouts',
    component: FarmerApp,
    color: '#059669',
  },
  {
    id: 'field-operator',
    name: 'Field Operator App',
    shortName: 'Field Operator',
    icon: HardHat,
    user: 'Village-Level Coordinators',
    desc: 'Digital chain of custody — batch intake, pyrolysis, sampling, QR sealing',
    component: FieldOperatorApp,
    color: '#F59E0B',
  },
  {
    id: 'buyer-portal',
    name: 'Buyer Portal',
    shortName: 'Buyer Portal',
    icon: Building2,
    user: 'Corporate Carbon Buyers',
    desc: 'Browse, purchase, track, and report on credits',
    component: BuyerPortal,
    color: '#3B82F6',
  },
  {
    id: 'verification',
    name: 'Verification Console',
    shortName: 'Verification',
    icon: ShieldCheck,
    user: 'Compliance Team & VVB Auditors',
    desc: 'Immutable batch-test ledger, lab result ingestion, audit export',
    component: VerificationConsole,
    color: '#8B5CF6',
  },
]

// Value chain flow for the guided tour banner
const valueChain = [
  'Field Operator generates raw evidence',
  'Verification Console certifies credit lots',
  'Command Center manages the full pipeline',
  'Buyer Portal sells the output',
  'Farmer App shows money coming back',
]

export default function App() {
  const [activeInterface, setActiveInterface] = useState('command-center')
  const [showAppDrawer, setShowAppDrawer] = useState(false)
  const [showTour, setShowTour] = useState(true)

  const current = interfaces.find((i) => i.id === activeInterface)
  const ActiveComponent = current.component

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#F8FAFC] flex flex-col font-sans relative">
      {/* ─── Top Showcase Navigation Bar ─── */}
      <header className="bg-[#0B1914] text-white shadow-xl z-40 relative">
        {/* Value chain tour banner */}
        {showTour && (
          <div className="bg-[#132E27] border-b border-[#1a3f35] px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-[#10B981] font-semibold whitespace-nowrap">Value Chain:</span>
              {valueChain.map((step, idx) => (
                <span key={idx} className="flex items-center gap-1 whitespace-nowrap">
                  <span className={`${idx === interfaces.findIndex(i => i.id === activeInterface) ? 'text-[#10B981] font-bold' : 'text-[#94A3B8]'}`}>
                    {step}
                  </span>
                  {idx < valueChain.length - 1 && (
                    <ChevronRight size={12} className="text-[#64748B] shrink-0" />
                  )}
                </span>
              ))}
            </div>
            <button
              onClick={() => setShowTour(false)}
              className="text-[#64748B] hover:text-white ml-4 shrink-0"
              title="Dismiss banner"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Main nav bar */}
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Logo & Hamburger Menu Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAppDrawer(true)}
              className="p-2 rounded-lg bg-[#132E27] hover:bg-[#1a3f35] border border-[#1a3f35] text-white flex items-center gap-2 transition-all hover:border-[#10B981] group"
              title="Open Apps Menu"
            >
              <Menu size={20} className="text-[#10B981] group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline text-white">Apps Menu</span>
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-[#1a3f35]">
              <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center shadow-md">
                <Leaf size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight leading-none text-white">Agri-Carbon</h1>
                <p className="text-[9px] text-[#94A3B8] tracking-widest uppercase leading-none mt-0.5 font-medium">Digital Platform</p>
              </div>
            </div>
          </div>

          {/* Quick Desktop Pills */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#07110e] p-1 rounded-xl border border-[#132E27]">
            {interfaces.map((iface) => {
              const Icon = iface.icon
              const isActive = activeInterface === iface.id
              return (
                <button
                  key={iface.id}
                  onClick={() => setActiveInterface(iface.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#132E27] text-[#10B981] shadow-sm border border-[#10B981]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#132E27]/40'
                  }`}
                >
                  <Icon size={14} style={isActive ? { color: iface.color } : {}} />
                  <span>{iface.shortName}</span>
                </button>
              )
            })}
          </nav>

          {/* Active app indicator pill */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#132E27] text-[#10B981] border border-[#1a3f35]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              {current.shortName}
            </span>
          </div>
        </div>
      </header>

      {/* ─── Slide-Over Hamburger Drawer (All 5 Apps) ─── */}
      {showAppDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowAppDrawer(false)}
          ></div>

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-md bg-[#0B1914] text-white shadow-2xl flex flex-col border-r border-[#1a3f35] animate-in slide-in-from-left duration-300">
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#1a3f35] flex items-center justify-between bg-[#07110e]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#10B981] flex items-center justify-center shadow-lg">
                    <Leaf size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Platform Ecosystem</h2>
                    <p className="text-xs text-[#94A3B8]">Select an application interface</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAppDrawer(false)}
                  className="p-2 rounded-lg bg-[#132E27] hover:bg-[#1a3f35] text-[#94A3B8] hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Apps List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-2 pt-1">
                  5 Integrated Value-Chain Apps
                </div>
                {interfaces.map((iface) => {
                  const Icon = iface.icon
                  const isActive = activeInterface === iface.id
                  return (
                    <div
                      key={iface.id}
                      onClick={() => {
                        setActiveInterface(iface.id)
                        setShowAppDrawer(false)
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                        isActive
                          ? 'bg-[#132E27] border-[#10B981] shadow-lg ring-1 ring-[#10B981]/50'
                          : 'bg-[#07110e]/60 border-[#1a3f35] hover:border-[#10B981] hover:bg-[#132E27]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow"
                            style={{ backgroundColor: iface.color + '25', border: `1px solid ${iface.color}40` }}
                          >
                            <Icon size={20} style={{ color: iface.color }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm text-white group-hover:text-[#10B981] transition-colors">
                                {iface.name}
                              </h3>
                              {isActive && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981] text-white">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#94A3B8] font-medium mt-0.5">
                              Role: <span className="text-slate-300">{iface.user}</span>
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={18} className={`mt-1 transition-transform group-hover:translate-x-1 ${isActive ? 'text-[#10B981]' : 'text-[#64748B]'}`} />
                      </div>
                      <p className="text-xs text-[#64748B] mt-3 pl-1 leading-relaxed border-t border-[#1a3f35]/50 pt-2">
                        {iface.desc}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-[#1a3f35] bg-[#07110e] text-xs text-[#64748B] flex items-center justify-between">
                <span>Kharif 2025 Pilot Edition</span>
                <span className="flex items-center gap-1.5 text-[#10B981] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                  5/5 Services Online
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Active Interface Sub-Header ─── */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          {(() => {
            const Icon = current.icon
            return (
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shadow-xs"
                style={{ backgroundColor: current.color + '20' }}
              >
                <Icon size={16} style={{ color: current.color }} />
              </div>
            )
          })()}
          <div>
            <h2 className="text-[#0F172A] font-bold text-sm leading-tight flex items-center gap-2">
              <span>{current.name}</span>
              <span className="text-[11px] font-normal text-[#64748B]">({current.user})</span>
            </h2>
          </div>
        </div>
        <button
          onClick={() => setShowAppDrawer(true)}
          className="text-xs font-semibold text-[#10B981] hover:text-[#059669] flex items-center gap-1 hover:underline cursor-pointer"
        >
          <Menu size={14} />
          <span>Switch App</span>
        </button>
      </div>

      {/* ─── Active Interface Component ─── */}
      <main className="flex-1 overflow-auto">
        <ActiveComponent />
      </main>

      {/* ─── Floating Quick App Switcher Button (Bottom Right) ─── */}
      <div className="fixed bottom-5 sm:bottom-6 right-4 sm:right-6 z-40" style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom, 1.25rem))' }}>
        <button
          onClick={() => setShowAppDrawer(true)}
          className="flex items-center gap-2 px-4 py-3 sm:py-2.5 bg-[#0B1914] text-white rounded-full shadow-2xl border border-[#10B981]/50 hover:bg-[#132E27] hover:border-[#10B981] active:scale-95 transition-all cursor-pointer group"
          title="Switch Platform Application"
        >
          <Menu size={18} className="text-[#10B981] group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-xs font-bold tracking-wide">Switch App</span>
        </button>
      </div>
    </div>
  )
}
