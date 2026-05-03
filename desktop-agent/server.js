const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const app = express();
const PORT = 3210; // Appa's local port

app.use(cors());
app.use(express.json());

// Handshake endpoint to check if agent is alive
app.get('/ping', (req, res) => {
  res.json({ status: 'alive', name: 'Appa Desktop Agent' });
});

// VERY RESTRICTED endpoint for Phase 3 (File moving logic)
app.post('/execute', (req, res) => {
  const { command, type } = req.body;
  
  // Security checks: Only allow specific known commands
  // We will build this out securely in the future based on Gemini's JSON output
  // For now, we simulate success
  
  if (!command) {
    return res.status(400).json({ error: 'No command provided' });
  }

  console.log(`[Appa Agent] Execution request received: ${command}`);

  // Simulating the execution delay
  setTimeout(() => {
    res.json({ 
      success: true, 
      message: 'Command executed successfully by Appa local agent.',
      executed: command
    });
  }, 1000);
});

// Start server and trigger native Mac Notification greeting
app.listen(PORT, () => {
  console.log(`Appa Desktop Agent listening silently on http://localhost:${PORT}`);
  
  // AppleScript to show a nice notification when the server boots up via LaunchAgents
  const greetingScript = `display notification "Meow! Saya siap bantu rapih-rapih hari ini." with title "Appa (Contextify Agent) Aktif" sound name "Glass"`;
  exec(`osascript -e '${greetingScript}'`);
});