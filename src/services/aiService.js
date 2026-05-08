// AI Service — Hugging Face Inference API
// Model: mistralai/Mistral-7B-Instruct-v0.2
// Token: import.meta.env.VITE_AI_TOKEN

const HF_ENDPOINT =
  'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3';

const TIMEOUT_MS = 30000; // 30 s

// ─── Context-restriction system prompt ─────────────────────────────────────
function buildPrompt(userQuestion, dashboardContext) {
  const ctx = `
CURRENT DASHBOARD DATA:
- ISS Latitude: ${dashboardContext.latitude ?? 'N/A'}°
- ISS Longitude: ${dashboardContext.longitude ?? 'N/A'}°
- ISS Altitude: ${dashboardContext.altitude ?? 'N/A'} km
- ISS Velocity: ${dashboardContext.velocity ?? 'N/A'} km/h
- ISS Visibility: ${dashboardContext.visibility ?? 'N/A'}
- Crew on board: ${dashboardContext.crew ?? 'N/A'} astronauts
- Astronaut names: ${dashboardContext.astronauts ?? 'N/A'}
- Latest news titles: ${dashboardContext.newsTitles ?? 'N/A'}
- News descriptions: ${dashboardContext.newsDescriptions ?? 'N/A'}
- News categories: ${dashboardContext.newsCategories ?? 'N/A'}
`.trim();

  return `<s>[INST] You are SpacePulse AI, an assistant that ONLY answers questions using the dashboard data provided below. Do NOT use any outside knowledge, do NOT make up information, and do NOT hallucinate. If the user's question cannot be answered using the data below, reply EXACTLY with: "I can only answer using the current ISS and news dashboard data."

${ctx}

User question: ${userQuestion} [/INST]`;
}

// ─── Core API call ──────────────────────────────────────────────────────────
async function callHuggingFace(prompt) {
  const token = import.meta.env.VITE_AI_TOKEN;

  if (!token) {
    throw new Error('VITE_AI_TOKEN is not set. Please add it to your .env file.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(HF_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-wait-for-model': 'true',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.3,
          return_full_text: false,
          do_sample: true,
        },
        options: {
          wait_for_model: true,
          use_cache: false,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Rate limit
    if (response.status === 429) {
      throw new Error('RATE_LIMITED');
    }

    // Model loading (503 with estimated_time)
    if (response.status === 503) {
      const body = await response.json().catch(() => ({}));
      const wait = body.estimated_time ? Math.ceil(body.estimated_time) : 20;
      throw new Error(`MODEL_LOADING:${wait}`);
    }

    if (!response.ok) {
      const errBody = await response.text().catch(() => response.statusText);
      throw new Error(`API_ERROR:${response.status}:${errBody}`);
    }

    const data = await response.json();

    // Extract generated text
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.trim();
    }
    if (data?.generated_text) {
      return data.generated_text.trim();
    }
    throw new Error('UNEXPECTED_FORMAT');
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('TIMEOUT');
    }
    throw err;
  }
}

// ─── Public interface ───────────────────────────────────────────────────────
/**
 * Ask the AI a question with context from the live dashboard.
 * @param {string} question
 * @param {object} dashboardContext  { latitude, longitude, altitude, velocity,
 *                                    visibility, crew, astronauts,
 *                                    newsTitles, newsDescriptions, newsCategories }
 * @returns {Promise<string>}
 */
export async function askAI(question, dashboardContext = {}) {
  const prompt = buildPrompt(question, dashboardContext);

  try {
    const raw = await callHuggingFace(prompt);
    // Strip any leftover [/INST] or prompt leakage
    return raw.replace(/\[\/INST\]/gi, '').trim() || 'I can only answer using the current ISS and news dashboard data.';
  } catch (err) {
    if (err.message === 'RATE_LIMITED') {
      throw new Error('AI service is rate-limited. Please wait a moment and try again.');
    }
    if (err.message.startsWith('MODEL_LOADING:')) {
      const secs = err.message.split(':')[1];
      throw new Error(`AI model is loading (est. ${secs}s). Please try again shortly.`);
    }
    if (err.message === 'TIMEOUT') {
      throw new Error('AI service timed out. Please try again.');
    }
    throw new Error('AI service is temporarily unavailable. Please try again later.');
  }
}
