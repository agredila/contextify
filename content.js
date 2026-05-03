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
  window.targetLanguage = targetLanguage;
  detectMode();
}

function detectMode() {
  const hostname = window.location.hostname;
  currentMode = MODES.RESEARCH; // Default fallback
  
  for (const key in MODES) {
    if (MODES[key].domains.some(domain => hostname.includes(domain))) {
      currentMode = MODES[key];
      break;
    }
  }
  
  window.currentMode = currentMode;
  if (typeof appaInstance !== 'undefined') { appaInstance.renderActionButtons(); }
}

// --- Context Extraction ---
window.getContext = async function() {
  // 0. Try Manual Input first (Appa's input)
  const manualInput = document.getElementById('appa-chat-input');
  // ... rest handled later. Let's rewrite getContext
  if (manualInput && manualInput.value.trim() !== '') {
    // If the user typed a specific command into Appa, don't treat it as document context
    // This is handled by Appa's chat. 
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
      ? "Chrome system blocked automatic PDF reading. Please copy the text and ask me directly."
      : "Sistem Chrome memblokir pembacaan PDF otomatis. Silakan Copy teksnya lalu tanyakan ke Appa langsung.";
    if (typeof appaInstance !== 'undefined') appaInstance.say(errorMsg);
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
window.callContextifyAI = async function(actionPrompt) {
  const usage = await getUsage();
  if (usage.actionsUsed >= MAX_ACTIONS_PER_MONTH) {
    if (typeof appaInstance !== 'undefined') appaInstance.say("Meow! Upgrade ke Pro — Rp 49.000/bulan");
    return;
  }

  if (typeof appaInstance !== 'undefined') appaInstance.say("*Berpikir...*");

  const context = await window.getContext();
  if (!context) {
    if (typeof appaInstance !== 'undefined') appaInstance.say("Meow? Aku tidak menemukan teks untuk dianalisis di layar ini.");
    return;
  }

  const languageInstruction = targetLanguage === 'en' 
    ? " IMPORTANT: You MUST answer strictly in ENGLISH language." 
    : " PENTING: Kamu WAJIB menjawab dengan menggunakan Bahasa Indonesia.";
    
  const appaPersona = `Kamu adalah Appa, seekor kucing virtual AI asisten yang pintar dan lucu. Gunakan gaya bicara seperti kucing (selipkan kata meow/purr). Jawablah dengan singkat dan jelas.\n\n`;
  const finalPrompt = appaPersona + "Tugasmu: " + actionPrompt + languageInstruction;

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
    const formattedData = data.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
    if (typeof appaInstance !== 'undefined') appaInstance.say(formattedData);
    
    await incrementUsage();
  } catch (error) {
    if (typeof appaInstance !== 'undefined') appaInstance.say("Terjadi kesalahan meow. Tidak bisa memanggil server.");
  }
};

// --- UI Injection ---

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// --- Appa AI Integration (Phase 2 & 3 Link) ---
window.askAppaAI = async function(question) {
  if (typeof appaInstance === 'undefined') return;
  
  const systemPrompt = `Kamu adalah Appa, seekor kucing virtual AI asisten yang pintar, lucu, dan selalu menggunakan nada bicara seperti kucing (tambahkan meow atau purr sesekali). 
  Jawablah pertanyaan user berikut secara singkat dan jelas (maksimal 2-3 paragraf pendek) agar muat di dalam speech bubble UI kamu.
  Pertanyaan user: ${question}`;

  try {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: question,
        systemPrompt: systemPrompt
      })
    });

    if (!response.ok) throw new Error('API Error');

    const data = await response.text();
    // Parse Markdown simply for the bubble (bolding and line breaks)
    const formattedData = data.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
    appaInstance.say(formattedData);
    
  } catch (error) {
    appaInstance.say("Meow! Aku kesulitan menghubungi server otakku. Coba lagi nanti.");
  }
};

window.executeAppaLocalTask = async function(taskString) {
  appaInstance.say(`Sedang mencoba mengeksekusi: ${taskString}...<br><br><span style="color:red;font-size:10px;">[System: Backend Local Node.js (Phase 3) belum di-setup di Mac Anda]</span>`);
};
