# Contextify API Proxy Worker

This is a Cloudflare Worker that acts as a proxy for the Gemini 1.5 Flash API. It handles requests from the Contextify Chrome Extension, injects the API key securely, and manages CORS.

## Deployment Instructions

1.  **Prerequisites:**
    *   A Cloudflare account.
    *   Wrangler CLI installed (`npm install -g wrangler`).
    *   A Gemini API Key from Google AI Studio.

2.  **Login to Cloudflare:**
    ```bash
    wrangler login
    ```

3.  **Initialize Worker (if not already done):**
    If you are setting this up for the first time in a new directory:
    ```bash
    wrangler init contextify-worker
    # Choose "Fetch handler"
    ```
    *Replace the generated `src/index.js` with the `worker/index.js` provided in this project.*

4.  **Set the Gemini API Key as a Secret:**
    ```bash
    wrangler secret put GEMINI_API_KEY
    # Paste your Gemini API key when prompted
    ```

5.  **Deploy the Worker:**
    ```bash
    wrangler deploy
    ```

6.  **Update Chrome Extension:**
    *   Once deployed, Wrangler will output a URL (e.g., `https://contextify-worker.<your-subdomain>.workers.dev`).
    *   Copy this URL.
    *   Open `content.js` in the extension root folder.
    *   Replace `const WORKER_URL = "YOUR_WORKER_URL";` with your deployed worker URL.
    *   Reload the extension in Chrome (`chrome://extensions`).