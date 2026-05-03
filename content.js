// --- Configuration ---
const WORKER_URL = "https://contextify.nadilasetiabudiarto.workers.dev/";
const MAX_ACTIONS_PER_MONTH = 999999; // Set to very high number for personal unlimited use

// --- Modes & Prompts Configuration ---
const MODES = {
  WRITING: {
    id: 'writing',
    name: { id: 'Writing Mode', en: 'Writing Mode' },
    icon: '📝',
    domains: ['docs.google.com', 'notion.so', 'gmail.com', 'medium.com', 'linkedin.com'],
    actions: [
      {
        id: { label: 'Rewrite lebih formal', prompt: 'Kamu adalah writing assistant. Rewrite teks berikut menjadi lebih formal dan profesional. Langsung tulis hasilnya tanpa preamble.' },
        en: { label: 'Rewrite more formal', prompt: 'You are a writing assistant. Rewrite the following text to be more formal and professional. Write the result directly without preamble.' }
      },
      {
        id: { label: 'Rewrite lebih santai', prompt: 'Kamu adalah writing assistant. Rewrite teks berikut menjadi lebih santai dan natural. Langsung tulis hasilnya tanpa preamble.' },
        en: { label: 'Rewrite more casual', prompt: 'You are a writing assistant. Rewrite the following text to be more casual and natural. Write the result directly without preamble.' }
      },
      {
        id: { label: 'Buat poin-poin', prompt: 'Kamu adalah writing assistant. Ubah teks berikut menjadi poin-poin (bullet points) yang mudah dibaca. Langsung tulis hasilnya tanpa preamble.' },
        en: { label: 'Make bullet points', prompt: 'You are a writing assistant. Convert the following text into easy-to-read bullet points. Write the result directly without preamble.' }
      },
      {
        id: { label: 'Persingkat teks ini', prompt: 'Kamu adalah writing assistant. Persingkat teks berikut tanpa menghilangkan makna utamanya. Langsung tulis hasilnya tanpa preamble.' },
        en: { label: 'Shorten this text', prompt: 'You are a writing assistant. Shorten the following text without losing its main meaning. Write the result directly without preamble.' }
      },
      {
        id: { label: 'Cek grammar & clarity', prompt: 'Kamu adalah writing assistant. Perbaiki tata bahasa (grammar) dan kejelasan (clarity) teks berikut. Berikan versi perbaikannya secara langsung tanpa preamble.' },
        en: { label: 'Check grammar & clarity', prompt: 'You are a writing assistant. Improve the grammar and clarity of the following text. Provide the improved version directly without preamble.' }
      }
    ]
  },
  RESEARCH: {
    id: 'research',
    name: { id: 'Research Mode', en: 'Research Mode' },
    icon: '🔍',
    domains: ['wikipedia.org'], // Fallback for other sites later
    actions: [
      {
        id: { label: 'Ringkas dalam 100 kata', prompt: 'Kamu adalah research assistant. Ringkas konten berikut dalam maksimal 100 kata. Langsung tulis ringkasannya tanpa preamble.' },
        en: { label: 'Summarize in 100 words', prompt: 'You are a research assistant. Summarize the following content in under 100 words. Write the summary directly without preamble.' }
      },
      {
        id: { label: 'Ambil angka & data penting', prompt: 'Kamu adalah research assistant. Ekstrak semua angka, statistik, dan data penting dari teks berikut. Sajikan dalam format list. Langsung tulis hasilnya tanpa preamble.' },
        en: { label: 'Extract key figures & data', prompt: 'You are a research assistant. Extract all important numbers, statistics, and data from the following text. Present them in a list format. Write the result directly without preamble.' }
      },
      {
        id: { label: 'Apa argumen utamanya?', prompt: 'Kamu adalah research assistant. Identifikasi dan jelaskan argumen utama dari teks berikut. Langsung tulis hasilnya tanpa preamble.' },
        en: { label: 'What is the main argument?', prompt: 'You are a research assistant. Identify and explain the main argument of the following text. Write the result directly without preamble.' }
      },
      {
        id: { label: 'Buat pertanyaan kritis', prompt: 'Kamu adalah research assistant. Buat 3-5 pertanyaan kritis berdasarkan teks berikut untuk memicu pemikiran lebih mendalam. Langsung tulis hasilnya tanpa preamble.' },
        en: { label: 'Generate critical questions', prompt: 'You are a research assistant. Create 3-5 critical questions based on the following text to spark deeper thinking. Write the result directly without preamble.' }
      }
    ]
  },
  DESIGN: {
    id: 'design',
    name: { id: 'Design Mode', en: 'Design Mode' },
    icon: '✨',
    domains: ['figma.com', 'dribbble.com', 'behance.net'],
    actions: [
      {
        id: { label: 'Analisis hierarki visual', prompt: 'Kamu adalah ahli desain UI/UX. Analisis teks/konteks halaman berikut dan berikan saran tentang hierarki visualnya. Langsung tulis hasilnya tanpa preamble.' },
        en: { label: 'Analyze visual hierarchy', prompt: 'You are a UI/UX design expert. Analyze the following text/context and provide suggestions regarding its visual hierarchy. Write the result directly without preamble.' }
      },
      {
        id: { label: 'Cek aksesibilitas warna', prompt: 'Kamu adalah ahli desain UI/UX. Berdasarkan konteks berikut, berikan saran mengenai aksesibilitas dan kontras warna. Langsung tulis hasilnya tanpa preamble.' },
        en: { label: 'Check color accessibility', prompt: 'You are a UI/UX design expert. Based on the following context, provide suggestions regarding color accessibility and contrast. Write the result directly without preamble.' }
      },
      {
        id: { label: 'Suggest improvement UX', prompt: 'Kamu adalah ahli desain UI/UX. Berikan saran untuk meningkatkan User Experience (UX) berdasarkan konteks berikut. Langsung tulis hasilnya tanpa preamble.' },
        en: { label: 'Suggest UX improvements', prompt: 'You are a UI/UX design expert. Provide suggestions to improve the User Experience (UX) based on the following context. Write the result directly without preamble.' }
      },
      {
        id: { label: 'Jelaskan kenapa desain ini works', prompt: 'Kamu adalah ahli desain UI/UX. Jelaskan mengapa pendekatan atau konten desain yang dideskripsikan di sini efektif. Langsung tulis hasilnya tanpa preamble.' },
        en: { label: 'Explain why this design works', prompt: 'You are a UI/UX design expert. Explain why the design approach or content described here is effective. Write the result directly without preamble.' }
      }
    ]
  },
  CODING: {
    id: 'coding',
    name: { id: 'Coding Mode', en: 'Coding Mode' },
    icon: '💻',
    domains: ['github.com', 'stackoverflow.com', 'codepen.io'],
    actions: [
      {
        id: { label: 'Jelaskan kode ini', prompt: 'Kamu adalah senior software engineer. Jelaskan cara kerja kode atau konteks teknis berikut dengan jelas dan ringkas. Langsung tulis hasilnya tanpa preamble.' },
        en: { label: 'Explain this code', prompt: 'You are a senior software engineer. Explain how the following code or technical context works clearly and concisely. Write the result directly without preamble.' }
      },
      {
        id: { label: 'Cari potensi bug', prompt: 'Kamu adalah senior software engineer. Analisis kode atau konteks teknis berikut dan identifikasi potensi bug atau kelemahan. Langsung tulis hasilnya tanpa preamble.' },
        en: { label: 'Find potential bugs', prompt: 'You are a senior software engineer. Analyze the following code or technical context and identify potential bugs or vulnerabilities. Write the result directly without preamble.' }
      },
      {
        id: { label: 'Rewrite lebih clean', prompt: 'Kamu adalah senior software engineer. Tulis ulang kode berikut agar lebih bersih (clean code), efisien, dan mudah dibaca. Langsung tulis hasilnya tanpa preamble.' },
        en: { label: 'Rewrite cleaner', prompt: 'You are a senior software engineer. Rewrite the following code to be cleaner, more efficient, and easier to read. Write the result directly without preamble.' }
      },
      {
        id: { label: 'Translate ke bahasa lain', prompt: 'Kamu adalah senior software engineer. Terjemahkan kode berikut ke bahasa pemrograman umum lainnya (misal: Python ke JS, atau sebaliknya, tebak dari konteks). Langsung tulis hasilnya tanpa preamble.' },
        en: { label: 'Translate to another language', prompt: 'You are a senior software engineer. Translate the following code into another common programming language (e.g., Python to JS, or vice versa, guess from context). Write the result directly without preamble.' }
      }
    ]
  }
};

