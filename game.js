/**
 * ZERO AO BILHÃO: O BANQUEIRO v10.0 PRO
 * Simulador Mobile Completo de Banco, Crédito e Empréstimos
 * Features: Swipe Deck Tinder-style, Chat de Cobrança WhatsApp, Leilão Judicial,
 * Tesouro Selic, Conselho C-Level, Lo-Fi Synth Music & Confetti Engine.
 */

// =============================================================================
// Web Audio API Synthesizer 2.0 (Efeitos Sonoros & Lo-Fi Music Synth Nativo)
// =============================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.musicEnabled = false;
    this.musicInterval = null;
    this.musicStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  // Efeitos Sonoros (SFX)
  playCash() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(987.77, now);
      osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.12);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1567.98, now + 0.08);
      gain2.gain.setValueAtTime(0.25, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.45);
    } catch (e) {}
  }

  playWoosh() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  playStamp() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {}
  }

  playGavel() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Martelo do Leilão Judicial (impacto seco de madeira)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.2);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  playReject() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(150, now + 0.1);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  playFanfare() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      });
    } catch (e) {}
  }

  // Música Ambiente Lo-Fi Synth Gerada Dinamicamente
  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    const waves = document.getElementById("music-waves");

    if (this.musicEnabled) {
      this.init();
      if (waves) waves.classList.add("active");
      this.startLoFiBeat();
      showToast("🎵 Música Lo-Fi Ambiente ativada!", "toast-success");
    } else {
      if (waves) waves.classList.remove("active");
      if (this.musicInterval) {
        clearInterval(this.musicInterval);
        this.musicInterval = null;
      }
      showToast("🔇 Música Ambiente pausada.", "toast-warning");
    }
  }

  startLoFiBeat() {
    if (!this.ctx) return;
    // Escala pentatônica menor suave (Lo-Fi Fintech Vibe)
    const chords = [
      [261.63, 311.13, 392.00, 466.16], // Cm7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23]  // G7
    ];

    this.musicInterval = setInterval(() => {
      if (!this.musicEnabled || !this.ctx) return;
      try {
        const chord = chords[Math.floor(this.musicStep / 4) % chords.length];
        const note = chord[this.musicStep % chord.length];
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);

        this.musicStep++;
      } catch (e) {}
    }, 650);
  }
}

const sounds = new SoundFX();

// =============================================================================
// Confetti Engine Nativo (Partículas de Vitória e Comemoração)
// =============================================================================
class ConfettiEngine {
  constructor() {
    this.canvas = document.getElementById("confetti-canvas");
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.particles = [];
    this.animId = null;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  fire(count = 60) {
    if (!this.ctx) return;
    const colors = ["#00f076", "#00d2ff", "#fbbf24", "#f43f5e", "#a855f7", "#ffffff"];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() * 200 - 100),
        y: this.canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 1.2) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        alpha: 1
      });
    }

    if (!this.animId) {
      this.loop();
    }
  }

  loop() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // gravidade
      p.rotation += p.vr;
      p.alpha -= 0.012;

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();

      if (p.alpha <= 0 || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.loop());
    } else {
      this.animId = null;
    }
  }
}

let confetti = null;

// =============================================================================
// Estado do Jogo (Game State v10.0 PRO)
// =============================================================================
const INITIAL_STATE = {
  bankName: "Nexus Bank",
  bankTheme: "theme-emerald",
  cash: 50000,
  treasuryBalance: 0,
  day: 1,
  month: 1,
  selic: 11.25,
  reputation: 85,
  peakNetWorth: 50000,
  netWorthHistory: [50000],

  stats: {
    totalLoaned: 0,
    totalInterestEarned: 0,
    totalDefaultLost: 0,
    totalDeals: 0,
    seizuresCount: 0
  },

  executives: {
    cfoHelena: false,
    faustoRisk: false,
    brutusCollector: false,
    enzoCMO: false
  },

  upgrades: {
    officePaulista: false,
    officeFariaLima: false,
    officeDigital: false,
    aiScore: false,
    facialAntifraud: false,
    proCollectors: false,
    eliteLawyers: false,
    trafficAds: false,
    soccerSponsor: false
  },

  activeCDBs: {
    cdbDiario: 0,
    cdbAnjo: 0,
    cdbPrivate: 0,
    cdbDebenture: 0
  },

  activeLoans: [],
  clientQueue: [],
  achievements: {
    firstLoan: false,
    netWorth100k: false,
    netWorth1M: false,
    netWorth10M: false,
    netWorth100M: false,
    netWorth1B: false,
    auditMaster: false,
    seizureChamp: false
  }
};

let gameState = JSON.parse(JSON.stringify(INITIAL_STATE));
let gameInterval = null;
let gameSpeed = 0; // 0: pause, 1: 1x, 3: 3x

// =============================================================================
// Configurações & Dados do Jogo
// =============================================================================
const BANK_TIERS = [
  { min: 0, name: "Agiota de Bairro" },
  { min: 150000, name: "Correspondente Bancário" },
  { min: 750000, name: "Financeira Regional" },
  { min: 3500000, name: "Banco de Investimentos" },
  { min: 30000000, name: "Fintech Unicórnio" },
  { min: 250000000, name: "Conglomerado Global" },
  { min: 1000000000, name: "Império do Bilhão 👑" }
];

const EXECUTIVES_CONFIG = [
  {
    id: "cfoHelena",
    name: "Dra. Helena Rothschild",
    role: "Diretora Financeira (CFO)",
    avatar: "👩‍💼",
    cost: 40000,
    perk: "+0.3% a.m. de rendimento extra no Tesouro Selic e melhor margem de captação."
  },
  {
    id: "faustoRisk",
    name: "Dr. Fausto Compliance",
    role: "Head de Risco & Bacen",
    avatar: "👨‍⚖️",
    cost: 75000,
    perk: "Auditoria automática de 100% dos clientes e imunidade a multas regulatórias."
  },
  {
    id: "brutusCollector",
    name: "Brutus 'Cobrador'",
    role: "Chefe de Operações de Cobrança",
    avatar: "🕵️",
    cost: 50000,
    perk: "+40% de sucesso em negociações e leilões de bens devedores."
  },
  {
    id: "enzoCMO",
    name: "Enzo Marketing Viral",
    role: "Chief Marketing Officer (CMO)",
    avatar: "🚀",
    cost: 90000,
    perk: "+4 clientes VIP de alto patrimônio por dia na sua mesa de crédito."
  }
];

const UPGRADES_CONFIG = [
  {
    id: "aiScore",
    title: "IA Preditiva de Crédito",
    cost: 25000,
    icon: "🧠",
    desc: "Calcula automaticamente a probabilidade exata de calote de cada cliente."
  },
  {
    id: "trafficAds",
    title: "Tráfego Pago & Meta Ads",
    cost: 35000,
    icon: "📱",
    desc: "+3 solicitações de empréstimo adicionais todos os dias."
  },
  {
    id: "proCollectors",
    title: "Call Center Automatizado",
    cost: 65000,
    icon: "📞",
    desc: "Cobre devedores com robôs e dobre a recuperação amigável de parcelas."
  },
  {
    id: "officePaulista",
    title: "Sede Comercial na Av. Paulista",
    cost: 150000,
    icon: "🏢",
    desc: "Reputação base elevada para 92% e atrai empresas médias."
  },
  {
    id: "facialAntifraud",
    title: "Biometria Facial Antifraude",
    cost: 200000,
    icon: "🛡️",
    desc: "Bloqueia 100% de golpistas e CPFs falsos antes de chegarem à mesa."
  },
  {
    id: "eliteLawyers",
    title: "Banca Jurídica Corporativa",
    cost: 450000,
    icon: "⚖️",
    desc: "Penhoras e leilões judiciais ocorrem com 100% de velocidade e êxito."
  },
  {
    id: "officeFariaLima",
    title: "Torre Faria Lima High-Tech",
    cost: 2000000,
    icon: "🏛️",
    desc: "Desbloqueia clientes corporativos e pedidos de até R$ 2.000.000."
  },
  {
    id: "soccerSponsor",
    title: "Patrocínio Máster no Futebol",
    cost: 5000000,
    icon: "⚽",
    desc: "Aumenta a capacidade de captação de CDBs de investidores em 400%."
  },
  {
    id: "officeDigital",
    title: "Sede Global na Nuvem",
    cost: 25000000,
    icon: "🌐",
    desc: "Infraestrutura financeira de classe mundial para o topo do sistema."
  }
];

