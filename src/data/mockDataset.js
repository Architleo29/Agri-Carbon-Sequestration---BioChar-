// ─────────────────────────────────────────────────────────────
// Agri-Carbon Mock Dataset — Single Source of Truth
// All numbers match the DBTS project specification:
//   500 farmers · 25 kilns · 1,250 acres · 3,125t stubble
//   875t biochar · 2,188 CORCs · ₹9,100/acre · ₹1.138 Cr payouts
// ─────────────────────────────────────────────────────────────

const villages = [
  'Bhadson', 'Dirba', 'Lehragaga', 'Sunam', 'Moonak',
  'Amargarh', 'Dhuri', 'Malerkotla', 'Ahmedgarh', 'Jagraon',
  'Raikot', 'Nilokheri', 'Ladwa', 'Shahabad', 'Pehowa',
];

const fpoNames = ['Agri-Carbon Unified FPO'];
const clusterNames = ['Sangrur', 'Ludhiana', 'Karnal', 'Patiala', 'Kaithal'];

const clusterCoords = {
  Sangrur:  { lat: 30.2330, lng: 75.8410 },
  Ludhiana: { lat: 30.9010, lng: 75.8573 },
  Karnal:   { lat: 29.6857, lng: 76.9905 },
  Patiala:  { lat: 30.3398, lng: 76.3869 },
  Kaithal:  { lat: 29.7850, lng: 76.4020 },
};

const coordinatorNames = [
  'Gurpreet Singh', 'Mandeep Kaur', 'Rajvinder Dhillon',
  'Harjot Sandhu', 'Balwinder Gill', 'Sukhpal Brar',
  'Amanpreet Sidhu', 'Jasvir Grewal', 'Kulwant Bajwa', 'Paramjit Randhawa',
];

// ── Deterministic seeder ──
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const rand = seededRandom(42);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const randBetween = (min, max) => Math.floor(rand() * (max - min + 1)) + min;

// ── Generate 500 Farmers ──
const firstNames = [
  'Amrit', 'Harpal', 'Jagtar', 'Kuldeep', 'Lakhvir', 'Manpreet',
  'Navjot', 'Paramjit', 'Rajinder', 'Sukhdev', 'Tejpal', 'Udham',
  'Gurnam', 'Baldev', 'Daljit', 'Gurbachan', 'Iqbal', 'Jaswant',
  'Kartar', 'Mohan', 'Nirmal', 'Onkar', 'Pritam', 'Ranjit',
  'Sardar', 'Tara', 'Waryam', 'Zorawar', 'Avtar', 'Balbir',
];
const lastNames = [
  'Singh', 'Kaur', 'Dhillon', 'Sandhu', 'Gill', 'Brar',
  'Sidhu', 'Grewal', 'Bajwa', 'Randhawa', 'Cheema', 'Mann',
  'Johal', 'Deol', 'Thind', 'Malhi', 'Atwal', 'Sekhon',
  'Hundal', 'Sangha',
];

export const farmers = Array.from({ length: 500 }, (_, i) => {
  const clusterIdx = i % 5;
  const cluster = clusterNames[clusterIdx];
  const center = clusterCoords[cluster];
  const acres = pick([2, 2.5, 3, 2, 2.5, 3, 2, 2.5]);
  return {
    id: `F-${String(i + 1).padStart(4, '0')}`,
    name: `${pick(firstNames)} ${pick(lastNames)}`,
    aadhaarMasked: `XXXX-XXXX-${String(randBetween(1000, 9999))}`,
    mobile: `+91 ${randBetween(70000, 99999)} ${randBetween(10000, 99999)}`,
    village: pick(villages),
    fpo: fpoNames[0],
    cluster,
    enrolledAcres: acres,
    enrollmentDate: `2026-0${randBetween(3, 5)}-${String(randBetween(1, 28)).padStart(2, '0')}`,
    bankLinked: rand() > 0.05,
    plotCenter: {
      lat: center.lat + (rand() - 0.5) * 0.15,
      lng: center.lng + (rand() - 0.5) * 0.15,
    },
    zeroBurnStatus: i % 18 === 0 ? 'in_process' : i % 73 === 0 ? 'flagged' : 'verified',
    zeroBurnConfirmed: !(i % 18 === 0 || i % 73 === 0),
    stubbleCollectedT: +(acres * 2.5).toFixed(2),
    biocharAppliedT: +(acres * 2.5 * 0.28).toFixed(2),
    totalEarnings: Math.round(acres * 9100),
    payoutStatus: rand() > 0.12 ? 'completed' : 'processing',
    soilOCPct: +(rand() * 0.3 + 0.25).toFixed(2),
  };
});

