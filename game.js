/**
 * ZERO AO BILHÃO: O BANQUEIRO
 * Simulador Mobile Completo de Banco, Empréstimos e Crédito
 */

// =============================================================================
// Web Audio API Synthesizer (Efeitos sonoros nativos sem dependências externas)
// =============================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playCash() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Ding 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.12); // E6
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Chime secundário
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1567.98, now + 0.08); // G6
      gain2.gain.setValueAtTime(0.2, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.45);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  playStamp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  playReject() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(160, now + 0.1);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  playAlert() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      });
    } catch (e) {}
  }
}

const sounds = new SoundFX();

// =============================================================================
// Estado do Jogo (Game State)
// =============================================================================
const INITIAL_STATE = {
  bankName: "Nexus Bank",
  cash: 50000,
  day: 1,
  month: 1,
  selic: 11.25,
  reputation: 85,
  peakNetWorth: 50000,

  stats: {
    totalLoaned: 0,
    totalInterestEarned: 0,
    totalDefaultLost: 0,
    totalDeals: 0,
    seizuresCount: 0
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
let gameSpeed = 0; // 0 = pause, 1 = 1x, 2 = 2x

// Títulos e Tiers
const BANK_TIERS = [
  { min: 0, name: "Agiota de Bairro", badgeColor: "score-low" },
  { min: 150000, name: "Correspondente Bancário", badgeColor: "score-mid" },
  { min: 750000, name: "Financeira Regional", badgeColor: "score-mid" },
  { min: 3500000, name: "Banco de Investimentos", badgeColor: "score-high" },
  { min: 30000000, name: "Fintech Unicórnio", badgeColor: "score-high" },
  { min: 250000000, name: "Conglomerado Global", badgeColor: "score-high" }
];

// Dados dos Upgrades
const UPGRADES_CONFIG = [
  {
    id: "aiScore",
    title: "IA de Auditoria de Score",
    cost: 25000,
    icon: "🧠",
    desc: "Audita automaticamente a veracidade de score e renda de todos os clientes sem custo!"
  },
  {
    id: "trafficAds",
    title: "Campanhas de Tráfego Pago",
    cost: 35000,
    icon: "📱",
    desc: "Gera +3 solicitações de empréstimo adicionais todos os dias na mesa."
  },
  {
    id: "proCollectors",
    title: "Equipe Especializada de Cobrança",
    cost: 65000,
    icon: "📞",
    desc: "Aumenta o sucesso de cobranças amigáveis de 25% para 70%!"
  },
  {
    id: "officePaulista",
    title: "Sede na Av. Paulista",
    cost: 150000,
    icon: "🏢",
    desc: "Aumenta reputação base para 92% e destrava clientes empresariais maiores."
  },
  {
    id: "facialAntifraud",
    title: "Antifraude por Biometria Facial",
    cost: 200000,
    icon: "🛡️",
    desc: "Elimina instantaneamente 100% de golpistas que tentam fraudar seu banco."
  },
  {
    id: "eliteLawyers",
    title: "Banca Jurídica de Elite",
    cost: 450000,
    icon: "⚖️",
    desc: "Penhoras judiciais de bens garantidos têm 100% de sucesso imediato!"
  },
  {
    id: "officeFariaLima",
    title: "Torre Corporativa Faria Lima",
    cost: 2000000,
    icon: "🏛️",
    desc: "Atrai clientes VIP de grande porte (empréstimos de até R$ 2.000.000)."
  },
  {
    id: "soccerSponsor",
    title: "Patrocínio Master no Futebol",
    cost: 5000000,
    icon: "⚽",
    desc: "Aumenta o limite de captação de CDBs de investidores em 400%."
  },
  {
    id: "officeDigital",
    title: "Sede Global & Nuvem Unicórnio",
    cost: 25000000,
    icon: "🌐",
    desc: "O topo do sistema financeiro. Atrai contratos bilionários e fundos soberanos."
  }
];

// Modelos de CDBs para Captação
const CDB_CONFIG = [
  {
    id: "cdbDiario",
    name: "CDB Liquidez Diária",
    amount: 30000,
    costRate: 0.8, // 0.8% ao mês de juros pagos
    desc: "Captação rápida de pequenos poupadores."
  },
  {
    id: "cdbAnjo",
    name: "CDB Investidor Anjo",
    amount: 150000,
    costRate: 1.0,
    desc: "Investidores qualificados buscando rendimento do CDI."
  },
  {
    id: "cdbPrivate",
    name: "CDB Private Banking",
    amount: 800000,
    costRate: 1.2,
    desc: "Grandes fortunas aportando liquidez no seu banco."
  },
  {
    id: "cdbDebenture",
    name: "Debêntures Institucionais",
    amount: 5000000,
    costRate: 1.4,
    desc: "Emissão de títulos de dívida para fundos de pensão."
  }
];

// Gerador de Clientes
const FIRST_NAMES = ["Carlos", "Mariana", "Lucas", "Beatriz", "Ricardo", "Juliana", "Rodrigo", "Camila", "Felipe", "Vanessa", "Mateus", "Aline", "Gabriel", "Patricia", "Rafael", "Tatiane", "Thiago", "Fernanda", "Gustavo", "Renata"];
const LAST_NAMES = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa"];

const CLIENT_PROFILES = [
  { profession: "Dono de Padaria", purpose: "Comprar novo forno industrial", baseIncome: 9500, risk: "low", icon: "🥖" },
  { profession: "Desenvolvedor Sênior", purpose: "Investir em startup própria", baseIncome: 18000, risk: "low", icon: "💻" },
  { profession: "Médica Cirurgiã", purpose: "Expansão da clínica médica", baseIncome: 35000, risk: "low", icon: "🩺" },
  { profession: "Arquiteto", purpose: "Capital de giro para escritório", baseIncome: 14000, risk: "mid", icon: "📐" },
  { profession: "Motorista de App", purpose: "Comprar carro próprio quitado", baseIncome: 4500, risk: "mid", icon: "🚗" },
  { profession: "Dona de Loja de Roupas", purpose: "Estoque para coleção de fim de ano", baseIncome: 8000, risk: "mid", icon: "👗" },
  { profession: "Trader Autônomo", purpose: "Alavancagem em minicontratos", baseIncome: 12000, risk: "high", icon: "📈" },
  { profession: "Influenciador Digital", purpose: "Lançar linha de maquiagem", baseIncome: 22000, risk: "mid", icon: "📸" },
  { profession: "Apostador Esportivo", purpose: "Recuperar banca em apostas", baseIncome: 5000, risk: "extreme", icon: "🎲" },
  { profession: "Empresário do Agro", purpose: "Aquisição de fertilizantes importados", baseIncome: 65000, risk: "low", icon: "🌾" },
  { profession: "Advogado Tributarista", purpose: "Reforma de escritório corporativo", baseIncome: 28000, risk: "low", icon: "⚖️" }
];

const COLLATERAL_TYPES = [
  { name: "Sem Garantia", recoveryRate: 0, chance: 0.45 },
  { name: "Moto / Veículo Usado", recoveryRate: 0.7, chance: 0.30 },
  { name: "Imóvel Residencial", recoveryRate: 1.1, chance: 0.15 },
  { name: "Carteira de Ações", recoveryRate: 0.85, chance: 0.10 }
];

// =============================================================================
// Funções de Inicialização e Persistência
// =============================================================================
function initGame() {
  loadGame();
  setupUIEventListeners();
  renderAll();

  // Se a fila estiver vazia, gera clientes iniciais
  if (gameState.clientQueue.length === 0) {
    for (let i = 0; i < 4; i++) {
      generateClient();
    }
  }

  updateClientCard();
  updateClock();
  setInterval(updateClock, 1000);

  // Auto-save periódico a cada 15s
  setInterval(() => {
    saveGame(false);
  }, 15000);
}

function saveGame(showToastMsg = true) {
  try {
    localStorage.setItem("zero_ao_bilhao_save", JSON.stringify(gameState));
    if (showToastMsg) {
      showToast("💾 Jogo salvo com sucesso!", "toast-success");
    }
  } catch (e) {
    console.error("Erro ao salvar jogo:", e);
  }
}

function loadGame() {
  try {
    const saved = localStorage.getItem("zero_ao_bilhao_save");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Mescla com estado inicial para manter compatibilidade com novidades
      gameState = Object.assign({}, INITIAL_STATE, parsed);
      // Garantir arrays e objetos
      gameState.stats = Object.assign({}, INITIAL_STATE.stats, parsed.stats || {});
      gameState.upgrades = Object.assign({}, INITIAL_STATE.upgrades, parsed.upgrades || {});
      gameState.activeCDBs = Object.assign({}, INITIAL_STATE.activeCDBs, parsed.activeCDBs || {});
      gameState.achievements = Object.assign({}, INITIAL_STATE.achievements, parsed.achievements || {});
      if (!Array.isArray(gameState.activeLoans)) gameState.activeLoans = [];
      if (!Array.isArray(gameState.clientQueue)) gameState.clientQueue = [];
    }
  } catch (e) {
    console.error("Erro ao carregar save:", e);
  }
}

function resetGame() {
  if (confirm("Tem certeza que deseja reiniciar todo o seu progresso? Seu banco voltará com R$ 50.000.")) {
    localStorage.removeItem("zero_ao_bilhao_save");
    gameState = JSON.parse(JSON.stringify(INITIAL_STATE));
    for (let i = 0; i < 4; i++) {
      generateClient();
    }
    renderAll();
    updateClientCard();
    showToast("Novo banco fundado! Rumo ao Bilhão!", "toast-warning");
  }
}

// =============================================================================
// Cálculos Financeiros & Lógica de Negócios
// =============================================================================
function formatCurrency(val) {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
}

function calculateReceivables() {
  return gameState.activeLoans.reduce((acc, loan) => {
    const remainingInstallments = loan.totalInstallments - loan.paidInstallments;
    return acc + (remainingInstallments * loan.installmentValue);
  }, 0);
}

function calculateDebts() {
  let totalDebts = 0;
  for (const key in gameState.activeCDBs) {
    const cdb = CDB_CONFIG.find(c => c.id === key);
    if (cdb) {
      totalDebts += gameState.activeCDBs[key] * cdb.amount;
    }
  }
  return totalDebts;
}

function calculateNetWorth() {
  return gameState.cash + calculateReceivables() - calculateDebts();
}

function getBankTier() {
  const net = calculateNetWorth();
  let currentTier = BANK_TIERS[0];
  for (const tier of BANK_TIERS) {
    if (net >= tier.min) {
      currentTier = tier;
    }
  }
  return currentTier;
}

// =============================================================================
// Gerador de Clientes (Propostas de Empréstimo)
// =============================================================================
function generateClient() {
  const profile = CLIENT_PROFILES[Math.floor(Math.random() * CLIENT_PROFILES.length)];
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

  // Limite de valor baseado no patrimônio do banco
  const net = Math.max(calculateNetWorth(), 50000);
  let maxAmount = 25000;
  if (gameState.upgrades.officePaulista) maxAmount = 80000;
  if (gameState.upgrades.officeFariaLima) maxAmount = 500000;
  if (gameState.upgrades.officeDigital) maxAmount = 5000000;

  // Ajusta proporcionalmente
  const baseRange = Math.min(net * 0.4, maxAmount);
  const minAmount = Math.max(3000, Math.floor(baseRange * 0.15));
  const requestedAmount = Math.floor((Math.random() * (baseRange - minAmount) + minAmount) / 500) * 500;

  // Parcelas (3 a 10 meses)
  const totalInstallments = [3, 4, 6, 8, 10][Math.floor(Math.random() * 5)];

  // Score real vs declarado
  let trueScore = Math.floor(Math.random() * 700 + 250);
  if (profile.risk === "extreme") trueScore = Math.floor(Math.random() * 350 + 100);
  if (profile.risk === "low") trueScore = Math.floor(Math.random() * 350 + 600);

  // Fraude / Golpe
  const isFraud = Math.random() < (gameState.upgrades.facialAntifraud ? 0 : 0.08);
  const declaredScore = isFraud ? Math.min(950, trueScore + 300) : (Math.random() < 0.25 ? Math.min(900, trueScore + 150) : trueScore);

  // Garantia
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

  const client = {
    id: "cli_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    name: `${firstName} ${lastName}`,
    profession: profile.profession,
    purpose: profile.purpose,
    icon: profile.icon,
    declaredIncome: profile.baseIncome * (1 + (Math.random() * 0.4 - 0.2)),
    trueIncome: profile.baseIncome,
    declaredScore: declaredScore,
    trueScore: trueScore,
    isFraud: isFraud,
    audited: gameState.upgrades.aiScore, // Auto-auditado se tiver IA de Score
    requestedAmount: requestedAmount,
    totalInstallments: totalInstallments,
    collateral: chosenCollateral,
    selectedRate: 5.5 // Taxa inicial sugerida (5.5% a.m.)
  };

  gameState.clientQueue.push(client);
  updateInboxBadge();
}

// =============================================================================
// Ações da Mesa de Empréstimo (Aprovar / Recusar / Auditar)
// =============================================================================
function getCurrentClient() {
  return gameState.clientQueue[0] || null;
}

function auditCurrentClient() {
  const client = getCurrentClient();
  if (!client) return;

  if (client.audited) {
    showToast("Este cliente já foi auditado!", "toast-warning");
    return;
  }

  const AUDIT_COST = 200;
  if (gameState.cash < AUDIT_COST) {
    showToast("Caixa insuficiente para auditar (R$ 200)!", "toast-danger");
    return;
  }

  gameState.cash -= AUDIT_COST;
  client.audited = true;
  gameState.achievements.auditMaster = true;
  sounds.playStamp();

  if (client.isFraud) {
    showToast("🚨 ALERTA: A auditoria revelou que este cliente é um GOLPISTA!", "toast-danger");
  } else if (client.trueScore < client.declaredScore - 100) {
    showToast(`⚠️ Score real é ${client.trueScore} (declarou ${client.declaredScore})!`, "toast-warning");
  } else {
    showToast("✅ Auditoria confirmou renda e score legítimos!", "toast-success");
  }

  updateClientCard();
  renderBalances();
}

function approveCurrentClient() {
  const client = getCurrentClient();
  if (!client) return;

  if (gameState.cash < client.requestedAmount) {
    sounds.playReject();
    showToast("Caixa insuficiente para liberar este empréstimo!", "toast-danger");
    return;
  }

  // Dedução de caixa
  gameState.cash -= client.requestedAmount;

  // Cálculo da parcela com juros compostos simples
  const rate = client.selectedRate / 100;
  const n = client.totalInstallments;
  // Prestação aproximada: P = PV * [i * (1+i)^n] / [(1+i)^n - 1]
  const factor = Math.pow(1 + rate, n);
  const installmentValue = Math.round((client.requestedAmount * (rate * factor) / (factor - 1)) * 100) / 100;

  // Criação do contrato
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
    status: "active" // active, late, defaulted, paid
  };

  gameState.activeLoans.push(contract);
  gameState.stats.totalLoaned += client.requestedAmount;
  gameState.stats.totalDeals++;
  gameState.achievements.firstLoan = true;

  sounds.playCash();
  showToast(`🎉 Empréstimo de R$ ${formatCurrency(client.requestedAmount)} aprovado!`, "toast-success");

  // Remove cliente da fila
  gameState.clientQueue.shift();
  updateClientCard();
  renderBalances();
  renderLoansList();
  updateInboxBadge();
}

