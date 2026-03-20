export const fetchGemini = async (prompt, systemInstruction, schema) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: { responseMimeType: "application/json", responseSchema: schema }
  };
  
  let retries = 5, delay = 1000;
  while (retries > 0) {
    try {
      const res = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return JSON.parse(data.candidates[0].content.parts[0].text);
    } catch (e) {
      retries--;
      if (retries === 0) throw e;
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
};