const CDB_CONFIG = [
  {
    id: "cdbDiario",
    name: "CDB Liquidez Diária",
    amount: 30000,
    costRate: 0.8,
    desc: "Captação simples de pequenos correntistas."
  },
  {
    id: "cdbAnjo",
    name: "CDB Investidor Qualificado",
    amount: 150000,
    costRate: 1.0,
    desc: "Investidores que buscam 100% do CDI."
  },
  {
    id: "cdbPrivate",
    name: "CDB Private Banking",
    amount: 800000,
    costRate: 1.2,
    desc: "Grandes fortunas aportando liquidez."
  },
  {
    id: "cdbDebenture",
    name: "Debêntures Institucionais",
    amount: 5000000,
    costRate: 1.4,
    desc: "Emissão de dívida para fundos de pensão."
  }
];

const FIRST_NAMES = ["Carlos", "Mariana", "Lucas", "Beatriz", "Ricardo", "Juliana", "Rodrigo", "Camila", "Felipe", "Vanessa", "Mateus", "Aline", "Gabriel", "Patricia", "Rafael", "Tatiane", "Thiago", "Fernanda", "Gustavo", "Renata", "Arthur", "Letícia", "Bruno", "Monique"];
const LAST_NAMES = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa", "Menezes", "Nakamura"];

const CLIENT_PROFILES = [
  { profession: "Dono de Padaria", purpose: "Novo forno italiano & estoque", baseIncome: 9500, risk: "low", icon: "🥖" },
  { profession: "Dev Sênior Remoto", purpose: "Entrada em imóvel próprio", baseIncome: 22000, risk: "low", icon: "💻" },
  { profession: "Médica Cirurgiã", purpose: "Equipamentos a laser p/ clínica", baseIncome: 38000, risk: "low", icon: "🩺" },
  { profession: "Arquiteta Urbanista", purpose: "Capital de giro para projetos", baseIncome: 14000, risk: "mid", icon: "📐" },
  { profession: "Motorista de Frota", purpose: "Quitar veículo de trabalho", baseIncome: 4800, risk: "mid", icon: "🚗" },
  { profession: "Dona de Loja de Roupas", purpose: "Coleção de inverno & marketing", baseIncome: 8500, risk: "mid", icon: "👗" },
  { profession: "Trader Autônomo", purpose: "Alavancagem em minicontratos", baseIncome: 12000, risk: "high", icon: "📈" },
  { profession: "Criador de Conteúdo", purpose: "Estúdio profissional de podcast", baseIncome: 25000, risk: "mid", icon: "🎙️" },
  { profession: "Apostador de Bet", purpose: "Recuperar banca após derrota", baseIncome: 4500, risk: "extreme", icon: "🎲" },
  { profession: "Produtor de Grãos Agro", purpose: "Aquisição de fertilizantes", baseIncome: 75000, risk: "low", icon: "🌾" },
  { profession: "Advogado Empresarial", purpose: "Reforma de escritório Faria Lima", baseIncome: 32000, risk: "low", icon: "⚖️" }
];

const COLLATERAL_TYPES = [
  { name: "Sem Garantia", recoveryRate: 0, chance: 0.45 },
  { name: "Veículo (Carro/Moto)", recoveryRate: 0.75, chance: 0.30 },
  { name: "Imóvel Escriturado", recoveryRate: 1.15, chance: 0.15 },
  { name: "Carteira de Ações B3", recoveryRate: 0.85, chance: 0.10 }
];

// =============================================================================
// Inicialização do Jogo
// =============================================================================
function initGame() {
  confetti = new ConfettiEngine();
  loadGame();
  setupUIEventListeners();
  setupSwipeDeck();
  renderAll();

  if (gameState.clientQueue.length === 0) {
    for (let i = 0; i < 5; i++) {
      generateClient();
    }
  }

  updateSwipeCardView();
  updateClock();
  setInterval(updateClock, 1000);

  // Auto-save a cada 15s
  setInterval(() => {
    saveGame(false);
  }, 15000);
}

function saveGame(showToastMsg = true) {
  try {
    localStorage.setItem("zero_ao_bilhao_v10_save", JSON.stringify(gameState));
    if (showToastMsg) {
      showToast("💾 Jogo salvo com sucesso!", "toast-success");
    }
  } catch (e) {
    console.error("Erro ao salvar:", e);
  }
}

function loadGame() {
  try {
    const saved = localStorage.getItem("zero_ao_bilhao_v10_save");
    if (saved) {
      const parsed = JSON.parse(saved);
      gameState = Object.assign({}, INITIAL_STATE, parsed);
      gameState.stats = Object.assign({}, INITIAL_STATE.stats, parsed.stats || {});
      gameState.executives = Object.assign({}, INITIAL_STATE.executives, parsed.executives || {});
      gameState.upgrades = Object.assign({}, INITIAL_STATE.upgrades, parsed.upgrades || {});
      gameState.activeCDBs = Object.assign({}, INITIAL_STATE.activeCDBs, parsed.activeCDBs || {});
      gameState.achievements = Object.assign({}, INITIAL_STATE.achievements, parsed.achievements || {});
      if (!Array.isArray(gameState.activeLoans)) gameState.activeLoans = [];
      if (!Array.isArray(gameState.clientQueue)) gameState.clientQueue = [];
      if (!Array.isArray(gameState.netWorthHistory)) gameState.netWorthHistory = [50000];

      // Aplica tema salvo
      if (gameState.bankTheme) {
        setTheme(gameState.bankTheme, false);
      }
    }
  } catch (e) {
    console.error("Erro ao carregar:", e);
  }
}

function resetGame() {
  if (confirm("⚠️ Tem certeza que deseja reiniciar todo o império financeiro? O jogo voltará para o Dia 1 com R$ 50.000.")) {
    localStorage.removeItem("zero_ao_bilhao_v10_save");
    gameState = JSON.parse(JSON.stringify(INITIAL_STATE));
    for (let i = 0; i < 5; i++) {
      generateClient();
    }
    renderAll();
    updateSwipeCardView();
    showToast("Novo banco fundado! Rumo ao R$ 1 Bilhão!", "toast-warning");
  }
}

// =============================================================================
// Cálculos Financeiros & Balanço
// =============================================================================
function formatCurrency(val) {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
}

function calculateReceivables() {
  return gameState.activeLoans.reduce((acc, loan) => {
    if (loan.status === "paid") return acc;
    const remaining = loan.totalInstallments - loan.paidInstallments;
    return acc + (remaining * loan.installmentValue);
  }, 0);
}

function calculateDebts() {
  let total = 0;
  for (const key in gameState.activeCDBs) {
    const cdb = CDB_CONFIG.find(c => c.id === key);
    if (cdb) {
      total += (gameState.activeCDBs[key] || 0) * cdb.amount;
    }
  }
  return total;
}

function calculateNetWorth() {
  return gameState.cash + (gameState.treasuryBalance || 0) + calculateReceivables() - calculateDebts();
}

function calculateBasileia() {
  const capital = calculateNetWorth();
  const riskAssets = calculateReceivables();
  if (riskAssets <= 0) return 99;
  return Math.max(8, Math.min(99, Math.round((capital / riskAssets) * 100)));
}

function getBankTier() {
  const net = calculateNetWorth();
  let current = BANK_TIERS[0];
  for (const tier of BANK_TIERS) {
    if (net >= tier.min) {
      current = tier;
    }
  }
  return current;
}

// =============================================================================
// Gerador de Clientes (Propostas de Empréstimo)
// =============================================================================
function generateClient() {
  const profile = CLIENT_PROFILES[Math.floor(Math.random() * CLIENT_PROFILES.length)];
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

  const net = Math.max(calculateNetWorth(), 50000);
  let maxAmount = 25000;
  if (gameState.upgrades.officePaulista) maxAmount = 90000;
  if (gameState.upgrades.officeFariaLima) maxAmount = 600000;
  if (gameState.upgrades.officeDigital) maxAmount = 8000000;
  if (gameState.executives.enzoCMO) maxAmount *= 1.5;

  const baseRange = Math.min(net * 0.45, maxAmount);
  const minAmount = Math.max(3000, Math.floor(baseRange * 0.12));
  const requestedAmount = Math.floor((Math.random() * (baseRange - minAmount) + minAmount) / 500) * 500;

  const totalInstallments = [3, 4, 6, 8, 10, 12][Math.floor(Math.random() * 6)];

  let trueScore = Math.floor(Math.random() * 700 + 250);
  if (profile.risk === "extreme") trueScore = Math.floor(Math.random() * 300 + 120);
  if (profile.risk === "low") trueScore = Math.floor(Math.random() * 320 + 640);

  const isFraud = Math.random() < (gameState.upgrades.facialAntifraud ? 0 : 0.08);
  const declaredScore = isFraud ? Math.min(950, trueScore + 320) : (Math.random() < 0.2 ? Math.min(920, trueScore + 140) : trueScore);

  const randColl = Math.random();
  let accum = 0;
  let chosenCollateral = COLLATERAL_TYPES[0];
  for (const coll of COLLATERAL_TYPES) {
    accum += coll.chance;
    if (randColl <= accum) {
      chosenCollateral = coll;
      break;
    }
  }

  // Auto-auditado se tiver Diretor de Risco ou IA
  const autoAudited = !!(gameState.executives.faustoRisk || gameState.upgrades.aiScore);

  const client = {
    id: "cli_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    name: `${firstName} ${lastName}`,
    profession: profile.profession,
    purpose: profile.purpose,
    icon: profile.icon,
    declaredIncome: profile.baseIncome * (1 + (Math.random() * 0.3 - 0.15)),
    trueIncome: profile.baseIncome,
    declaredScore: declaredScore,
    trueScore: trueScore,
    isFraud: isFraud,
    audited: autoAudited,
    requestedAmount: requestedAmount,
    totalInstallments: totalInstallments,
    collateral: chosenCollateral,
    selectedRate: 5.5
  };

  gameState.clientQueue.push(client);
  updateInboxBadge();
}