// --- State ---
let currentMode = null;
let isSidebarOpen = false;
let targetLanguage = 'id'; // 'id' for Indonesian, 'en' for English

// --- Initialization ---
function init() {
  detectMode();
  injectUI();
  updateUsageDisplay();
  
  // Set initial language UI
  updateLanguageUI();
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
async function getContext() {
  // 0. Try Manual Input first
  const manualInput = document.getElementById('ctx-manual-input');
  if (manualInput && manualInput.value.trim() !== '') {
    return manualInput.value.trim();
  }

  // 1. Try User Selection (Most reliable everywhere)
  const selection = window.getSelection().toString().trim();
  if (selection) {
    return selection;
  }
  
  // 2. Determine if we are looking at a PDF
  const isPDF = window.location.pathname.toLowerCase().endsWith('.pdf') || document.contentType === 'application/pdf';
  
  if (isPDF) {
    // If it's a PDF and user didn't select text (or Chrome blocked getSelection)
    try {
      // Try to read from clipboard as a fallback for PDF viewer selection blocking
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText && clipboardText.trim().length > 5) {
        return clipboardText.trim();
      }
    } catch (e) {
      console.warn("Clipboard read failed, asking user to use manual input.");
    }

    const errorMsg = targetLanguage === 'en' 
      ? "Chrome system blocked automatic PDF reading. Please PASTE the text you want to analyze into the input box above, then click the action button."
      : "Sistem Chrome memblokir pembacaan PDF otomatis. Silakan PASTE teks yang ingin Anda ringkas ke dalam kotak input di atas, lalu klik tombol aksi.";
    showError(errorMsg);
    showLoading(false);
    return null;
  }
  
  // 3. Fallback for normal websites
  const title = document.title;
  let bodyText = document.body.innerText;
  
  // Clean up excessive whitespace
  if (bodyText) {
     bodyText = bodyText.replace(/\s+/g, ' ').substring(0, 5000);
  }
  
  if (!bodyText || bodyText.trim() === '') {
    return null;
  }
  
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
async function callAI(basePrompt) {
  const usage = await getUsage();
  if (usage.actionsUsed >= MAX_ACTIONS_PER_MONTH) {
    showError("Upgrade ke Pro — Rp 49.000/bulan");
    return;
  }

  showLoading(true);

  const context = await getContext();
  if (!context) {
    showLoading(false);
    showError("Tidak ada teks yang ditemukan untuk dianalisis.");
    return;
  }

  // Append language instruction to the prompt
  const languageInstruction = targetLanguage === 'en' 
    ? " IMPORTANT: You MUST answer strictly in ENGLISH language." 
    : " PENTING: Kamu WAJIB menjawab dengan menggunakan Bahasa Indonesia.";
    
  const finalPrompt = basePrompt + languageInstruction;

  try {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: context,
        systemPrompt: finalPrompt
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
  document.body.appendChild(toggleBtn);
  
  // Make button draggable and load saved position
  makeDraggable(toggleBtn);
  chrome.storage.local.get(['togglePosition'], (result) => {
    if (result.togglePosition) {
      toggleBtn.style.right = 'auto';
      toggleBtn.style.bottom = 'auto';
      toggleBtn.style.left = result.togglePosition.left + 'px';
      toggleBtn.style.top = result.togglePosition.top + 'px';
    }
  });

  // Sidebar Container
  const sidebar = document.createElement('div');
  sidebar.id = 'ctx-sidebar';
  
  // Header
  const header = document.createElement('div');
  header.className = 'ctx-header';
  
  // Safe initial name check
  const defaultModeName = currentMode && currentMode.name && currentMode.name[targetLanguage] 
    ? currentMode.name[targetLanguage] 
    : (currentMode.name ? currentMode.name.id : 'Contextify');

  header.innerHTML = `
    <div class="ctx-mode-badge">
      <span class="ctx-icon">${currentMode.icon}</span>
      <span class="ctx-mode-name">${defaultModeName}</span>
    </div>
    <div class="ctx-header-actions">
      <select id="ctx-lang-toggle" class="ctx-lang-select">
        <option value="id" ${targetLanguage === 'id' ? 'selected' : ''}>🇮🇩 ID</option>
        <option value="en" ${targetLanguage === 'en' ? 'selected' : ''}>🇬🇧 EN</option>
      </select>
      <div class="ctx-close" id="ctx-close-btn">&times;</div>
    </div>
  `;
  sidebar.appendChild(header);

  // Usage Counter
  const usageDiv = document.createElement('div');
  usageDiv.id = 'ctx-usage-counter';
  usageDiv.className = 'ctx-usage';
  sidebar.appendChild(usageDiv);

  // Action Buttons Container
  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'ctx-actions';
  actionsContainer.id = 'ctx-actions-container';
  
  // Manual Input Area
  const manualInputDiv = document.createElement('div');
  manualInputDiv.className = 'ctx-manual-input-container';
  manualInputDiv.innerHTML = `<textarea id="ctx-manual-input" class="ctx-manual-input" placeholder="Tempel/Paste teks di sini jika tidak terdeteksi otomatis..."></textarea>`;
  actionsContainer.appendChild(manualInputDiv);

  sidebar.appendChild(actionsContainer);

  // Render initial action buttons
  renderActionButtons();

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

  // Bind events
  document.getElementById('ctx-close-btn').addEventListener('click', toggleSidebar);
  document.getElementById('ctx-lang-toggle').addEventListener('change', (e) => {
    targetLanguage = e.target.value;
    updateLanguageUI();
  });
}

// --- Draggable Button Logic ---
function makeDraggable(btn) {
  let isDragging = false;
  let hasMoved = false;
  let startX, startY, initialLeft, initialTop;

  btn.addEventListener('mousedown', (e) => {
    isDragging = true;
    hasMoved = false;
    startX = e.clientX;
    startY = e.clientY;
    
    const rect = btn.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
    
    btn.style.transition = 'none'; // Disable transition during drag for smoothness
    e.preventDefault(); // Prevent text selection
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    // Consider it a drag only if moved more than 5px (prevents accidental drags on click)
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasMoved = true;
    }
    
    if (hasMoved) {
      btn.style.right = 'auto';
      btn.style.bottom = 'auto';
      
      // Keep within window bounds
      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;
      
      const maxX = window.innerWidth - btn.offsetWidth;
      const maxY = window.innerHeight - btn.offsetHeight;
      
      newLeft = Math.max(0, Math.min(newLeft, maxX));
      newTop = Math.max(0, Math.min(newTop, maxY));
      
      btn.style.left = newLeft + 'px';
      btn.style.top = newTop + 'px';
    }
  });

  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    // Re-enable hover transitions
    btn.style.transition = 'transform 0.2s ease, background-color 0.2s ease';
    
    if (hasMoved) {
      // Save the new position to storage
      chrome.storage.local.set({
        togglePosition: {
          left: btn.offsetLeft,
          top: btn.offsetTop
        }
      });
    }
  });
  
  // Custom click handler to distinguish between clicking and dragging
  btn.addEventListener('click', (e) => {
    if (hasMoved) {
      // It was a drag, don't open the sidebar
      e.stopPropagation();
      e.preventDefault();
    } else {
      // It was a clean click, open the sidebar
      toggleSidebar();
    }
  });
}

