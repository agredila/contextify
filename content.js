// --- Configuration ---
const WORKER_URL = "https://contextify.nadilasetiabudiarto.workers.dev/";
const MAX_ACTIONS_PER_MONTH = 999999; // Set to very high number for personal unlimited use

// --- Modes & Prompts Configuration ---
const MODES = {
  WRITING: {
    id: 'writing',
    name: 'Writing Mode',
    icon: '📝',
    domains: ['docs.google.com', 'notion.so', 'gmail.com', 'medium.com', 'linkedin.com'],
    actions: [
      { label: 'Rewrite lebih formal', prompt: 'Kamu adalah writing assistant. Rewrite teks berikut menjadi lebih formal dan profesional. Langsung tulis hasilnya tanpa preamble.' },
      { label: 'Rewrite lebih santai', prompt: 'Kamu adalah writing assistant. Rewrite teks berikut menjadi lebih santai dan natural. Langsung tulis hasilnya tanpa preamble.' },
      { label: 'Buat poin-poin', prompt: 'Kamu adalah writing assistant. Ubah teks berikut menjadi poin-poin (bullet points) yang mudah dibaca. Langsung tulis hasilnya tanpa preamble.' },
      { label: 'Persingkat teks ini', prompt: 'Kamu adalah writing assistant. Persingkat teks berikut tanpa menghilangkan makna utamanya. Langsung tulis hasilnya tanpa preamble.' },
      { label: 'Cek grammar & clarity', prompt: 'Kamu adalah writing assistant. Perbaiki tata bahasa (grammar) dan kejelasan (clarity) teks berikut. Berikan versi perbaikannya secara langsung tanpa preamble.' }
    ]
  },
  RESEARCH: {
    id: 'research',
    name: 'Research Mode',
    icon: '🔍',
    domains: ['wikipedia.org'], // Fallback for other sites later
    actions: [
      { label: 'Ringkas dalam 100 kata', prompt: 'Kamu adalah research assistant. Ringkas konten berikut dalam maksimal 100 kata. Langsung tulis ringkasannya tanpa preamble.' },
      { label: 'Ambil angka & data penting', prompt: 'Kamu adalah research assistant. Ekstrak semua angka, statistik, dan data penting dari teks berikut. Sajikan dalam format list. Langsung tulis hasilnya tanpa preamble.' },
      { label: 'Apa argumen utamanya?', prompt: 'Kamu adalah research assistant. Identifikasi dan jelaskan argumen utama dari teks berikut. Langsung tulis hasilnya tanpa preamble.' },
      { label: 'Buat pertanyaan kritis', prompt: 'Kamu adalah research assistant. Buat 3-5 pertanyaan kritis berdasarkan teks berikut untuk memicu pemikiran lebih mendalam. Langsung tulis hasilnya tanpa preamble.' }
    ]
  },
  DESIGN: {
    id: 'design',
    name: 'Design Mode',
    icon: '✨',
    domains: ['figma.com', 'dribbble.com', 'behance.net'],
    actions: [
      { label: 'Analisis hierarki visual', prompt: 'Kamu adalah ahli desain UI/UX. Analisis teks/konteks halaman berikut dan berikan saran tentang hierarki visualnya. Langsung tulis hasilnya tanpa preamble.' },
      { label: 'Cek aksesibilitas warna', prompt: 'Kamu adalah ahli desain UI/UX. Berdasarkan konteks berikut, berikan saran mengenai aksesibilitas dan kontras warna. Langsung tulis hasilnya tanpa preamble.' },
      { label: 'Suggest improvement UX', prompt: 'Kamu adalah ahli desain UI/UX. Berikan saran untuk meningkatkan User Experience (UX) berdasarkan konteks berikut. Langsung tulis hasilnya tanpa preamble.' },
      { label: 'Jelaskan kenapa desain ini works', prompt: 'Kamu adalah ahli desain UI/UX. Jelaskan mengapa pendekatan atau konten desain yang dideskripsikan di sini efektif. Langsung tulis hasilnya tanpa preamble.' }
    ]
  },
  CODING: {
    id: 'coding',
    name: 'Coding Mode',
    icon: '💻',
    domains: ['github.com', 'stackoverflow.com', 'codepen.io'],
    actions: [
      { label: 'Jelaskan kode ini', prompt: 'Kamu adalah senior software engineer. Jelaskan cara kerja kode atau konteks teknis berikut dengan jelas dan ringkas. Langsung tulis hasilnya tanpa preamble.' },
      { label: 'Cari potensi bug', prompt: 'Kamu adalah senior software engineer. Analisis kode atau konteks teknis berikut dan identifikasi potensi bug atau kelemahan. Langsung tulis hasilnya tanpa preamble.' },
      { label: 'Rewrite lebih clean', prompt: 'Kamu adalah senior software engineer. Tulis ulang kode berikut agar lebih bersih (clean code), efisien, dan mudah dibaca. Langsung tulis hasilnya tanpa preamble.' },
      { label: 'Translate ke bahasa lain', prompt: 'Kamu adalah senior software engineer. Terjemahkan kode berikut ke bahasa pemrograman umum lainnya (misal: Python ke JS, atau sebaliknya, tebak dari konteks). Langsung tulis hasilnya tanpa preamble.' }
    ]
  }
};