function getCurrentClient() {
  return gameState.clientQueue[0] || null;
}

// =============================================================================
// Deck de Swipe Interativo (Estilo Tinder / Reigns)
// =============================================================================
let isDraggingCard = false;
let startX = 0;
let currentX = 0;
const SWIPE_THRESHOLD = 90;

function setupSwipeDeck() {
  const deck = document.getElementById("swipe-deck");
  if (!deck) return;

  const card = document.getElementById("active-swipe-card");
  const stampApprove = document.getElementById("stamp-approve-visual");
  const stampReject = document.getElementById("stamp-reject-visual");

  const onStart = (clientX) => {
    if (!getCurrentClient()) return;
    isDraggingCard = true;
    startX = clientX;
    currentX = clientX;
    card.style.transition = "none";
  };

  const onMove = (clientX) => {
    if (!isDraggingCard) return;
    currentX = clientX;
    const deltaX = currentX - startX;
    const rotate = deltaX * 0.08;

    card.style.transform = `translate3d(${deltaX}px, 0, 0) rotate(${rotate}deg)`;

    if (deltaX > 25) {
      const opacity = Math.min(1, (deltaX - 25) / 75);
      stampApprove.style.opacity = opacity;
      stampReject.style.opacity = 0;
      card.classList.add("swiping-right");
      card.classList.remove("swiping-left");
    } else if (deltaX < -25) {
      const opacity = Math.min(1, (-deltaX - 25) / 75);
      stampReject.style.opacity = opacity;
      stampApprove.style.opacity = 0;
      card.classList.add("swiping-left");
      card.classList.remove("swiping-right");
    } else {
      stampApprove.style.opacity = 0;
      stampReject.style.opacity = 0;
      card.classList.remove("swiping-right", "swiping-left");
    }
  };

  const onEnd = () => {
    if (!isDraggingCard) return;
    isDraggingCard = false;
    const deltaX = currentX - startX;

    stampApprove.style.opacity = 0;
    stampReject.style.opacity = 0;
    card.classList.remove("swiping-right", "swiping-left");

    if (deltaX > SWIPE_THRESHOLD) {
      // Swipe Right -> APROVAR
      card.style.transition = "transform 0.25s ease-out";
      card.style.transform = "translate3d(400px, 0, 0) rotate(30deg)";
      sounds.playWoosh();
      setTimeout(() => {
        approveCurrentClient();
        resetCardTransform();
      }, 200);
    } else if (deltaX < -SWIPE_THRESHOLD) {
      // Swipe Left -> RECUSAR
      card.style.transition = "transform 0.25s ease-out";
      card.style.transform = "translate3d(-400px, 0, 0) rotate(-30deg)";
      sounds.playWoosh();
      setTimeout(() => {
        rejectCurrentClient();
        resetCardTransform();
      }, 200);
    } else {
      // Retorna ao centro
      card.style.transition = "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      card.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
    }
  };

  // Mouse Listeners
  card.addEventListener("mousedown", (e) => {
    // Ignora clique em inputs ou botões dentro do card
    if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
    onStart(e.clientX);
  });
  window.addEventListener("mousemove", (e) => onMove(e.clientX));
  window.addEventListener("mouseup", onEnd);

  // Touch Listeners (Mobile Nativo)
  card.addEventListener("touchstart", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
    onStart(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (isDraggingCard && e.touches[0]) {
      onMove(e.touches[0].clientX);
    }
  }, { passive: true });
  window.addEventListener("touchend", onEnd);
}

function resetCardTransform() {
  const card = document.getElementById("active-swipe-card");
  if (!card) return;
  card.style.transition = "none";
  card.style.transform = "translate3d(0, 0, 0) scale(0.95)";
  setTimeout(() => {
    card.style.transition = "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    card.style.transform = "translate3d(0, 0, 0) scale(1)";
  }, 30);
}

// Render do Card Ativo do Deck
function updateSwipeCardView() {
  const container = document.getElementById("active-swipe-card");
  const client = getCurrentClient();

  if (!client) {
    container.innerHTML = `
      <div class="empty-state-simple">
        <div style="font-size: 32px; margin-bottom: 8px;">⏳</div>
        <h3>Mesa Limpa por Enquanto!</h3>
        <p>Acelere o tempo ou avance 1 Dia para receber novas propostas de tomadores de crédito.</p>
      </div>
    `;
    return;
  }

  let scoreClass = "score-low";
  const displayScore = client.audited ? client.trueScore : client.declaredScore;
  if (displayScore >= 700) scoreClass = "score-high";
  else if (displayScore >= 450) scoreClass = "score-mid";

  const rate = client.selectedRate / 100;
  const n = client.totalInstallments;
  const factor = Math.pow(1 + rate, n);
  const estInstallment = Math.round((client.requestedAmount * (rate * factor) / (factor - 1)) * 100) / 100;
  const estimatedProfit = (estInstallment * n) - client.requestedAmount;

  container.innerHTML = `
    <div class="client-header">
      <div class="client-avatar-wrap">
        ${client.icon}
        <span class="avatar-badge-score ${scoreClass}">${displayScore}</span>
      </div>
      <div class="client-info">
        <h3>${client.name}</h3>
        <span class="client-profession">${client.profession}</span>
        <div class="client-badges">
          <span class="badge-tag badge-purpose">${client.purpose}</span>
          <span class="badge-tag badge-collateral">${client.collateral.name}</span>
          ${client.audited && client.isFraud ? `<span class="badge-tag badge-warning">🚨 FRAUDE</span>` : ''}
        </div>
      </div>
    </div>

    <div class="loan-amount-box">
      <div class="loan-requested-label">Solicitação de Crédito</div>
      <div class="loan-requested-val">R$ ${formatCurrency(client.requestedAmount)}</div>
      <div class="loan-terms-sub">Prazo: <strong>${client.totalInstallments} parcelas mensais</strong></div>
    </div>

    <div class="client-data-grid">
      <div class="data-row-card">
        <span class="data-row-label">Renda Comprovada</span>
        <span class="data-row-val">R$ ${formatCurrency(client.audited ? client.trueIncome : client.declaredIncome)}</span>
      </div>
      <div class="data-row-card">
        <span class="data-row-label">Score Serasa</span>
        <span class="data-row-val text-${displayScore >= 700 ? 'emerald' : displayScore >= 450 ? 'gold' : 'rose'}">${displayScore} / 1000</span>
      </div>
    </div>

    <div class="interest-slider-box">
      <div class="slider-label-row">
        <span>Taxa de Juros do Contrato:</span>
        <span class="slider-val-tag" id="interest-rate-val">${client.selectedRate.toFixed(1)}% a.m.</span>
      </div>
      <input type="range" class="styled-range" id="interest-slider" min="2.0" max="18.0" step="0.5" value="${client.selectedRate}">
      <div class="projected-profit-row">
        <span>Parcela: <strong>R$ ${formatCurrency(estInstallment)}/mês</strong></span>
        <span>Lucro previsto: <strong class="text-emerald">+R$ ${formatCurrency(estimatedProfit)}</strong></span>
      </div>
    </div>
  `;

  const slider = document.getElementById("interest-slider");
  if (slider) {
    slider.addEventListener("input", (e) => {
      client.selectedRate = parseFloat(e.target.value);
      updateSwipeCardView();
    });
  }
}