// ── Generate 25 Kilns ──
const kilnStatuses = ['idle', 'feeding', 'pyrolysis', 'quenching', 'complete'];
export const kilns = Array.from({ length: 25 }, (_, i) => {
  const cluster = clusterNames[i % 5];
  const center = clusterCoords[cluster];
  return {
    id: `K-${String(i + 1).padStart(3, '0')}`,
    cluster,
    location: {
      lat: center.lat + (rand() - 0.5) * 0.08,
      lng: center.lng + (rand() - 0.5) * 0.08,
    },
    coordinator: coordinatorNames[i % coordinatorNames.length],
    status: pick(kilnStatuses),
    batchesCompleted: randBetween(8, 18),
    cumulativeBiocharT: +(randBetween(28, 42) + rand() * 5).toFixed(1),
    model: 'Flame-Curtain Kon-Tiki v2',
    commissionDate: `2026-04-${String(randBetween(1, 15)).padStart(2, '0')}`,
  };
});

// ── Generate Batches (≈ 625 total, one batch per kiln per day over 20-day sprint + extras) ──
let batchCounter = 0;
export const batches = [];
kilns.forEach((kiln) => {
  const numBatches = kiln.batchesCompleted;
  for (let b = 0; b < numBatches; b++) {
    batchCounter++;
    const farmerIdx = randBetween(0, 499);
    const farmer = farmers[farmerIdx];
    const inputKg = randBetween(100, 180);
    const outputKg = Math.round(inputKg * (0.25 + rand() * 0.08));
    const hcorg = +(rand() * 0.2 + 0.18).toFixed(2);
    const passed = hcorg <= 0.4;
    const batchId = `A-${String(batchCounter).padStart(4, '0')}`;
    const sampleId = `S-${String(batchCounter + 1000).padStart(4, '0')}`;
    const day = Math.min(b + 1, 20);
    const dateStr = `2026-04-${String(day).padStart(2, '0')}`;
    const peakTemp = randBetween(520, 690);

    // Generate a deterministic hash
    const hashSrc = `${batchId}-${sampleId}-${dateStr}-${inputKg}-${outputKg}`;
    let hash = 0;
    for (let c = 0; c < hashSrc.length; c++) {
      hash = ((hash << 5) - hash + hashSrc.charCodeAt(c)) | 0;
    }
    const ledgerHash = '0x' + Math.abs(hash).toString(16).padStart(8, '0') +
      Math.abs(hash * 31).toString(16).padStart(8, '0').slice(0, 8);

    batches.push({
      batchId,
      sampleId,
      kilnId: kiln.id,
      cluster: kiln.cluster,
      farmerId: farmer.id,
      farmerName: farmer.name,
      coordinatorName: kiln.coordinator,
      date: dateStr,
      inputWeightKg: inputKg,
      outputWeightKg: outputKg,
      yieldPct: +((outputKg / inputKg) * 100).toFixed(1),
      peakTempC: peakTemp,
      pyrolysisDurationMin: randBetween(120, 180),
      gps: {
        lat: kiln.location.lat + (rand() - 0.5) * 0.002,
        lng: kiln.location.lng + (rand() - 0.5) * 0.002,
      },
      labStatus: passed ? 'pass' : 'fail',
      labResults: {
        hcorg,
        moisturePct: +(rand() * 6 + 3).toFixed(1),
        ashPct: +(rand() * 10 + 8).toFixed(1),
        heavyMetals: 'Below threshold',
      },
      ledgerHash,
      pipelineStage: passed
        ? pick(['lab_passed', 'lot_aggregated', 'vvb_submitted', 'certified'])
        : 'quarantined',
      synced: rand() > 0.08,
    });
  }
});

// ── Buyer / Offtake agreements ──
export const buyers = [
  {
    id: 'BUY-001',
    name: 'Microsoft Sustainability',
    contractedVolume: 800,
    deliveredVolume: 520,
    pricePerTonne: '€148',
    term: '2025–2027',
    nextDeliveryDate: '2025-06-15',
    status: 'Active',
  },
  {
    id: 'BUY-002',
    name: 'Google Carbon Removals',
    contractedVolume: 600,
    deliveredVolume: 380,
    pricePerTonne: '€132',
    term: '2025–2027',
    nextDeliveryDate: '2025-07-01',
    status: 'Active',
  },
  {
    id: 'BUY-003',
    name: 'Shopify Sustainability Fund',
    contractedVolume: 400,
    deliveredVolume: 200,
    pricePerTonne: '€155',
    term: '2025–2027',
    nextDeliveryDate: '2025-06-30',
    status: 'Active',
  },
  {
    id: 'BUY-004',
    name: 'Swiss Re Climate Initiative',
    contractedVolume: 388,
    deliveredVolume: 150,
    pricePerTonne: '€140',
    term: '2025–2027',
    nextDeliveryDate: '2025-08-01',
    status: 'Pending',
  },
];

