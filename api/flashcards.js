import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Génère uniquement un JSON valide sous cette forme : [{\"question\":\"...\",\"answer\":\"...\"}]"
        },
        {
          role: "user",
          content: `Crée des flashcards à partir de ce texte : ${text}`
        }
      ],
      temperature: 0.7
    });

    const flashcards = JSON.parse(response.choices[0].message.content);

    return res.status(200).json({ flashcards });

  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