// =============================================================================
// Ações da Mesa (Aprovar / Recusar / Contraproposta / Dossiê)
// =============================================================================
function approveCurrentClient() {
  const client = getCurrentClient();
  if (!client) return;

  if (gameState.cash < client.requestedAmount) {
    sounds.playReject();
    showToast("⚠️ Caixa insuficiente! Resgate do Tesouro ou capte CDBs.", "toast-danger");
    return;
  }

  gameState.cash -= client.requestedAmount;

  const rate = client.selectedRate / 100;
  const n = client.totalInstallments;
  const factor = Math.pow(1 + rate, n);
  const installmentValue = Math.round((client.requestedAmount * (rate * factor) / (factor - 1)) * 100) / 100;

  const contract = {
    id: "loan_" + Date.now(),
    borrowerName: client.name,
    profession: client.profession,
    originalAmount: client.requestedAmount,
    totalInstallments: n,
    paidInstallments: 0,
    installmentValue: installmentValue,
    interestRate: client.selectedRate,
    collateral: client.collateral,
    trueScore: client.trueScore,
    isFraud: client.isFraud,
    daysDelinquent: 0,
    status: "active"
  };

  gameState.activeLoans.push(contract);
  gameState.stats.totalLoaned += client.requestedAmount;
  gameState.stats.totalDeals++;
  gameState.achievements.firstLoan = true;

  sounds.playCash();
  confetti.fire(35);
  showToast(`🎉 Empréstimo de R$ ${formatCurrency(client.requestedAmount)} aprovado!`, "toast-success");

  gameState.clientQueue.shift();
  updateSwipeCardView();
  renderBalances();
  renderLoansList();
  updateInboxBadge();
}

function rejectCurrentClient() {
  const client = getCurrentClient();
  if (!client) return;

  sounds.playReject();
  showToast(`✕ Proposta de ${client.name} recusada.`, "toast-warning");
  gameState.clientQueue.shift();
  updateSwipeCardView();
  updateInboxBadge();
}

function openDossierModal() {
  const client = getCurrentClient();
  if (!client) return;

  // Custo de consulta se não for auto-auditado
  if (!client.audited) {
    const AUDIT_COST = 200;
    if (gameState.cash < AUDIT_COST) {
      showToast("Saldo insuficiente para consulta Serasa (R$ 200)!", "toast-danger");
      return;
    }
    gameState.cash -= AUDIT_COST;
    client.audited = true;
    gameState.achievements.auditMaster = true;
    sounds.playStamp();
    renderBalances();
  }

  document.getElementById("dossier-client-name").textContent = `Dossiê: ${client.name}`;
  const body = document.getElementById("dossier-body");

  // Risco calculado
  let riskText = "Baixo Risco (Excelente Pagador)";
  let riskClass = "text-emerald";
  if (client.trueScore < 450) {
    riskText = "Altíssimo Risco (Histórico de Inadimplência)";
    riskClass = "text-rose";
  } else if (client.trueScore < 680) {
    riskText = "Médio Risco (Risco Moderado)";
    riskClass = "text-gold";
  }

  body.innerHTML = `
    <div class="dossier-row">
      <span>Profissão / Ocupação:</span>
      <strong>${client.profession}</strong>
    </div>
    <div class="dossier-row">
      <span>Renda Mensal Declarada:</span>
      <strong>R$ ${formatCurrency(client.declaredIncome)}</strong>
    </div>
    <div class="dossier-row">
      <span>Renda Real Comprovada (IRPF):</span>
      <strong class="text-cyan">R$ ${formatCurrency(client.trueIncome)}</strong>
    </div>
    <div class="dossier-row">
      <span>Score Serasa Real:</span>
      <strong class="${riskClass}">${client.trueScore} pontos</strong>
    </div>
    <div class="dossier-row">
      <span>Garantia Ofertada:</span>
      <strong class="text-gold">${client.collateral.name}</strong>
    </div>
    <div class="dossier-row">
      <span>Diagnóstico Antifraude:</span>
      <strong class="${client.isFraud ? 'text-rose' : 'text-emerald'}">
        ${client.isFraud ? "🚨 ALERTA MÁXIMO: TENTATIVA DE GOLPE IDENTIFICADA!" : "✅ Identidade e Biometria Legítimas"}
      </strong>
    </div>
    <div style="margin-top: 14px;">
      <button class="btn-primary-action" onclick="closeModal('dossier-modal')">Entendido</button>
    </div>
  `;

  openModal('dossier-modal');
  updateSwipeCardView();
}

function makeCounterOffer() {
  const client = getCurrentClient();
  if (!client) return;

  // Exige garantia melhor ou reduz valor
  if (client.collateral.recoveryRate === 0) {
    client.collateral = COLLATERAL_TYPES[1]; // Veículo
    showToast("🤝 Contraproposta aceita! O cliente ofereceu um Veículo como garantia.", "toast-success");
  } else {
    client.requestedAmount = Math.round(client.requestedAmount * 0.8);
    client.selectedRate = Math.min(18, client.selectedRate + 1.5);
    showToast("🤝 Contraproposta aceita! Valor reduzido em 20% com juros reajustados.", "toast-success");
  }

  sounds.playStamp();
  updateSwipeCardView();
}

// =============================================================================
// WhatsApp Chat de Cobrança (Mini-Game Interativo de Negociação)
// =============================================================================
let activeNegotiatingLoan = null;

function openCollectionChat(loanId) {
  const loan = gameState.activeLoans.find(l => l.id === loanId);
  if (!loan) return;

  activeNegotiatingLoan = loan;
  document.getElementById("chat-contact-name").textContent = loan.borrowerName;
  document.getElementById("chat-avatar-icon").textContent = "👤";

  const container = document.getElementById("chat-messages-container");
  const options = document.getElementById("chat-options-container");

  container.innerHTML = `
    <div class="chat-bubble debtor">
      Olá... Vi a mensagem de cobrança do ${gameState.bankName}. Estou passando por um momento difícil no trabalho e atrasei a parcela de R$ ${formatCurrency(loan.installmentValue)}.
    </div>
  `;

  options.innerHTML = `
    <button class="btn-chat-reply" onclick="replyChat('friendly')">
      🕊️ "Podemos perdoar os juros de mora se você pagar a parcela hoje."
    </button>
    <button class="btn-chat-reply" onclick="replyChat('firm')">
      ⚖️ "Se não pagar em 24h, seu CPF irá ao SPC e penhoraremos seus bens!"
    </button>
    <button class="btn-chat-reply" onclick="replyChat('discount')">
      🤝 "Pague metade do valor à vista e refinanciamos o restante."
    </button>
  `;

  openModal('chat-modal');
}

function replyChat(type) {
  if (!activeNegotiatingLoan) return;
  const loan = activeNegotiatingLoan;
  const container = document.getElementById("chat-messages-container");
  const options = document.getElementById("chat-options-container");

  let replyText = "";
  let debtorReaction = "";
  let isSettled = false;

  // Bônus se tiver o cobrador Brutus
  const collectorBonus = gameState.executives.brutusCollector ? 0.35 : 0;

  if (type === 'friendly') {
    replyText = "Podemos perdoar os juros de mora se você pagar a parcela hoje.";
    if (Math.random() < 0.65 + collectorBonus) {
      debtorReaction = "Muito obrigado pela compreensão! Acabei de fazer o Pix da parcela.";
      isSettled = true;
    } else {
      debtorReaction = "Mesmo sem os juros ainda está pesado... Preciso de mais tempo.";
    }
  } else if (type === 'firm') {
    replyText = "Se não pagar em 24h, seu CPF irá ao SPC e penhoraremos seus bens!";
    if (Math.random() < 0.50 + collectorBonus) {
      debtorReaction = "Calma, pelo amor de Deus! Não quero meu nome sujo, já fiz a transferência!";
      isSettled = true;
    } else {
      debtorReaction = "Pode colocar na justiça então! Não tenho como pagar agora.";
    }
  } else {
    replyText = "Pague metade do valor à vista e refinanciamos o restante.";
    debtorReaction = "Fechado! Paguei metade agora e assumo o compromisso do restante.";
    isSettled = true;
  }

  container.innerHTML += `
    <div class="chat-bubble banker">${replyText}</div>
  `;

  setTimeout(() => {
    container.innerHTML += `
      <div class="chat-bubble debtor">${debtorReaction}</div>
    `;
    container.scrollTop = container.scrollHeight;

    if (isSettled) {
      loan.status = "active";
      loan.daysDelinquent = 0;
      loan.paidInstallments++;
      gameState.cash += (type === 'discount' ? loan.installmentValue * 0.5 : loan.installmentValue);
      sounds.playCash();
      confetti.fire(25);
      renderBalances();
      renderLoansList();
    } else {
      sounds.playReject();
    }

    options.innerHTML = `
      <button class="btn-primary-action" onclick="closeModal('chat-modal')">Encerrar Conversa</button>
    `;
  }, 600);
}

// =============================================================================
// Leilão Judicial (Mini-Game com Martelo do Juiz)
// =============================================================================
let activeAuctionLoan = null;
let currentAuctionBid = 0;
let auctionInterval = null;