// ── Credit Lots (2,188 CORCs across ~40 lots) ──
const passedBatches = batches.filter((b) => b.labStatus === 'pass');
export const creditLots = [];
let lotIdx = 0;
let corcsAssigned = 0;
const TARGET_CORCS = 2188;
let batchOffset = 0;
while (corcsAssigned < TARGET_CORCS && lotIdx < 150) {
  let requestedVolume = randBetween(20, 95);
  const lotVolume = Math.min(requestedVolume, TARGET_CORCS - corcsAssigned);
  
  const numBatches = Math.ceil(lotVolume / 3.5);
  const lotBatchIds = passedBatches
    .slice(batchOffset, batchOffset + numBatches)
    .map((b) => b.batchId);
  batchOffset += numBatches;

  const statusPool = ['minted', 'issued', 'issued', 'sold', 'sold', 'retired', 'pending'];
  const status = statusPool[lotIdx % statusPool.length];
  
  let assignedBuyer = null;
  if (status === 'sold' || status === 'retired') {
    assignedBuyer = buyers[lotIdx % buyers.length];
  }
  
  creditLots.push({
    lotId: `PURO-2025-IN-${String(lotIdx + 1).padStart(3, '0')}`,
    registry: lotIdx % 3 === 0 ? 'Verra VM0044' : 'Puro.earth CORC200+',
    volume: lotVolume,
    vintage: '2025',
    status,
    buyerId: assignedBuyer ? assignedBuyer.id : null,
    buyerName: assignedBuyer ? assignedBuyer.name : null,
    batchIds: lotBatchIds,
    durabilityRating: 'H:Corg ≤ 0.4',
    indicativePrice: lotIdx % 3 === 0 ? '€132/tCO2e' : '€148/tCO2e',
    certificationDate: status !== 'pending' ? `2025-05-${String(randBetween(10, 30)).padStart(2, '0')}` : null,
  });
  corcsAssigned += lotVolume;
  lotIdx++;
}

// ── FPO Aggregates ──
export const clusters = clusterNames.map((name, i) => {
  const members = farmers.filter((f) => f.cluster === name);
  const verifiedCount = members.filter((f) => f.zeroBurnStatus === 'verified').length;
  const inProcessCount = members.filter((f) => f.zeroBurnStatus === 'in_process').length;
  const flaggedCount = members.filter((f) => f.zeroBurnStatus === 'flagged').length;
  const complianceRate = +((verifiedCount / members.length) * 100).toFixed(1);
  return {
    name,
    memberCount: members.length,
    totalAcres: members.reduce((s, f) => s + f.enrolledAcres, 0),
    totalStubbleDivertedT: +members.reduce((s, f) => s + f.stubbleCollectedT, 0).toFixed(1),
    totalPayoutsRs: members.reduce((s, f) => s + f.totalEarnings, 0),
    status: 'Active',
    center: clusterCoords[name],
    complianceRate,
    verifiedCount,
    inProcessCount,
    flaggedCount,
  };
});

// ── Coordinators ──
export const coordinators = coordinatorNames.map((name, i) => ({
  id: `CO-${String(i + 1).padStart(3, '0')}`,
  name,
  cluster: clusterNames[i % 5],
  assignedKilns: kilns.filter((k) => k.coordinator === name).map((k) => k.id),
  batchesProcessed: batches.filter((b) => b.coordinatorName === name).length,
}));

// ── Pipeline / funnel summary ──
export const pipelineSummary = {
  enrolledAcres: 1250,
  stubbleCollectedT: 3125,
  biocharProducedT: 875,
  labPassedBatches: passedBatches.length,
  labFailedBatches: batches.length - passedBatches.length,
  totalBatches: batches.length,
  creditLotsAggregated: creditLots.length,
  vvbSubmitted: creditLots.filter((l) => ['vvb_submitted', 'certified', 'issued', 'sold', 'retired'].includes(l.status) || l.status === 'minted').length,
  registryIssued: creditLots.filter((l) => ['issued', 'sold', 'retired', 'minted'].includes(l.status)).length,
  sold: creditLots.filter((l) => ['sold', 'retired'].includes(l.status)).length,
  totalCORCs: TARGET_CORCS,
};

