import { env } from "src/config/env";

export async function generateResponse(messages: any[]) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-3-super-120b-a12b:free",
          messages,
        }),
      },
    );

    const data = await response.json();

    return data.choices?.[0]?.message?.content || "";
  } catch (err) {
    console.error("LLM Error:", err);
    throw new Error("AI response failed");
  }
}