// --- State ---
let currentMode = null;
let isSidebarOpen = false;

// --- Initialization ---
function init() {
  detectMode();
  injectUI();
  updateUsageDisplay();
}

function detectMode() {
  const hostname = window.location.hostname;
  
  for (const key in MODES) {
    if (MODES[key].domains.some(domain => hostname.includes(domain))) {
      currentMode = MODES[key];
      return;
    }
  }
  
  // Default fallback
  currentMode = MODES.RESEARCH;
}

// --- Context Extraction ---
function getContext() {
  const selection = window.getSelection().toString().trim();
  if (selection) {
    return selection;
  }
  
  const title = document.title;
  const bodyText = document.body.innerText.substring(0, 500);
  return `Title: ${title}\n\nContent:\n${bodyText}`;
}

// --- Storage & Usage Tracking ---
async function getUsage() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['actionsUsed', 'resetDate'], (result) => {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      
      if (result.resetDate !== currentMonth) {
        // Reset if it's a new month
        const newUsage = { actionsUsed: 0, resetDate: currentMonth };
        chrome.storage.local.set(newUsage);
        resolve(newUsage);
      } else {
        resolve({
          actionsUsed: result.actionsUsed || 0,
          resetDate: result.resetDate
        });
      }
    });
  });
}

async function incrementUsage() {
  const usage = await getUsage();
  const newCount = usage.actionsUsed + 1;
  await chrome.storage.local.set({ actionsUsed: newCount });
  return newCount;
}

// --- API Integration ---
async function callAI(actionPrompt) {
  const usage = await getUsage();
  if (usage.actionsUsed >= MAX_ACTIONS_PER_MONTH) {
    showError("Upgrade ke Pro — Rp 49.000/bulan");
    return;
  }

  const context = getContext();
  if (!context) {
    showError("Tidak ada teks yang ditemukan untuk dianalisis.");
    return;
  }

  showLoading(true);

  try {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: context,
        systemPrompt: actionPrompt
      })
    });

    if (!response.ok) throw new Error('API Error');

    const data = await response.text();
    showResult(data);
    
    await incrementUsage();
    updateUsageDisplay();
  } catch (error) {
    showError("Terjadi kesalahan saat menghubungi AI. Pastikan Worker URL sudah di-setup.");
  } finally {
    showLoading(false);
  }
}