function rejectCurrentClient() {
  const client = getCurrentClient();
  if (!client) return;

  sounds.playReject();
  showToast(`Proposta de ${client.name} recusada.`, "toast-warning");
  gameState.clientQueue.shift();
  updateClientCard();
  updateInboxBadge();
}

// =============================================================================
// Avanço de Tempo (Turno de 1 Dia / Ciclo Financeiro)
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

  // Processa cobranças dos empréstimos ativos
  for (let i = gameState.activeLoans.length - 1; i >= 0; i--) {
    const loan = gameState.activeLoans[i];

    if (loan.status === "paid" || loan.status === "defaulted") continue;

    // Chance de pagar a parcela hoje (distribuído ao longo dos dias do mês)
    const paymentDueToday = Math.random() < 0.25;

    if (paymentDueToday) {
      // Cálculo de probabilidade de calote/atraso
      // Influenciado por: score, taxa de juros alta (>8%), e se for golpe
      let defaultChance = 0.05;
      if (loan.trueScore < 400) defaultChance += 0.35;
      else if (loan.trueScore < 600) defaultChance += 0.15;

      if (loan.interestRate > 9) {
        defaultChance += (loan.interestRate - 9) * 0.03;
      }

      if (loan.isFraud) {
        defaultChance = 0.95; // Golpistas quase nunca pagam
      }

      // Verificação
      if (Math.random() < defaultChance) {
        // Atrasou!
        loan.daysDelinquent += 7;
        if (loan.daysDelinquent >= 21) {
          loan.status = "defaulted";
          newDefaults++;
          gameState.stats.totalDefaultLost += (loan.totalInstallments - loan.paidInstallments) * loan.installmentValue;
        } else {
          loan.status = "late";
        }
      } else {
        // Pagou em dia!
        loan.paidInstallments++;
        loan.daysDelinquent = 0;
        loan.status = "active";
        dailyCashChange += loan.installmentValue;
        paymentsReceived++;

        // Lucro de juros embutido
        const principalPart = loan.originalAmount / loan.totalInstallments;
        const interestPart = Math.max(0, loan.installmentValue - principalPart);
        gameState.stats.totalInterestEarned += interestPart;

        if (loan.paidInstallments >= loan.totalInstallments) {
          loan.status = "paid";
        }
      }
    }
  }

  // Custo diário dos CDBs emitidos (juros pagos aos investidores)
  let dailyCdbCost = 0;
  for (const key in gameState.activeCDBs) {
    const count = gameState.activeCDBs[key];
    const cdb = CDB_CONFIG.find(c => c.id === key);
    if (cdb && count > 0) {
      const monthlyCost = (cdb.amount * count) * (cdb.costRate / 100);
      dailyCdbCost += (monthlyCost / 30);
    }
  }

  dailyCashChange -= dailyCdbCost;
  gameState.cash += dailyCashChange;

  // Geração de novos clientes diários
  let newClientsToSpawn = 1;
  if (gameState.upgrades.trafficAds) newClientsToSpawn += 3;
  if (gameState.upgrades.officePaulista) newClientsToSpawn += 1;
  if (gameState.upgrades.officeFariaLima) newClientsToSpawn += 2;

  if (gameState.clientQueue.length < 8) {
    for (let c = 0; c < newClientsToSpawn; c++) {
      generateClient();
    }
  }

  // Notícias e Eventos Aleatórios
  checkRandomEvents();

  // Verificação de Quebra / Socorro do Bacen
  if (gameState.cash < 0) {
    handleInsolvency();
  }

  // Checagem de Conquistas
  checkAchievements();

  // Feedback Sonoro
  if (paymentsReceived > 0) {
    sounds.playCash();
  }
  if (newDefaults > 0) {
    sounds.playAlert();
    showToast(`⚠️ ${newDefaults} cliente(s) entraram em calote na carteira!`, "toast-danger");
  }

  renderAll();
}

