# Appa Desktop Agent (Local Node.js Server)

This local server acts as the "hands" for Appa the AI Cat. It runs securely on your Mac and executes file management commands ONLY when you explicitly click "Izinkan" (Allow) inside the Chrome browser.

## How to Install & Run Automatically (LaunchAgents)

1. **Install Node Dependencies**
   Open your terminal, navigate to this `desktop-agent` folder, and run:
   ```bash
   npm install
   ```

2. **Find Your Node Path**
   Run this in terminal to find where Node is installed:
   ```bash
   which node
   ```
   *Copy the output (e.g., `/opt/homebrew/bin/node` or `/usr/local/bin/node`)*

3. **Edit the .plist File**
   Open `com.agredila.appa.agent.plist` in a text editor.
   *   Replace the first string in `ProgramArguments` with the Node path you found above.
   *   Replace the second string with the **absolute path** to your `server.js` file (e.g., `/Users/budi/contextify/desktop-agent/server.js`).

4. **Install the LaunchAgent**
   Copy the edited `.plist` file to your Mac's LaunchAgents folder:
   ```bash
   cp com.agredila.appa.agent.plist ~/Library/LaunchAgents/
   ```

5. **Start the Agent**
   Load it so it starts immediately (and automatically every time you turn on your Mac):
   ```bash
   launchctl load ~/Library/LaunchAgents/com.agredila.appa.agent.plist
   ```

**Success!** You should hear a Mac notification sound and see a popup saying "Appa (Contextify Agent) Aktif". Appa is now ready to serve you!