// --- UI Injection ---
function injectUI() {
  // Toggle Button
  const toggleBtn = document.createElement('div');
  toggleBtn.id = 'ctx-toggle-btn';
  toggleBtn.innerHTML = '✦';
  toggleBtn.addEventListener('click', toggleSidebar);
  document.body.appendChild(toggleBtn);

  // Sidebar Container
  const sidebar = document.createElement('div');
  sidebar.id = 'ctx-sidebar';
  
  // Header
  const header = document.createElement('div');
  header.className = 'ctx-header';
  header.innerHTML = `
    <div class="ctx-mode-badge">
      <span class="ctx-icon">${currentMode.icon}</span>
      <span class="ctx-mode-name">${currentMode.name}</span>
    </div>
    <div class="ctx-close" id="ctx-close-btn">&times;</div>
  `;
  sidebar.appendChild(header);

  // Usage Counter
  const usageDiv = document.createElement('div');
  usageDiv.id = 'ctx-usage-counter';
  usageDiv.className = 'ctx-usage';
  sidebar.appendChild(usageDiv);

  // Action Buttons
  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'ctx-actions';
  
  currentMode.actions.forEach(action => {
    const btn = document.createElement('button');
    btn.className = 'ctx-action-btn';
    btn.innerText = action.label;
    btn.addEventListener('click', () => callAI(action.prompt));
    actionsContainer.appendChild(btn);
  });
  sidebar.appendChild(actionsContainer);

  // Loading State
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'ctx-loading';
  loadingDiv.className = 'ctx-loading ctx-hidden';
  loadingDiv.innerText = 'Memproses...';
  sidebar.appendChild(loadingDiv);

  // Result Area
  const resultContainer = document.createElement('div');
  resultContainer.id = 'ctx-result-container';
  resultContainer.className = 'ctx-result-container ctx-hidden';
  
  const resultText = document.createElement('div');
  resultText.id = 'ctx-result-text';
  resultText.className = 'ctx-result-text';
  
  const copyBtn = document.createElement('button');
  copyBtn.id = 'ctx-copy-btn';
  copyBtn.className = 'ctx-copy-btn';
  copyBtn.innerText = 'Copy';
  copyBtn.addEventListener('click', () => copyToClipboard());

  resultContainer.appendChild(resultText);
  resultContainer.appendChild(copyBtn);
  sidebar.appendChild(resultContainer);

  document.body.appendChild(sidebar);

  // Bind close button event (after it's added to DOM)
  document.getElementById('ctx-close-btn').addEventListener('click', toggleSidebar);
}

// --- UI Actions ---
function toggleSidebar() {
  const sidebar = document.getElementById('ctx-sidebar');
  isSidebarOpen = !isSidebarOpen;
  
  if (isSidebarOpen) {
    sidebar.classList.add('ctx-open');
    updateUsageDisplay(); // Refresh usage when opening
  } else {
    sidebar.classList.remove('ctx-open');
  }
}

async function updateUsageDisplay() {
  const usageDiv = document.getElementById('ctx-usage-counter');
  if (!usageDiv) return;

  const usage = await getUsage();
  
  if (usage.actionsUsed >= MAX_ACTIONS_PER_MONTH) {
    usageDiv.innerHTML = `<span class="ctx-limit-reached">Upgrade ke Pro — Rp 49.000/bulan</span>`;
    // Disable buttons
    document.querySelectorAll('.ctx-action-btn').forEach(btn => btn.disabled = true);
  } else {
    // Hide usage counter since it's unlimited for now, or just show "Unlimited for Personal Use"
    usageDiv.innerHTML = `<span style="color: var(--ctx-primary); font-weight: 500;">Unlimited Personal Mode</span>`;
    // Enable buttons
    document.querySelectorAll('.ctx-action-btn').forEach(btn => btn.disabled = false);
  }
}

function showLoading(isLoading) {
  const loading = document.getElementById('ctx-loading');
  const resultContainer = document.getElementById('ctx-result-container');
  
  if (isLoading) {
    loading.classList.remove('ctx-hidden');
    resultContainer.classList.add('ctx-hidden');
  } else {
    loading.classList.add('ctx-hidden');
  }
}

function showResult(text) {
  const resultContainer = document.getElementById('ctx-result-container');
  const resultText = document.getElementById('ctx-result-text');
  const copyBtn = document.getElementById('ctx-copy-btn');
  
  resultText.innerText = text;
  copyBtn.innerText = 'Copy';
  resultContainer.classList.remove('ctx-hidden');
}

function showError(message) {
  const resultContainer = document.getElementById('ctx-result-container');
  const resultText = document.getElementById('ctx-result-text');
  const copyBtn = document.getElementById('ctx-copy-btn');
  
  resultText.innerHTML = `<span style="color: #ef4444;">${message}</span>`;
  copyBtn.style.display = 'none'; // Hide copy button on error
  resultContainer.classList.remove('ctx-hidden');
}

function copyToClipboard() {
  const text = document.getElementById('ctx-result-text').innerText;
  navigator.clipboard.writeText(text).then(() => {
    const copyBtn = document.getElementById('ctx-copy-btn');
    copyBtn.innerText = 'Copied!';
    setTimeout(() => { copyBtn.innerText = 'Copy'; }, 2000);
  });
}

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}