function processMonthlyEvents() {
  // Flutuação da taxa Selic
  const deltaSelic = (Math.random() * 0.5 - 0.25);
  gameState.selic = Math.max(8.0, Math.min(16.5, Math.round((gameState.selic + deltaSelic) * 100) / 100));

  showToast(`📅 Novo mês iniciado! Selic ajustada para ${gameState.selic}%`, "toast-warning");
}

function checkRandomEvents() {
  // Chance de 8% de evento especial a cada dia
  if (Math.random() > 0.08) return;

  const events = [
    {
      text: "📈 Copom aumenta taxa Selic! Investidores procuram mais seus CDBs.",
      action: () => {
        gameState.selic += 0.5;
        gameState.reputation = Math.min(100, gameState.reputation + 2);
      }
    },
    {
      text: "💥 Queda no desemprego! Inadimplência geral reduz em 15% este mês.",
      action: () => {
        gameState.activeLoans.forEach(l => {
          if (l.status === "late") l.status = "active";
        });
      }
    },
    {
      text: "🏛️ Fiscalização de Rotina do Banco Central. Todas as contas auditadas e regulares!",
      action: () => {
        gameState.reputation = Math.min(100, gameState.reputation + 4);
      }
    },
    {
      text: "🚀 Notícia na Forbes Brasil destaca seu banco como a fintech que mais cresce!",
      action: () => {
        gameState.reputation = Math.min(100, gameState.reputation + 6);
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

  // Adiciona como dívida emergencial
  gameState.activeCDBs.cdbDiario = (gameState.activeCDBs.cdbDiario || 0) + Math.ceil(bailoutAmount / 30000);

  sounds.playAlert();
  showToast("🚨 RESGATE DO BANCO CENTRAL! Seu caixa estava negativo. Liquidez de socorro injetada.", "toast-danger");
}

// =============================================================================
// Gestão de Cobrança e Renegociação (Ações na Carteira)
// =============================================================================
function actionCallDebtor(loanId) {
  const loan = gameState.activeLoans.find(l => l.id === loanId);
  if (!loan) return;

  const successRate = gameState.upgrades.proCollectors ? 0.70 : 0.28;
  if (Math.random() < successRate) {
    loan.status = "active";
    loan.daysDelinquent = 0;
    loan.paidInstallments++;
    gameState.cash += loan.installmentValue;
    sounds.playCash();
    showToast(`📞 Acordo com ${loan.borrowerName}! Parcela de R$ ${formatCurrency(loan.installmentValue)} recebida.`, "toast-success");
  } else {
    sounds.playReject();
    showToast(`📞 ${loan.borrowerName} não atendeu ou se recusou a pagar.`, "toast-warning");
  }

  renderLoansList();
  renderBalances();
}

function actionNegativarSPC(loanId) {
  const loan = gameState.activeLoans.find(l => l.id === loanId);
  if (!loan) return;

  const COST = 50;
  if (gameState.cash < COST) {
    showToast("Sem saldo para taxa de negativação!", "toast-danger");
    return;
  }

  gameState.cash -= COST;
  sounds.playStamp();

  if (Math.random() < 0.60) {
    loan.status = "active";
    loan.daysDelinquent = 0;
    loan.paidInstallments++;
    gameState.cash += loan.installmentValue;
    showToast(`📝 Nome negativado! ${loan.borrowerName} pagou para limpar o CPF!`, "toast-success");
  } else {
    showToast(`📝 Nome negativado no SPC. O devedor continua sem pagar.`, "toast-warning");
  }

  renderLoansList();
  renderBalances();
}

function actionSeizeCollateral(loanId) {
  const loan = gameState.activeLoans.find(l => l.id === loanId);
  if (!loan) return;

  if (loan.collateral.recoveryRate <= 0) {
    showToast("Este contrato não possui garantias penhoráveis!", "toast-danger");
    return;
  }

  const successRate = gameState.upgrades.eliteLawyers ? 1.0 : 0.75;
  if (Math.random() < successRate) {
    const remainingVal = (loan.totalInstallments - loan.paidInstallments) * loan.installmentValue;
    const recovered = Math.round(remainingVal * loan.collateral.recoveryRate);

    gameState.cash += recovered;
    loan.status = "paid";
    gameState.stats.seizuresCount++;
    gameState.achievements.seizureChamp = true;

    sounds.playFanfare();
    showToast(`⚖️ Garantia (${loan.collateral.name}) leiloada! Recuperados R$ ${formatCurrency(recovered)}!`, "toast-success");
  } else {
    sounds.playReject();
    showToast("⚖️ O devedor entrou com liminar judicial contra a penhora. Tente novamente depois.", "toast-warning");
  }

  renderLoansList();
  renderBalances();
}

function actionSellBadDebt(loanId) {
  const loan = gameState.activeLoans.find(l => l.id === loanId);
  if (!loan) return;

  const remainingVal = (loan.totalInstallments - loan.paidInstallments) * loan.installmentValue;
  const soldAmount = Math.round(remainingVal * 0.30); // 30% do valor de face

  gameState.cash += soldAmount;
  loan.status = "paid";

  sounds.playCash();
  showToast(`💼 Dívida podre vendida para FIDC por R$ ${formatCurrency(soldAmount)}.`, "toast-success");

  renderLoansList();
  renderBalances();
}

// =============================================================================
// Captação de Recursos (CDBs)
// =============================================================================
function issueCDB(cdbId) {
  const cdb = CDB_CONFIG.find(c => c.id === cdbId);
  if (!cdb) return;

  // Limite por reputação e upgrades
  const currentCount = gameState.activeCDBs[cdbId] || 0;
  const maxLimit = gameState.upgrades.soccerSponsor ? 15 : 5;

  if (currentCount >= maxLimit) {
    showToast(`Limite máximo de emissão deste título atingido (${maxLimit})!`, "toast-warning");
    return;
  }

  gameState.activeCDBs[cdbId] = currentCount + 1;
  gameState.cash += cdb.amount;

  sounds.playCash();
  showToast(`💰 R$ ${formatCurrency(cdb.amount)} captados com sucesso via ${cdb.name}!`, "toast-success");

  renderBalances();
  renderFunding();
}

function requestEmergencyLoan() {
  const amount = 20000;
  gameState.cash += amount;
  gameState.reputation = Math.max(10, gameState.reputation - 15);
  // Registra como dívida com custo alto
  gameState.activeCDBs.cdbDiario = (gameState.activeCDBs.cdbDiario || 0) + 1;

  sounds.playAlert();
  showToast("🚨 R$ 20.000 liberados em linha emergencial do Bacen. Reputação reduzida!", "toast-danger");
  renderBalances();
  renderFunding();
}

// =============================================================================
// Compra de Upgrades
// =============================================================================
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
  showToast(`🎉 Upgrade ${upgrade.title} ativado com sucesso!`, "toast-success");

  // Efeitos imediatos
  if (upgradeId === "officePaulista") {
    gameState.reputation = Math.max(gameState.reputation, 92);
  }

  renderBalances();
  renderUpgrades();
}

// =============================================================================
// Conquistas (Achievements)
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
    unlockAchievement("Primeiro Milhão", "Parabéns! Você alcançou R$ 1.000.000 de patrimônio!");
  }
  if (net >= 10000000 && !gameState.achievements.netWorth10M) {
    gameState.achievements.netWorth10M = true;
    unlockAchievement("Oito Dígitos", "R$ 10.000.000! Você é dono de uma das maiores financeiras.");
  }
  if (net >= 100000000 && !gameState.achievements.netWorth100M) {
    gameState.achievements.netWorth100M = true;
    unlockAchievement("Centicentenário", "R$ 100.000.000! Quase no topo absoluto.");
  }
  if (net >= 1000000000 && !gameState.achievements.netWorth1B) {
    gameState.achievements.netWorth1B = true;
    unlockAchievement("🏆 ZERO AO BILHÃO CONCLUÍDO!", "Você conquistou R$ 1 BILHÃO DE REAIS e dominou o sistema financeiro!");
  }
}