function updateLanguageUI() {
  // Update Header Name
  const modeNameEl = document.querySelector('.ctx-mode-name');
  if (modeNameEl && currentMode.name && currentMode.name[targetLanguage]) {
    modeNameEl.innerText = currentMode.name[targetLanguage];
  }

  // Update Manual Input Placeholder
  const manualInput = document.getElementById('ctx-manual-input');
  if (manualInput) {
    manualInput.placeholder = targetLanguage === 'en' 
      ? "Paste text here if automatic detection fails..." 
      : "Tempel/Paste teks di sini jika tidak terdeteksi otomatis...";
  }

  // Re-render buttons
  renderActionButtons();
}

function renderActionButtons() {
  const container = document.getElementById('ctx-actions-container');
  if (!container) return;

  // Remove existing action buttons (but keep the manual input container which is the first child)
  const existingBtns = container.querySelectorAll('.ctx-action-btn');
  existingBtns.forEach(btn => btn.remove());

  // Add new buttons based on language
  currentMode.actions.forEach(action => {
    // Failsafe in case the structure is incorrect
    const label = action[targetLanguage] ? action[targetLanguage].label : action.id.label;
    const prompt = action[targetLanguage] ? action[targetLanguage].prompt : action.id.prompt;

    const btn = document.createElement('button');
    btn.className = 'ctx-action-btn';
    btn.innerText = label;
    btn.addEventListener('click', () => callAI(prompt));
    container.appendChild(btn);
  });
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
    loading.innerText = 'Memproses...'; // Reset text
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