function startJudicialAuction(loanId) {
  const loan = gameState.activeLoans.find(l => l.id === loanId);
  if (!loan || loan.collateral.recoveryRate <= 0) return;

  activeAuctionLoan = loan;
  const remainingDebt = (loan.totalInstallments - loan.paidInstallments) * loan.installmentValue;
  currentAuctionBid = Math.round(remainingDebt * 0.5);

  document.getElementById("auction-item-title").textContent = `Penhora: ${loan.collateral.name} (${loan.borrowerName})`;
  document.getElementById("auction-current-bid").textContent = `R$ ${formatCurrency(currentAuctionBid)}`;
  const log = document.getElementById("auction-log");
  log.innerHTML = `<div class="bid-entry"><span>Leilão aberto com lance inicial</span><strong>R$ ${formatCurrency(currentAuctionBid)}</strong></div>`;

  openModal('auction-modal');

  // Simulação de lances em tempo real
  let timerVal = 100;
  const timerFill = document.getElementById("auction-timer-fill");

  if (auctionInterval) clearInterval(auctionInterval);

  auctionInterval = setInterval(() => {
    timerVal -= 5;
    if (timerFill) timerFill.style.width = `${timerVal}%`;

    // Chance de novo lance
    if (Math.random() < 0.45 && timerVal > 15) {
      const increment = Math.round((Math.random() * remainingDebt * 0.2 + 500) / 100) * 100;
      currentAuctionBid += increment;
      sounds.playStamp();
      document.getElementById("auction-current-bid").textContent = `R$ ${formatCurrency(currentAuctionBid)}`;
      log.innerHTML += `<div class="bid-entry"><span>Licitante #${Math.floor(Math.random() * 800 + 100)} ofertou</span><strong class="text-gold">R$ ${formatCurrency(currentAuctionBid)}</strong></div>`;
      log.scrollTop = log.scrollHeight;
    }

    if (timerVal <= 0) {
      concludeAuction();
    }
  }, 400);

  const btnHammer = document.getElementById("btn-hammer-auction");
  if (btnHammer) {
    btnHammer.onclick = () => concludeAuction();
  }
}

function concludeAuction() {
  if (auctionInterval) {
    clearInterval(auctionInterval);
    auctionInterval = null;
  }

  if (!activeAuctionLoan) return;

  sounds.playGavel();
  confetti.fire(45);

  gameState.cash += currentAuctionBid;
  activeAuctionLoan.status = "paid";
  gameState.stats.seizuresCount++;
  gameState.achievements.seizureChamp = true;

  showToast(`🔨 BATEU O MARTELO! Bem arrematado por R$ ${formatCurrency(currentAuctionBid)}!`, "toast-success");
  closeModal('auction-modal');

  renderBalances();
  renderLoansList();
}

// =============================================================================
// Tesouro Selic 100% CDI (Reserva Segura)
// =============================================================================
function depositTreasury(amount = 10000) {
  if (gameState.cash < amount) {
    showToast("Caixa insuficiente para aplicar no Tesouro!", "toast-danger");
    return;
  }

  gameState.cash -= amount;
  gameState.treasuryBalance = (gameState.treasuryBalance || 0) + amount;
  sounds.playCash();
  showToast(`🏛️ R$ ${formatCurrency(amount)} aplicados com segurança no Tesouro Selic!`, "toast-success");

  renderBalances();
  renderTreasury();
}

function withdrawTreasury() {
  const bal = gameState.treasuryBalance || 0;
  if (bal <= 0) {
    showToast("Nenhum saldo aplicado no Tesouro Selic!", "toast-warning");
    return;
  }

  gameState.cash += bal;
  gameState.treasuryBalance = 0;
  sounds.playCash();
  showToast(`💰 R$ ${formatCurrency(bal)} resgatados do Tesouro Selic para o Caixa!`, "toast-success");

  renderBalances();
  renderTreasury();
}

// =============================================================================
// Avanço de Tempo (Turno Diário & Macroeconomia)
// =============================================================================
function passOneDay() {
  gameState.day++;
  if (gameState.day > 30) {
    gameState.day = 1;
    gameState.month++;
    processMonthlyEvents();
  }

  let dailyCashChange = 0;
  let paymentsReceived = 0;
  let newDefaults = 0;

  // Rendimento diário do Tesouro Selic
  if (gameState.treasuryBalance > 0) {
    let monthlyRate = (gameState.selic / 12);
    if (gameState.executives.cfoHelena) monthlyRate += 0.3;
    const dailyTreasuryProfit = (gameState.treasuryBalance * (monthlyRate / 100)) / 30;
    gameState.treasuryBalance += dailyTreasuryProfit;
  }

  // Cobrança dos empréstimos ativos
  for (let i = gameState.activeLoans.length - 1; i >= 0; i--) {
    const loan = gameState.activeLoans[i];
    if (loan.status === "paid" || loan.status === "defaulted") continue;

    const paymentDueToday = Math.random() < 0.28;

    if (paymentDueToday) {
      let defaultChance = 0.05;
      if (loan.trueScore < 400) defaultChance += 0.35;
      else if (loan.trueScore < 600) defaultChance += 0.15;
      if (loan.interestRate > 8.5) defaultChance += (loan.interestRate - 8.5) * 0.025;
      if (loan.isFraud) defaultChance = 0.95;

      if (Math.random() < defaultChance) {
        loan.daysDelinquent += 7;
        if (loan.daysDelinquent >= 21) {
          loan.status = "defaulted";
          newDefaults++;
          gameState.stats.totalDefaultLost += (loan.totalInstallments - loan.paidInstallments) * loan.installmentValue;
        } else {
          loan.status = "late";
        }
      } else {
        loan.paidInstallments++;
        loan.daysDelinquent = 0;
        loan.status = "active";
        dailyCashChange += loan.installmentValue;
        paymentsReceived++;

        const principalPart = loan.originalAmount / loan.totalInstallments;
        const interestPart = Math.max(0, loan.installmentValue - principalPart);
        gameState.stats.totalInterestEarned += interestPart;

        if (loan.paidInstallments >= loan.totalInstallments) {
          loan.status = "paid";
        }
      }
    }
  }

  // Custo dos CDBs emitidos
  let dailyCdbCost = 0;
  for (const key in gameState.activeCDBs) {
    const count = gameState.activeCDBs[key] || 0;
    const cdb = CDB_CONFIG.find(c => c.id === key);
    if (cdb && count > 0) {
      const monthlyCost = (cdb.amount * count) * (cdb.costRate / 100);
      dailyCdbCost += (monthlyCost / 30);
    }
  }

  dailyCashChange -= dailyCdbCost;
  gameState.cash += dailyCashChange;

  // Atualiza histórico do Sparkline
  const currentNet = calculateNetWorth();
  gameState.netWorthHistory.push(currentNet);
  if (gameState.netWorthHistory.length > 25) {
    gameState.netWorthHistory.shift();
  }

  // Gera novos clientes
  let newClientsToSpawn = 1;
  if (gameState.upgrades.trafficAds) newClientsToSpawn += 3;
  if (gameState.executives.enzoCMO) newClientsToSpawn += 4;
  if (gameState.clientQueue.length < 9) {
    for (let c = 0; c < newClientsToSpawn; c++) {
      generateClient();
    }
  }

  // Eventos Aleatórios
  checkRandomEvents();

  if (gameState.cash < 0) {
    handleInsolvency();
  }

  checkAchievements();

  if (paymentsReceived > 0) sounds.playCash();
  if (newDefaults > 0) {
    sounds.playReject();
    showToast(`⚠️ ${newDefaults} cliente(s) entraram em calote na carteira!`, "toast-danger");
  }

  renderAll();
  updateSwipeCardView();
}

function processMonthlyEvents() {
  const deltaSelic = (Math.random() * 0.5 - 0.25);
  gameState.selic = Math.max(8.0, Math.min(16.5, Math.round((gameState.selic + deltaSelic) * 100) / 100));
  showToast(`📅 Novo mês iniciado! Taxa Selic ajustada para ${gameState.selic}%`, "toast-warning");
}