function unlockAchievement(title, desc) {
  sounds.playFanfare();
  showToast(`🏆 CONQUISTA DESBLOQUEADA: ${title}!`, "toast-success");
}

// =============================================================================
// Renderização de Interface (UI)
// =============================================================================
function renderBalances() {
  const net = calculateNetWorth();
  const receivables = calculateReceivables();
  const debts = calculateDebts();
  const tier = getBankTier();

  // Displays
  document.getElementById("cash-display").textContent = formatCurrency(gameState.cash);
  document.getElementById("receivable-display").textContent = `R$ ${formatCurrency(receivables)}`;
  document.getElementById("debts-display").textContent = `R$ ${formatCurrency(debts)}`;
  document.getElementById("networth-display").textContent = `R$ ${formatCurrency(net)}`;
  document.getElementById("reputation-display").textContent = `${gameState.reputation}% ★`;
  document.getElementById("bank-tier-display").textContent = tier.name;
  document.getElementById("current-day-display").textContent = `Dia ${gameState.day} • Mês ${gameState.month}`;
  document.getElementById("selic-rate-display").textContent = `Selic: ${gameState.selic}%`;
  document.getElementById("bank-name-display").textContent = gameState.bankName;

  // Progresso rumo ao Bilhão (Meta: 1.000.000.000)
  const goalTarget = 1000000000;
  const progressPercent = Math.max(0.001, Math.min(100, (net / goalTarget) * 100));
  document.getElementById("goal-percentage").textContent = `${progressPercent.toFixed(3)}%`;
  document.getElementById("goal-progress-fill").style.width = `${progressPercent}%`;

  // Estatísticas
  document.getElementById("stat-total-loaned").textContent = `R$ ${formatCurrency(gameState.stats.totalLoaned)}`;
  document.getElementById("stat-interest-earned").textContent = `R$ ${formatCurrency(gameState.stats.totalInterestEarned)}`;
  document.getElementById("stat-default-lost").textContent = `R$ ${formatCurrency(gameState.stats.totalDefaultLost)}`;
  document.getElementById("stat-total-deals").textContent = gameState.stats.totalDeals;
  document.getElementById("stat-seizures-count").textContent = gameState.stats.seizuresCount;
  document.getElementById("stat-peak-networth").textContent = `R$ ${formatCurrency(gameState.peakNetWorth)}`;
}

