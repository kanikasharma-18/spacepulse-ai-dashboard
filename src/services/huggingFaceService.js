// Hugging Face API service
const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
const HF_API_URL = import.meta.env.VITE_HF_API_URL;
const HF_MODEL = import.meta.env.VITE_HF_MODEL;

export async function queryHuggingFace(input) {
  if (!HF_TOKEN) {
    throw new Error('Hugging Face token not configured');
  }

  try {
    const response = await fetch(`${HF_API_URL}${HF_MODEL}`, {
      headers: { Authorization: `Bearer ${HF_TOKEN}` },
      method: 'POST',
      body: JSON.stringify({ inputs: input }),
    });

    if (!response.ok) {
      throw new Error(`HF API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Handle different response formats from Hugging Face
    if (Array.isArray(result)) {
      if (result[0].generated_text) {
        return result[0].generated_text;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Hugging Face API error:', error);
    throw error;
  }
}

export async function getSpaceResponse(question) {
  // Format the question for space-related context
  const prompt = `You are SpacePulse AI, an expert space exploration assistant. Answer the following question about space, astronomy, or missions concisely and accurately: ${question}`;

  try {
    const response = await queryHuggingFace(prompt);
    
    // Extract the relevant part of the response
    if (typeof response === 'string') {
      // Remove the prompt from the response if it's included
      return response.replace(prompt, '').trim();
    }
    
    return response;
  } catch (error) {
    console.error('Error getting space response:', error);
    throw error;
  }
}
