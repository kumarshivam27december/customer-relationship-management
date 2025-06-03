const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateMessageSuggestions = async (campaignObjective, audienceSegment) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate 3 different marketing message variants for a CRM campaign with the following objective: "${campaignObjective}".
    Target audience: ${audienceSegment}
    Requirements:
    1. Each message should be unique and compelling
    2. Keep messages concise (max 160 characters)
    3. Include a clear call to action
    4. Make them personal and engaging
    5. Format the response as a JSON array of strings`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const messages = JSON.parse(text);
    return messages;
  } catch (error) {
    console.error('Error generating message suggestions:', error);
    throw new Error('Failed to generate message suggestions');
  }
};

module.exports = {
  generateMessageSuggestions
}; 