function updateClientCard() {
  const container = document.getElementById("current-client-card");
  const client = getCurrentClient();

  if (!client) {
    container.innerHTML = `
      <div class="client-empty-state">
        <div class="empty-icon">⏳</div>
        <h3>Buscando tomadores de empréstimo...</h3>
        <p>Acelere o tempo ou avance o dia para atrair novas solicitações de crédito!</p>
      </div>
    `;
    return;
  }

  // Cor do score
  let scoreClass = "score-low";
  const displayScore = client.audited ? client.trueScore : client.declaredScore;
  if (displayScore >= 700) scoreClass = "score-high";
  else if (displayScore >= 450) scoreClass = "score-mid";

  // Cálculo de simulação de parcela
  const rate = client.selectedRate / 100;
  const n = client.totalInstallments;
  const factor = Math.pow(1 + rate, n);
  const estInstallment = Math.round((client.requestedAmount * (rate * factor) / (factor - 1)) * 100) / 100;
  const totalReturn = estInstallment * n;
  const estimatedProfit = totalReturn - client.requestedAmount;

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
        <span class="data-row-label">Renda Mensal</span>
        <span class="data-row-val">R$ ${formatCurrency(client.audited ? client.trueIncome : client.declaredIncome)}</span>
      </div>
      <div class="data-row-card">
        <span class="data-row-label">Score de Crédito</span>
        <span class="data-row-val text-${displayScore >= 700 ? 'emerald' : displayScore >= 450 ? 'gold' : 'rose'}">${displayScore} / 1000</span>
      </div>
    </div>

    <div class="audit-box">
      <div class="audit-status">
        ${client.audited 
          ? (client.isFraud 
              ? "<strong class='text-rose'>🚨 GOLPISTA IDENTIFICADO!</strong>" 
              : "<strong class='text-emerald'>✅ Risco Auditado com Sucesso</strong>")
          : "<strong>Auditoria de Risco</strong>Descubra fraudes e score oculto"}
      </div>
      ${!client.audited ? `<button class="btn-audit" id="btn-audit-client">Auditar (R$ 200)</button>` : ''}
    </div>

    <div class="interest-slider-box">
      <div class="slider-label-row">
        <span>Sua Taxa de Juros:</span>
        <span class="slider-val-tag" id="interest-rate-val">${client.selectedRate.toFixed(1)}% a.m.</span>
      </div>
      <input type="range" class="styled-range" id="interest-slider" min="2.0" max="18.0" step="0.5" value="${client.selectedRate}">
      <div class="projected-profit-row">
        <span>Parcela estimada: <strong>R$ ${formatCurrency(estInstallment)}</strong></span>
        <span>Lucro previsto: <strong class="text-emerald">+R$ ${formatCurrency(estimatedProfit)}</strong></span>
      </div>
    </div>

    <div class="decision-actions">
      <button class="btn-reject" id="btn-reject-client">✕ Recusar</button>
      <button class="btn-approve" id="btn-approve-client">
        <span>✓ Aprovar Empréstimo</span>
      </button>
    </div>
  `;

  // Listeners dinâmicos do card
  const slider = document.getElementById("interest-slider");
  if (slider) {
    slider.addEventListener("input", (e) => {
      client.selectedRate = parseFloat(e.target.value);
      updateClientCard();
    });
  }

  const btnAudit = document.getElementById("btn-audit-client");
  if (btnAudit) {
    btnAudit.addEventListener("click", auditCurrentClient);
  }

  const btnApprove = document.getElementById("btn-approve-client");
  if (btnApprove) {
    btnApprove.addEventListener("click", approveCurrentClient);
  }

  const btnReject = document.getElementById("btn-reject-client");
  if (btnReject) {
    btnReject.addEventListener("click", rejectCurrentClient);
  }
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
  const lateBadge = document.getElementById("nav-late-badge");

  const activeLoans = gameState.activeLoans.filter(l => l.status !== "paid");
  const lateLoans = activeLoans.filter(l => l.status === "late" || l.status === "defaulted");

  if (contractsCount) contractsCount.textContent = activeLoans.length;

  if (defaultRateDisplay) {
    const rate = activeLoans.length > 0 ? ((lateLoans.length / activeLoans.length) * 100).toFixed(1) : "0.0";
    defaultRateDisplay.textContent = `${rate}%`;
  }

  if (lateBadge) {
    lateBadge.classList.toggle("hidden", lateLoans.length === 0);
  }

  if (activeLoans.length === 0) {
    container.innerHTML = `
      <div class="empty-state-simple">
        <p>Nenhum contrato ativo no momento. Vá até a <strong>Mesa de Crédito</strong> e aprove novas propostas!</p>
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
            <button class="btn-action-small" onclick="actionCallDebtor('${loan.id}')">📞 Cobrar</button>
            <button class="btn-action-small" onclick="actionNegativarSPC('${loan.id}')">📝 Negativar</button>
            ${loan.collateral.recoveryRate > 0 ? `
              <button class="btn-action-small btn-action-danger" onclick="actionSeizeCollateral('${loan.id}')">⚖️ Penhorar</button>
            ` : ''}
            <button class="btn-action-small" onclick="actionSellBadDebt('${loan.id}')">💼 Vender</button>
          </div>
        ` : ''}
      </div>
    `;
  }).join("");
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
          <span class="active-funding-amount">Ativo: R$ ${formatCurrency(totalIssued)} (${count})</span>
          <button class="btn-fund-issue" onclick="issueCDB('${cdb.id}')">+ Captar R$ ${formatCurrency(cdb.amount)}</button>
        </div>
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
    { id: "auditMaster", title: "Detetive Financeiro", icon: "🔍", desc: "Auditor de risco experiente" },
    { id: "netWorth100k", title: "Cem Mil", icon: "💵", desc: "R$ 100k de patrimônio líquido" },
    { id: "seizureChamp", title: "Martelo da Justiça", icon: "⚖️", desc: "Penhorou garantia de devedor" },
    { id: "netWorth1M", title: "Primeiro Milhão", icon: "💎", desc: "Alcançou R$ 1.000.000" },
    { id: "netWorth10M", title: "Barão do Crédito", icon: "🏰", desc: "R$ 10.000.000 de patrimônio" },
    { id: "netWorth100M", title: "Magnata Financeiro", icon: "🚀", desc: "R$ 100.000.000 em ativos" },
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
  renderLoansList();
  renderFunding();
  renderUpgrades();
  renderAchievements();
  updateInboxBadge();
}