function checkRandomEvents() {
  if (Math.random() > 0.08) return;

  const events = [
    {
      text: "📈 COPOM eleva taxa Selic! Mais investidores correm para seus CDBs.",
      action: () => {
        gameState.selic += 0.5;
        gameState.reputation = Math.min(100, gameState.reputation + 2);
      }
    },
    {
      text: "💥 Boom na construção civil! Valor de garantias imobiliárias sobe 20%.",
      action: () => {
        gameState.activeLoans.forEach(l => {
          if (l.collateral && l.collateral.name.includes("Imóvel")) {
            l.collateral.recoveryRate *= 1.2;
          }
        });
      }
    },
    {
      text: "🏛️ Auditoria surpresa do Banco Central. Parabéns, conformidade nota 10!",
      action: () => {
        gameState.reputation = Math.min(100, gameState.reputation + 5);
      }
    },
    {
      text: "🗞️ Matéria de capa no Valor Econômico elege seu banco a fintech do ano!",
      action: () => {
        gameState.reputation = Math.min(100, gameState.reputation + 8);
        confetti.fire(30);
      }
    }
  ];

  const chosen = events[Math.floor(Math.random() * events.length)];
  setNewsTicker(chosen.text);
  chosen.action();
}

function handleInsolvency() {
  const deficit = Math.abs(gameState.cash);
  const bailoutAmount = Math.max(30000, deficit + 10000);
  gameState.cash += bailoutAmount;
  gameState.reputation = Math.max(10, gameState.reputation - 20);
  gameState.activeCDBs.cdbDiario = (gameState.activeCDBs.cdbDiario || 0) + Math.ceil(bailoutAmount / 30000);

  sounds.playReject();
  showToast("🚨 RESGATE DO BACEN! Seu caixa zerou. Injeção de liquidez com juros de socorro.", "toast-danger");
}

// =============================================================================
// Contratação de Executivos & Upgrades
// =============================================================================
function hireExecutive(execId) {
  const exec = EXECUTIVES_CONFIG.find(e => e.id === execId);
  if (!exec) return;

  if (gameState.executives[execId]) {
    showToast("Executivo já contratado!", "toast-warning");
    return;
  }

  if (gameState.cash < exec.cost) {
    sounds.playReject();
    showToast("Caixa insuficiente para contratar este executivo!", "toast-danger");
    return;
  }

  gameState.cash -= exec.cost;
  gameState.executives[execId] = true;

  sounds.playFanfare();
  confetti.fire(30);
  showToast(`🎉 ${exec.name} assumiu como ${exec.role}!`, "toast-success");

  renderBalances();
  renderExecutives();
}

function buyUpgrade(upgradeId) {
  const upgrade = UPGRADES_CONFIG.find(u => u.id === upgradeId);
  if (!upgrade) return;

  if (gameState.upgrades[upgradeId]) {
    showToast("Este upgrade já foi adquirido!", "toast-warning");
    return;
  }

  if (gameState.cash < upgrade.cost) {
    sounds.playReject();
    showToast("Caixa insuficiente para comprar este upgrade!", "toast-danger");
    return;
  }

  gameState.cash -= upgrade.cost;
  gameState.upgrades[upgradeId] = true;

  sounds.playFanfare();
  confetti.fire(30);
  showToast(`🎉 Upgrade ${upgrade.title} ativado com sucesso!`, "toast-success");

  if (upgradeId === "officePaulista") {
    gameState.reputation = Math.max(gameState.reputation, 92);
  }

  renderBalances();
  renderUpgrades();
}

function issueCDB(cdbId) {
  const cdb = CDB_CONFIG.find(c => c.id === cdbId);
  if (!cdb) return;

  const currentCount = gameState.activeCDBs[cdbId] || 0;
  const maxLimit = gameState.upgrades.soccerSponsor ? 25 : 6;

  if (currentCount >= maxLimit) {
    showToast(`Limite máximo atingido (${maxLimit} títulos)!`, "toast-warning");
    return;
  }

  gameState.activeCDBs[cdbId] = currentCount + 1;
  gameState.cash += cdb.amount;

  sounds.playCash();
  showToast(`💰 R$ ${formatCurrency(cdb.amount)} captados via ${cdb.name}!`, "toast-success");

  renderBalances();
  renderFunding();
}

function requestEmergencyLoan() {
  const amount = 30000;
  gameState.cash += amount;
  gameState.reputation = Math.max(10, gameState.reputation - 15);
  gameState.activeCDBs.cdbDiario = (gameState.activeCDBs.cdbDiario || 0) + 1;

  sounds.playReject();
  showToast("🚨 R$ 30.000 liberados em linha de redesconto emergencial!", "toast-danger");
  renderBalances();
  renderFunding();
}

// =============================================================================
// Conquistas & Marcos Rumo ao Bilhão
// =============================================================================
function checkAchievements() {
  const net = calculateNetWorth();

  if (net > gameState.peakNetWorth) {
    gameState.peakNetWorth = net;
  }

  if (net >= 100000 && !gameState.achievements.netWorth100k) {
    gameState.achievements.netWorth100k = true;
    unlockAchievement("Patrimônio de 6 Dígitos", "Alcançou R$ 100.000 de patrimônio!");
  }
  if (net >= 1000000 && !gameState.achievements.netWorth1M) {
    gameState.achievements.netWorth1M = true;
    unlockAchievement("Primeiro Milhão", "Parabéns! R$ 1.000.000 de patrimônio!");
  }
  if (net >= 10000000 && !gameState.achievements.netWorth10M) {
    gameState.achievements.netWorth10M = true;
    unlockAchievement("Barão do Crédito", "R$ 10.000.000! Uma das maiores financeiras.");
  }
  if (net >= 100000000 && !gameState.achievements.netWorth100M) {
    gameState.achievements.netWorth100M = true;
    unlockAchievement("Magnata dos Bancos", "R$ 100.000.000 em ativos sob gestão!");
  }
  if (net >= 1000000000 && !gameState.achievements.netWorth1B) {
    gameState.achievements.netWorth1B = true;
    unlockAchievement("👑 ZERO AO BILHÃO CONCLUÍDO!", "Você conquistou R$ 1 BILHÃO DE REAIS e dominou o sistema financeiro!");
  }
}

function unlockAchievement(title, desc) {
  sounds.playFanfare();
  confetti.fire(80);
  showToast(`🏆 CONQUISTA DESBLOQUEADA: ${title}!`, "toast-success");
}

