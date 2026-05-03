// Appa the Cat Logic
// Based loosely on the classic "Oneko" desktop pet mechanics

class AppaCat {
  constructor() {
    this.container = null;
    this.sprite = null;
    this.bubble = null;
    this.bubbleContent = null;
    
    // Physics & State
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight - 50;
    this.targetX = this.x;
    this.targetY = this.y;
    this.speed = 4;
    this.idleTime = 0;
    this.state = 'idle'; // idle, moving, sleeping
    this.frameCount = 0;
    
    // Sprite positions from oneko.gif (32x32 frames)
    this.spriteMap = {
      idle: [[-3, -3]],
      alert: [[-35, -3]],
      moveRight: [[-3, -99], [-35, -99]],
      moveLeft: [[-3, -131], [-35, -131]],
      moveUp: [[-3, -67], [-35, -67]],
      moveDown: [[-3, -35], [-35, -35]],
      sleep: [[-67, -3], [-99, -3]]
    };

    this.init();
  }

  init() {
    this.injectDOM();
    this.bindEvents();
    this.startLoop();
    
    // Greeting
    setTimeout(() => {
      this.say("Meow! Saya Appa. Ada yang bisa dibantu?", true);
    }, 1000);
  }

  renderActionButtons() {
    if (!this.actionContainer || !window.currentMode) return;
    this.actionContainer.innerHTML = '';
    
    // Only show buttons if there's text selected or if we want them always available
    const lang = window.targetLanguage || 'id';
    
    window.currentMode.actions.forEach(action => {
      const label = action[lang] ? action[lang].label : action.id.label;
      const prompt = action[lang] ? action[lang].prompt : action.id.prompt;

      const btn = document.createElement('button');
      btn.className = 'appa-context-btn';
      btn.innerText = label;
      btn.addEventListener('click', () => {
         if (window.callContextifyAI) {
            window.callContextifyAI(prompt);
         }
      });
      this.actionContainer.appendChild(btn);
    });
  }
    // Container
    this.container = document.createElement('div');
    this.container.id = 'appa-container';
    this.container.style.left = this.x + 'px';
    this.container.style.top = this.y + 'px';

    // Sprite
    this.sprite = document.createElement('div');
    this.sprite.id = 'appa-sprite';
    
    // Fix sprite URL dynamically based on Chrome extension URL
    const spriteUrl = chrome.runtime.getURL('assets/appa.gif');
    this.sprite.style.backgroundImage = `url('${spriteUrl}')`;

    // Speech Bubble
    this.bubble = document.createElement('div');
    this.bubble.id = 'appa-bubble';
    
    // Render Action Buttons inside Bubble
    this.actionContainer = document.createElement('div');
    this.actionContainer.className = 'appa-actions-container';
    
    this.bubble.innerHTML = `
      <div class="appa-bubble-header">
        Appa 🐾
        <span class="appa-close-btn" id="appa-close">&times;</span>
      </div>
      <div class="appa-bubble-content" id="appa-content">...</div>
    `;
    this.bubble.appendChild(this.actionContainer);
    
    // Add input wrapper
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'appa-input-wrapper';
    inputWrapper.innerHTML = `
        <button class="appa-action-btn appa-mic-btn" id="appa-mic">🎤</button>
        <input type="text" id="appa-chat-input" placeholder="Tanya Appa...">
        <button class="appa-action-btn" id="appa-send">➤</button>
    `;
    this.bubble.appendChild(inputWrapper);

    this.container.appendChild(this.sprite);
    this.container.appendChild(this.bubble);
    document.body.appendChild(this.container);

