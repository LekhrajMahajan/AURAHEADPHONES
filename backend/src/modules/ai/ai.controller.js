const PRODUCTS = [
  { id: 1, name: 'Aura Pro Studio', color: 'Ivory White', price: 3490 },
  { id: 2, name: 'Aura Elite ANC', color: 'Obsidian Black', price: 3990 },
  { id: 3, name: 'Aura Lite Wireless', color: 'Rose Quartz', price: 1990 },
  { id: 4, name: 'Aura Play Gaming', color: 'Stealth Black', price: 2490 },
  { id: 5, name: 'Aura Classic', color: 'Pearl White', price: 2990 },
  { id: 6, name: 'Aura Command X', color: 'Carbon Chrome', price: 4490 },
  { id: 7, name: 'Aura DJ Master', color: 'Platinum Silver', price: 3290 },
  { id: 8, name: 'Aura Air Minimalist', color: 'Bone White', price: 1790 },
];

export const getAIRecommendation = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt?.trim()) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  const productList = PRODUCTS.map(p =>
    `- ${p.name} (${p.color}): ₹${p.price.toLocaleString('en-IN')}`
  ).join('\n');

  const systemPrompt = `You are an expert AI Audiophile for AURA Headphones — a premium Indian audio brand.
Your job is to analyze user listening habits and recommend the BEST matching headphone from our catalog.

Our product catalog:
${productList}

Rules:
- Recommend ONLY from the above catalog
- Be specific and confident
- Respond ONLY in valid JSON — no markdown, no extra text

JSON format:
{
  "modelRecommendation": "exact product name from catalog",
  "reason": "2-3 sentence personalized explanation",
  "profile": [
    { "attribute": "Use Case", "detail": "..." },
    { "attribute": "Key Feature", "detail": "..." },
    { "attribute": "Price", "detail": "₹X,XXX" },
    { "attribute": "Why Aura", "detail": "..." }
  ]
}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' }, 
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error('Groq API Error:', errData);
      return res.status(500).json({ message: 'AI service error. Please try again.' });
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    res.status(200).json(result);

  } catch (err) {
    console.error('AI Error:', err.message);
    res.status(500).json({ message: 'AI recommendation failed. Please try again.' });
  }
};