// =============================================================================
// Sparkline Chart (Gráfico em Tempo Real no Canvas)
// =============================================================================
function drawSparkline() {
  const canvas = document.getElementById("networth-sparkline");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const data = gameState.netWorthHistory || [50000];

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  if (data.length < 2) return;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  ctx.beginPath();
  data.forEach((val, i) => {
    const x = (i / (data.length - 1)) * (w - 12) + 6;
    const y = h - ((val - min) / range) * (h - 10) - 5;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-main').trim() || "#00f076";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.stroke();

  // Ponto no final
  const lastX = w - 6;
  const lastY = h - ((data[data.length - 1] - min) / range) * (h - 10) - 5;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(lastX, lastY, 3.5, 0, Math.PI * 2);
  ctx.fill();
}

// =============================================================================
// Renderização Geral de UI
// =============================================================================
function renderBalances() {
  const net = calculateNetWorth();
  const receivables = calculateReceivables();
  const debts = calculateDebts();
  const basileia = calculateBasileia();
  const tier = getBankTier();

  document.getElementById("cash-display").textContent = formatCurrency(gameState.cash);
  document.getElementById("receivable-display").textContent = `R$ ${formatCurrency(receivables)}`;
  document.getElementById("debts-display").textContent = `R$ ${formatCurrency(debts)}`;
  document.getElementById("networth-display").textContent = `R$ ${formatCurrency(net)}`;
  document.getElementById("reputation-display").textContent = `${gameState.reputation}% ★`;
  document.getElementById("bank-tier-display").textContent = tier.name;
  document.getElementById("current-day-display").textContent = `Dia ${gameState.day} • Mês ${gameState.month}`;
  document.getElementById("selic-rate-display").textContent = `Selic: ${gameState.selic}%`;
  document.getElementById("basileia-display").textContent = `Basileia: ${basileia}%`;
  document.getElementById("bank-name-display").textContent = gameState.bankName;

  // Meta do Bilhão
  const goalTarget = 1000000000;
  const progressPercent = Math.max(0.001, Math.min(100, (net / goalTarget) * 100));
  document.getElementById("goal-percentage").textContent = `${progressPercent.toFixed(3)}%`;
  document.getElementById("goal-progress-fill").style.width = `${progressPercent}%`;

  // Previsão de fluxo diário
  const activeLoans = gameState.activeLoans.filter(l => l.status === "active");
  const estimatedDailyIncome = activeLoans.reduce((a, b) => a + (b.installmentValue * 0.25), 0);
  const flowEl = document.getElementById("daily-flow-tag");
  if (flowEl) {
    flowEl.textContent = `+R$ ${formatCurrency(estimatedDailyIncome)}/dia`;
  }

  // Estatísticas
  document.getElementById("stat-total-loaned").textContent = `R$ ${formatCurrency(gameState.stats.totalLoaned)}`;
  document.getElementById("stat-interest-earned").textContent = `R$ ${formatCurrency(gameState.stats.totalInterestEarned)}`;
  document.getElementById("stat-default-lost").textContent = `R$ ${formatCurrency(gameState.stats.totalDefaultLost)}`;
  document.getElementById("stat-total-deals").textContent = gameState.stats.totalDeals;
  document.getElementById("stat-seizures-count").textContent = gameState.stats.seizuresCount;
  document.getElementById("stat-peak-networth").textContent = `R$ ${formatCurrency(gameState.peakNetWorth)}`;

  drawSparkline();
}

function updateInboxBadge() {
  const count = gameState.clientQueue.length;
  const badge = document.getElementById("nav-inbox-badge");
  const countPill = document.getElementById("pending-clients-count");

  if (badge) {
    badge.textContent = count;
    badge.classList.toggle("hidden", count === 0);
  }
  if (countPill) {
    countPill.textContent = `${count} aguardando`;
  }
}

function renderLoansList() {
  const container = document.getElementById("loans-list-container");
  const contractsCount = document.getElementById("active-contracts-count");
  const defaultRateDisplay = document.getElementById("default-rate-display");
  const monthlyForecastDisplay = document.getElementById("monthly-forecast-display");
  const lateBadge = document.getElementById("nav-late-badge");

  const activeLoans = gameState.activeLoans.filter(l => l.status !== "paid");
  const lateLoans = activeLoans.filter(l => l.status === "late" || l.status === "defaulted");

  if (contractsCount) contractsCount.textContent = activeLoans.length;

  if (defaultRateDisplay) {
    const rate = activeLoans.length > 0 ? ((lateLoans.length / activeLoans.length) * 100).toFixed(1) : "0.0";
    defaultRateDisplay.textContent = `${rate}%`;
  }

  if (monthlyForecastDisplay) {
    const monthlySum = activeLoans.reduce((a, b) => a + b.installmentValue, 0);
    monthlyForecastDisplay.textContent = `R$ ${formatCurrency(monthlySum)}`;
  }

  if (lateBadge) {
    lateBadge.classList.toggle("hidden", lateLoans.length === 0);
  }

  if (activeLoans.length === 0) {
    container.innerHTML = `
      <div class="empty-state-simple">
        <p>Nenhum contrato ativo no momento. Deslize os cartões na <strong>Mesa de Operações</strong> para aprovar seus primeiros empréstimos!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = activeLoans.map(loan => {
    const isLate = loan.status === "late";
    const isDefault = loan.status === "defaulted";
    const statusClass = isDefault ? "status-default" : (isLate ? "status-late" : "");
    const badgeText = isDefault ? "CALOTE" : (isLate ? "ATRASADO" : "EM DIA");
    const badgeClass = isDefault ? "badge-default" : (isLate ? "badge-late" : "badge-on-time");
    const progressPercent = Math.round((loan.paidInstallments / loan.totalInstallments) * 100);

    return `
      <div class="loan-item-card ${statusClass}">
        <div class="loan-top-info">
          <div>
            <div class="borrower-name">${loan.borrowerName}</div>
            <div class="borrower-meta">${loan.profession} • Taxa: ${loan.interestRate}% a.m.</div>
          </div>
          <span class="loan-status-badge ${badgeClass}">${badgeText}</span>
        </div>

        <div class="loan-financials">
          <span>Parcelas: <strong>${loan.paidInstallments} / ${loan.totalInstallments}</strong></span>
          <span>Valor: <strong>R$ ${formatCurrency(loan.installmentValue)}/mês</strong></span>
        </div>

        <div class="loan-progress-mini">
          <div class="loan-progress-mini-bar" style="width: ${progressPercent}%"></div>
        </div>

        ${(isLate || isDefault) ? `
          <div class="loan-actions-row">
            <button class="btn-action-small" onclick="openCollectionChat('${loan.id}')">💬 Negociar</button>
            <button class="btn-action-small" onclick="actionNegativarSPC('${loan.id}')">📝 Negativar</button>
            ${loan.collateral.recoveryRate > 0 ? `
              <button class="btn-action-small btn-action-danger" onclick="startJudicialAuction('${loan.id}')">⚖️ Leilão</button>
            ` : ''}
            <button class="btn-action-small" onclick="actionSellBadDebt('${loan.id}')">💼 FIDC</button>
          </div>
        ` : ''}
      </div>
    `;
  }).join("");
}

function actionNegativarSPC(loanId) {
  const loan = gameState.activeLoans.find(l => l.id === loanId);
  if (!loan) return;

  const COST = 50;
  if (gameState.cash < COST) {
    showToast("Sem saldo para taxa do SPC/Serasa!", "toast-danger");
    return;
  }

  gameState.cash -= COST;
  sounds.playStamp();

  if (Math.random() < 0.60) {
    loan.status = "active";
    loan.daysDelinquent = 0;
    loan.paidInstallments++;
    gameState.cash += loan.installmentValue;
    showToast(`📝 CPF Negativado! ${loan.borrowerName} pagou a dívida para limpar o nome.`, "toast-success");
  } else {
    showToast(`📝 CPF Negativado no SPC. O devedor ainda não quitou.`, "toast-warning");
  }

  renderLoansList();
  renderBalances();
}

function actionSellBadDebt(loanId) {
  const loan = gameState.activeLoans.find(l => l.id === loanId);
  if (!loan) return;

  const remainingVal = (loan.totalInstallments - loan.paidInstallments) * loan.installmentValue;
  const soldAmount = Math.round(remainingVal * 0.30);

  gameState.cash += soldAmount;
  loan.status = "paid";

  sounds.playCash();
  showToast(`💼 Carteira de crédito vendida para fundo FIDC por R$ ${formatCurrency(soldAmount)}.`, "toast-success");

  renderLoansList();
  renderBalances();
}

function renderTreasury() {
  const balEl = document.getElementById("treasury-balance-display");
  const rateEl = document.getElementById("treasury-yield-rate");
  if (balEl) balEl.textContent = `R$ ${formatCurrency(gameState.treasuryBalance || 0)}`;
  if (rateEl) {
    let rate = (gameState.selic / 12);
    if (gameState.executives.cfoHelena) rate += 0.3;
    rateEl.textContent = `+${rate.toFixed(2)}%/mês`;
  }
}

function renderFunding() {
  const container = document.getElementById("funding-cards-container");
  if (!container) return;

  container.innerHTML = CDB_CONFIG.map(cdb => {
    const count = gameState.activeCDBs[cdb.id] || 0;
    const totalIssued = count * cdb.amount;

    return `
      <div class="funding-card">
        <div class="funding-header">
          <span class="funding-title">${cdb.name}</span>
          <span class="funding-cost">Custo: ${cdb.costRate}% a.m.</span>
        </div>
        <p class="funding-desc">${cdb.desc}</p>
        <div class="funding-actions">
          <span class="font-mono text-cyan" style="font-size: 11px;">Ativo: R$ ${formatCurrency(totalIssued)} (${count})</span>
          <button class="btn-fund-issue" onclick="issueCDB('${cdb.id}')">+ Captar R$ ${formatCurrency(cdb.amount)}</button>
        </div>
      </div>
    `;
  }).join("");
}

function renderExecutives() {
  const container = document.getElementById("executives-container");
  if (!container) return;

  container.innerHTML = EXECUTIVES_CONFIG.map(exec => {
    const isHired = gameState.executives[exec.id];

    return `
      <div class="exec-card ${isHired ? 'hired' : ''}">
        <div class="exec-top-row">
          <span class="exec-avatar">${exec.avatar}</span>
          <div>
            <div class="exec-name">${exec.name}</div>
            <div class="exec-role">${exec.role}</div>
          </div>
        </div>
        <p class="exec-perk">${exec.perk}</p>
        ${isHired ? `
          <span class="badge-purchased" style="text-align: center;">✓ Contratado</span>
        ` : `
          <button class="btn-hire-exec" onclick="hireExecutive('${exec.id}')">Contratar (R$ ${formatCurrency(exec.cost)})</button>
        `}
      </div>
    `;
  }).join("");
}

function renderUpgrades() {
  const container = document.getElementById("upgrades-list-container");
  if (!container) return;

  container.innerHTML = UPGRADES_CONFIG.map(up => {
    const isBought = gameState.upgrades[up.id];

    return `
      <div class="upgrade-card ${isBought ? 'purchased' : ''}">
        <div class="upgrade-icon-wrap">${up.icon}</div>
        <div class="upgrade-details">
          <h4 class="upgrade-title">${up.title}</h4>
          <p class="upgrade-desc">${up.desc}</p>
        </div>
        <div>
          ${isBought ? `
            <span class="badge-purchased">✓ Ativo</span>
          ` : `
            <button class="btn-buy-upgrade" onclick="buyUpgrade('${up.id}')">R$ ${formatCurrency(up.cost)}</button>
          `}
        </div>
      </div>
    `;
  }).join("");
}

function renderAchievements() {
  const container = document.getElementById("achievements-container");
  if (!container) return;

  const ACHIEVEMENTS_LIST = [
    { id: "firstLoan", title: "Primeiro Crédito", icon: "🤝", desc: "Aprovou o primeiro empréstimo" },
    { id: "auditMaster", title: "Detetive Financeiro", icon: "🔍", desc: "Consultou dossiê sigiloso" },
    { id: "netWorth100k", title: "Cem Mil", icon: "💵", desc: "R$ 100k de patrimônio" },
    { id: "seizureChamp", title: "Martelo de Ouro", icon: "⚖️", desc: "Arrematou bem em leilão" },
    { id: "netWorth1M", title: "Primeiro Milhão", icon: "💎", desc: "R$ 1.000.000 de patrimônio!" },
    { id: "netWorth10M", title: "Barão do Crédito", icon: "🏰", desc: "R$ 10.000.000 de ativos" },
    { id: "netWorth100M", title: "Magnata Financeiro", icon: "🚀", desc: "R$ 100.000.000 em carteira" },
    { id: "netWorth1B", title: "Zero ao Bilhão", icon: "👑", desc: "R$ 1 BILHÃO DE REAIS!" }
  ];

  container.innerHTML = ACHIEVEMENTS_LIST.map(ach => {
    const isUnlocked = gameState.achievements[ach.id];
    return `
      <div class="achievement-card ${isUnlocked ? 'unlocked' : ''}">
        <span class="ach-icon">${ach.icon}</span>
        <div class="ach-info">
          <h4>${ach.title}</h4>
          <p>${ach.desc}</p>
        </div>
      </div>
    `;
  }).join("");
}

function renderAll() {
  renderBalances();
  renderTreasury();
  renderLoansList();
  renderFunding();
  renderExecutives();
  renderUpgrades();
  renderAchievements();
  updateInboxBadge();
}

// =============================================================================
// Troca de Temas
// =============================================================================
function setTheme(themeName, showToastMsg = true) {
  gameState.bankTheme = themeName;
  document.documentElement.className = themeName;

  document.querySelectorAll(".theme-pill").forEach(pill => {
    pill.classList.toggle("active", pill.getAttribute("data-theme") === themeName);
  });

  const ambientGlow = document.getElementById("ambient-glow");
  if (ambientGlow) {
    ambientGlow.style.background = `radial-gradient(circle at 50% 30%, var(--accent-glow), rgba(0, 210, 255, 0.04), transparent 70%)`;
  }

  drawSparkline();
  if (showToastMsg) {
    showToast("🎨 Tema visual atualizado!", "toast-success");
  }
}

// =============================================================================
// Utilitários de Interface (Modais, Relógio, Notícias, Toasts)
// =============================================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("hidden");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("hidden");
}

function setNewsTicker(text) {
  const ticker = document.getElementById("news-text");
  if (ticker) ticker.textContent = text;
}

function showToast(message, type = "toast-success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function updateClock() {
  const clock = document.getElementById("clock-display");
  if (!clock) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  clock.textContent = `${h}:${m}`;
}

function setGameSpeed(speed) {
  gameSpeed = speed;

  const btnPause = document.getElementById("btn-speed-pause");
  const btn1x = document.getElementById("btn-speed-1x");
  const btn3x = document.getElementById("btn-speed-3x");

  if (btnPause) btnPause.classList.toggle("active", speed === 0);
  if (btn1x) btn1x.classList.toggle("active", speed === 1);
  if (btn3x) btn3x.classList.toggle("active", speed === 3);

  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }

  if (speed === 1) {
    gameInterval = setInterval(passOneDay, 3000);
  } else if (speed === 3) {
    gameInterval = setInterval(passOneDay, 1000);
  }
}

// =============================================================================
// Configuração de Event Listeners
// =============================================================================
function setupUIEventListeners() {
  // Troca de Abas
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navItems.forEach(n => n.classList.remove("active"));
      item.classList.add("active");

      const tabId = item.getAttribute("data-tab");
      document.querySelectorAll(".tab-view").forEach(tab => {
        tab.classList.remove("active");
      });
      const activeTab = document.getElementById(tabId);
      if (activeTab) activeTab.classList.add("active");
    });
  });

  // Botões de Ação do Deck
  const btnQuickReject = document.getElementById("btn-quick-reject");
  if (btnQuickReject) btnQuickReject.addEventListener("click", rejectCurrentClient);

  const btnQuickApprove = document.getElementById("btn-quick-approve");
  if (btnQuickApprove) btnQuickApprove.addEventListener("click", approveCurrentClient);

  const btnQuickDossier = document.getElementById("btn-quick-dossier");
  if (btnQuickDossier) btnQuickDossier.addEventListener("click", openDossierModal);

  const btnQuickCounter = document.getElementById("btn-quick-counter");
  if (btnQuickCounter) btnQuickCounter.addEventListener("click", makeCounterOffer);

  // Avançar Dia Manual
  const btnNextDay = document.getElementById("btn-next-day");
  if (btnNextDay) btnNextDay.addEventListener("click", passOneDay);

  // Velocidade
  const btnPause = document.getElementById("btn-speed-pause");
  if (btnPause) btnPause.addEventListener("click", () => setGameSpeed(0));

  const btn1x = document.getElementById("btn-speed-1x");
  if (btn1x) btn1x.addEventListener("click", () => setGameSpeed(1));

  const btn3x = document.getElementById("btn-speed-3x");
  if (btn3x) btn3x.addEventListener("click", () => setGameSpeed(3));

  // Áudio & Música
  const btnMusic = document.getElementById("btn-music-toggle");
  if (btnMusic) btnMusic.addEventListener("click", () => sounds.toggleMusic());

  const btnSound = document.getElementById("btn-sound-toggle");
  const soundOn = document.getElementById("sound-icon-on");
  const soundOff = document.getElementById("sound-icon-off");

  if (btnSound) {
    btnSound.addEventListener("click", () => {
      sounds.soundEnabled = !sounds.soundEnabled;
      if (soundOn) soundOn.classList.toggle("hidden", !sounds.soundEnabled);
      if (soundOff) soundOff.classList.toggle("hidden", sounds.soundEnabled);
      showToast(sounds.soundEnabled ? "🔊 Sons ativados" : "🔇 Sons desativados", "toast-warning");
    });
  }

  // Renomear Banco
  const bankNameEl = document.getElementById("bank-name-display");
  if (bankNameEl) {
    bankNameEl.addEventListener("click", () => {
      const newName = prompt("Digite o novo nome para sua instituição financeira:", gameState.bankName);
      if (newName && newName.trim()) {
        gameState.bankName = newName.trim();
        bankNameEl.textContent = gameState.bankName;
        showToast(`Instituição renomeada para ${gameState.bankName}!`, "toast-success");
      }
    });
  }

  // Seletor de Temas
  document.querySelectorAll(".theme-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const theme = pill.getAttribute("data-theme");
      setTheme(theme, true);
    });
  });

  // Tesouro Selic
  const btnTreasuryDep = document.getElementById("btn-treasury-deposit");
  if (btnTreasuryDep) btnTreasuryDep.addEventListener("click", () => depositTreasury(10000));

  const btnTreasuryWith = document.getElementById("btn-treasury-withdraw");
  if (btnTreasuryWith) btnTreasuryWith.addEventListener("click", withdrawTreasury);

  // Redesconto Emergencial Bacen
  const btnEmergency = document.getElementById("btn-emergency-loan");
  if (btnEmergency) btnEmergency.addEventListener("click", requestEmergencyLoan);

  // Salvar & Resetar
  const btnSave = document.getElementById("btn-save-game");
  if (btnSave) btnSave.addEventListener("click", () => saveGame(true));

  const btnReset = document.getElementById("btn-reset-game");
  if (btnReset) btnReset.addEventListener("click", resetGame);

  // Filtros de Carteira
  document.querySelectorAll(".filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const filter = pill.getAttribute("data-filter");
      filterLoans(filter);
    });
  });
}

function filterLoans(filter) {
  const cards = document.querySelectorAll(".loan-item-card");
  cards.forEach(card => {
    if (filter === "all") {
      card.style.display = "flex";
    } else if (filter === "late") {
      card.style.display = card.classList.contains("status-late") ? "flex" : "none";
    } else if (filter === "default") {
      card.style.display = card.classList.contains("status-default") ? "flex" : "none";
    }
  });
}

// Iniciar quando o DOM estiver pronto
window.addEventListener("DOMContentLoaded", initGame);
