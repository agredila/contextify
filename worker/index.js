export default {
  async fetch(request, env, ctx) {
    // CORS Headers for Chrome Extension
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle OPTIONS request for CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const { prompt, systemPrompt } = await request.json();

      if (!prompt || !systemPrompt) {
        return new Response("Missing prompt or systemPrompt", { status: 400, headers: corsHeaders });
      }

      // Placeholder for Gemini API Key - Replace with actual key in Cloudflare Secrets
      const GEMINI_API_KEY = env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";
      
      if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
         const availableEnvKeys = Object.keys(env).join(", ");
         return new Response(`API Key not configured in Worker. Available env keys: ${availableEnvKeys}`, { status: 500, headers: corsHeaders });
      }

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nContext/Text to process:\n${prompt}` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
        }
      };

      const aiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        return new Response(`AI API Error: ${errorText}`, { status: aiResponse.status, headers: corsHeaders });
      }

      const aiData = await aiResponse.json();
      
      // Extract text from Gemini response format
      let resultText = "No response generated.";
      if (aiData.candidates && aiData.candidates[0] && aiData.candidates[0].content && aiData.candidates[0].content.parts) {
         resultText = aiData.candidates[0].content.parts.map(part => part.text).join("");
      }

      return new Response(resultText, { 
        status: 200, 
        headers: { 
          ...corsHeaders,
          "Content-Type": "text/plain;charset=UTF-8" 
        } 
      });

    } catch (error) {
      return new Response(`Error processing request: ${error.message}`, { status: 500, headers: corsHeaders });
    }
  },
};