    this.bubbleContent = document.getElementById('appa-content');
  }

  bindEvents() {
    // Mouse tracking
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    document.addEventListener('mousemove', (e) => {
      const mouseDx = Math.abs(e.clientX - this.lastMouseX);
      const mouseDy = Math.abs(e.clientY - this.lastMouseY);
      
      // Only react if mouse moved significantly (avoids micro-jitter wakes)
      if (mouseDx > 5 || mouseDy > 5) {
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        
        // Only track if not hovering over Appa's bubble
        if (!this.bubble.contains(e.target) && !this.sprite.contains(e.target)) {
          this.targetX = e.clientX;
          this.targetY = e.clientY - 20; // Aim slightly above cursor
          this.idleTime = 0;
          
          if (this.state === 'sleep') {
            this.setSprite('alert', 0);
          }
        }
      }
    });

    // Clicking Appa toggles bubble
    this.sprite.addEventListener('click', () => {
      this.idleTime = 0;
      if (this.bubble.classList.contains('visible')) {
        this.hideBubble();
      } else {
        this.say("Meow? Ada tugas untukku?");
      }
    });

    // Bubble close
    document.getElementById('appa-close').addEventListener('click', () => {
      this.hideBubble();
    });

    // Chat functionality
    const input = document.getElementById('appa-chat-input');
    const sendBtn = document.getElementById('appa-send');
    const micBtn = document.getElementById('appa-mic');

    sendBtn.addEventListener('click', () => this.handleChat(input.value));
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleChat(input.value);
    });

    // Voice functionality (Web Speech API)
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'id-ID'; // Default to Indonesian

      this.recognition.onstart = () => {
        micBtn.classList.add('listening');
        input.placeholder = "Mendengarkan...";
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
        this.handleChat(transcript);
      };

      this.recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        this.say("Meow? Aku gak denger jelas. Coba lagi.");
        micBtn.classList.remove('listening');
        input.placeholder = "Tanya Appa...";
      };

      this.recognition.onend = () => {
        micBtn.classList.remove('listening');
        input.placeholder = "Tanya Appa...";
      };

      micBtn.addEventListener('click', () => {
        if (micBtn.classList.contains('listening')) {
          this.recognition.stop();
        } else {
          this.recognition.start();
        }
      });
    } else {
      micBtn.style.display = 'none'; // Hide if not supported
    }
  }

  handleChat(text) {
    if (!text.trim()) return;
    document.getElementById('appa-chat-input').value = '';
    
    // Check for explicit local commands
    if (text.toLowerCase().includes("rapihkan") || text.toLowerCase().includes("pindahkan")) {
      this.say(`*Memeriksa file lokal...*`);
      this.promptLocalAction(text);
      return;
    }

    this.say(`*Berpikir...*`);
    
    // Call AI in the background
    if (window.askAppaAI) {
      window.askAppaAI(text);
    } else {
      this.say("Ekstensi utama belum siap. Tunggu sebentar meow.");
    }
  }

  // Phase 3 Preview: Local Action Prompt
  promptLocalAction(taskString) {
    this.bubbleContent.innerHTML = `
      Menurutku kamu ingin mengubah file lokal di Mac.<br><br>
      <b>Tugas:</b> "${taskString}"<br><br>
      Izinkan Appa menjalankan ini?
    `;
    
    const confirmDiv = document.createElement('div');
    confirmDiv.className = 'appa-confirm-actions';
    confirmDiv.innerHTML = `
      <button class="appa-btn-yes">Izinkan</button>
      <button class="appa-btn-no">Batal</button>
    `;
    
    this.bubbleContent.appendChild(confirmDiv);

    confirmDiv.querySelector('.appa-btn-yes').addEventListener('click', async () => {
       this.bubbleContent.innerHTML = "*Menghubungi server lokal...*";
       try {
         const res = await fetch('http://localhost:3210/execute', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ command: taskString, type: 'simulation' })
         });
         const data = await res.json();
         if (data.success) {
           this.say(`Purrrfect! Tugas selesai: ${data.message}`, true);
         } else {
           this.say("Meow... Ada yang salah di server.", true);
         }
       } catch(e) {
         this.say("Gagal terhubung ke Mac kamu. Pastikan folder desktop-agent sudah di-run (LaunchAgent) ya meow!", true);
       }
    });

    confirmDiv.querySelector('.appa-btn-no').addEventListener('click', () => {
       this.say("Oke, dibatalkan! Meow.", true);
    });
  }

  say(text, autoHide = false) {
    this.bubbleContent.innerHTML = text;
    this.bubble.classList.add('visible');
    
    if (autoHide) {
      setTimeout(() => this.hideBubble(), 5000);
    }
  }

  hideBubble() {
    this.bubble.classList.remove('visible');
  }

  setSprite(animName, frameIdx) {
    const frames = this.spriteMap[animName];
    if (!frames) return;
    const frame = frames[frameIdx % frames.length];
    this.sprite.style.backgroundPosition = `${frame[0]}px ${frame[1]}px`;
  }

  updatePhysics() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If close enough to target, stop and idle
    if (distance < 20) {
      this.idleTime++;
      
      if (this.idleTime > 150) { // Sleep after a while
        this.state = 'sleep';
        this.setSprite('sleep', Math.floor(this.frameCount / 20));
      } else {
        this.state = 'idle';
        this.setSprite('idle', 0);
      }
      return;
    }

    // Move towards target smoothly
    this.state = 'moving';
    this.idleTime = 0;
    
    // Dampening factor for smoother tracking (lerp-like)
    const speedMultiplier = Math.min(this.speed, distance * 0.1);
    
    const vx = (dx / distance) * speedMultiplier;
    const vy = (dy / distance) * speedMultiplier;
    
    this.x += vx;
    this.y += vy;

    // Determine direction for sprite
    let anim = 'idle';
    if (Math.abs(vx) > Math.abs(vy)) {
      anim = vx > 0 ? 'moveRight' : 'moveLeft';
    } else {
      anim = vy > 0 ? 'moveDown' : 'moveUp';
    }

    // Update position and animate
    this.container.style.left = this.x + 'px';
    this.container.style.top = this.y + 'px';
    this.setSprite(anim, Math.floor(this.frameCount / 5));
  }

  startLoop() {
    const loop = () => {
      this.frameCount++;
      this.updatePhysics();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

// Initialize when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { window.appaInstance = new AppaCat(); });
} else {
  window.appaInstance = new AppaCat();
}