// =============================================================================
// Interface Helpers (Notícias, Relógio, Toasts, Abas)
// =============================================================================
function setNewsTicker(text) {
  const ticker = document.getElementById("news-text");
  if (ticker) {
    ticker.textContent = text;
  }
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

// =============================================================================
// Controle de Velocidade do Jogo
// =============================================================================
function setGameSpeed(speed) {
  gameSpeed = speed;

  const btnPause = document.getElementById("btn-speed-pause");
  const btn1x = document.getElementById("btn-speed-1x");
  const btn2x = document.getElementById("btn-speed-2x");

  if (btnPause) btnPause.classList.toggle("active", speed === 0);
  if (btn1x) btn1x.classList.toggle("active", speed === 1);
  if (btn2x) btn2x.classList.toggle("active", speed === 2);

  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }

  if (speed === 1) {
    gameInterval = setInterval(passOneDay, 3000);
  } else if (speed === 2) {
    gameInterval = setInterval(passOneDay, 1400);
  }
}

// =============================================================================
// Event Listeners Globais
// =============================================================================
function setupUIEventListeners() {
  // Troca de Abas da Bottom Bar
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
      if (activeTab) {
        activeTab.classList.add("active");
      }
    });
  });

  // Botão Avançar Dia Manual
  const btnNextDay = document.getElementById("btn-next-day");
  if (btnNextDay) {
    btnNextDay.addEventListener("click", () => {
      passOneDay();
    });
  }

  // Controles de Velocidade
  const btnPause = document.getElementById("btn-speed-pause");
  if (btnPause) btnPause.addEventListener("click", () => setGameSpeed(0));

  const btn1x = document.getElementById("btn-speed-1x");
  if (btn1x) btn1x.addEventListener("click", () => setGameSpeed(1));

  const btn2x = document.getElementById("btn-speed-2x");
  if (btn2x) btn2x.addEventListener("click", () => setGameSpeed(2));

  // Toggle de Som
  const btnSound = document.getElementById("btn-sound-toggle");
  const soundOn = document.getElementById("sound-icon-on");
  const soundOff = document.getElementById("sound-icon-off");

  if (btnSound) {
    btnSound.addEventListener("click", () => {
      sounds.enabled = !sounds.enabled;
      if (soundOn) soundOn.classList.toggle("hidden", !sounds.enabled);
      if (soundOff) soundOff.classList.toggle("hidden", sounds.enabled);
      showToast(sounds.enabled ? "🔊 Som ativado" : "🔇 Som desativado", "toast-warning");
    });
  }

  // Renomear Banco
  const bankNameEl = document.getElementById("bank-name-display");
  if (bankNameEl) {
    bankNameEl.addEventListener("click", () => {
      const newName = prompt("Digite o novo nome para a sua instituição financeira:", gameState.bankName);
      if (newName && newName.trim()) {
        gameState.bankName = newName.trim();
        bankNameEl.textContent = gameState.bankName;
        showToast(`Instituição renomeada para ${gameState.bankName}!`, "toast-success");
      }
    });
  }

  // Linha Emergencial
  const btnEmergency = document.getElementById("btn-emergency-loan");
  if (btnEmergency) {
    btnEmergency.addEventListener("click", requestEmergencyLoan);
  }

  // Salvar & Resetar Jogo
  const btnSave = document.getElementById("btn-save-game");
  if (btnSave) btnSave.addEventListener("click", () => saveGame(true));

  const btnReset = document.getElementById("btn-reset-game");
  if (btnReset) btnReset.addEventListener("click", resetGame);
}

// Iniciar quando o DOM carregar
window.addEventListener("DOMContentLoaded", initGame);