// ── KPI Constants ──
export const kpis = {
  farmersEnrolled: 500,
  acresUnderManagement: 1250,
  fposOnboarded: 5,
  activeKilns: 25,
  totalKilns: 25,
  stubbleDivertedT: 3125,
  biocharProducedT: 875,
  creditsInPipeline: TARGET_CORCS,
  creditsIssued: creditLots.filter((l) => l.status !== 'pending').reduce((s, l) => s + l.volume, 0),
  farmerPayoutPerAcreRs: 9100,
  totalPayoutsDisbursedRs: 11380000, // ₹1.138 Cr
  platformRevenueLRs: 44.75,
  pilotBudgetLRs: 29.75,
  netMarginLRs: 15.0,
  marginPct: 33.5,
  platformMarginPct: 25,
  hcorgThreshold: 0.4,
  complianceRatePct: +(farmers.filter((f) => f.zeroBurnConfirmed).length / farmers.length * 100).toFixed(1),
};

// ── Budget breakdown ──
export const budgetBreakdown = [
  { category: 'Field Operations', budgetL: 8.5, spentL: 7.2 },
  { category: 'Kiln Procurement & Maintenance', budgetL: 7.0, spentL: 6.8 },
  { category: 'dMRV Software & Satellite', budgetL: 5.25, spentL: 4.9 },
  { category: 'Registry & Lab Testing', budgetL: 4.5, spentL: 3.8 },
  { category: 'Training & Capacity Building', budgetL: 2.5, spentL: 2.1 },
  { category: 'Overhead & Contingency', budgetL: 2.0, spentL: 1.4 },
];



// ── Live Alerts feed (Interactive cross-tab events) ──
export const alerts = [
  { id: 1, type: 'warning', targetTab: 'satellite', message: 'Plot F-0312 (Moonak) flagged for NBR anomaly — automated Sentinel-2 verify in progress', time: '8 min ago', icon: 'satellite' },
  { id: 2, type: 'success', targetTab: 'kilns', message: 'Kiln K-014 completed pyrolysis cycle (620°C) — 2.4t high-durability biochar produced', time: '22 min ago', icon: 'flame' },
  { id: 3, type: 'success', targetTab: 'credits', message: 'Lot PURO-2025-IN-012 verified by VVB — 85 CORCs minted on Puro.earth', time: '1 hr ago', icon: 'award' },
  { id: 4, type: 'info', targetTab: 'finance', message: 'PFMS DBT Batch #PB-024 (₹11.38L, 50 farmers) disbursed to Aadhaar bank accounts', time: '2 hrs ago', icon: 'wallet' },
  { id: 5, type: 'info', targetTab: 'buyers', message: 'Microsoft Sustainability offtake: Delivery scheduled for June 15, 2025 (120t)', time: '4 hrs ago', icon: 'briefcase' },
  { id: 6, type: 'success', targetTab: 'farmers', message: 'Sangrur Cluster: 100/100 enrolled farmers achieved 100% zero-burn compliance', time: '6 hrs ago', icon: 'users' },
  { id: 7, type: 'warning', targetTab: 'kilns', message: 'Kiln K-019 thermocouple sensor calibrated — back to online telemetry status', time: '12 hrs ago', icon: 'wrench' },
  { id: 8, type: 'info', targetTab: 'satellite', message: 'Sentinel-2 satellite pass completed over Ludhiana & Karnal clusters', time: '1 day ago', icon: 'satellite' },
];

// ── Payout ledger (1:1 with all 500 farmers) ──
export const payouts = farmers.map((farmer, i) => ({
  id: `PB-${String(i + 1).padStart(4, '0')}`,
  farmerId: farmer.id,
  farmerName: farmer.name,
  fpo: farmer.fpo,
  cluster: farmer.cluster,
  village: farmer.village,
  enrolledAcres: farmer.enrolledAcres,
  ratePerAcre: 9100,
  amount: farmer.totalEarnings,
  date: `2025-05-${String((i % 28) + 1).padStart(2, '0')}`,
  status: farmer.payoutStatus === 'completed' ? 'Success' : 'Processing',
  pfmsRef: farmer.payoutStatus === 'completed' ? `PFMS-${String(849200 + i)}` : 'PFMS-PENDING',
  bankRef: farmer.payoutStatus === 'completed' ? `UTR${String(7720918230 + i)}` : '—',
}));
