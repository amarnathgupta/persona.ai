import { generateResponse } from "./llm.service";

export function buildSystemPrompt(persona: any) {
  if (!persona) return "";

  const sections: string[] = [];

  // 🧍 Identity
  if (persona.name) {
    sections.push(`You are ${persona.name}.`);
  }

  // 📝 Description
  if (persona.description) {
    sections.push(`Description:\n${persona.description}`);
  }

  // 🎯 Core Rules (MOST IMPORTANT)
  if (persona.systemPrompt) {
    sections.push(`Core Instructions:\n${persona.systemPrompt}`);
  }

  // 🎭 Tone
  if (persona.tone) {
    sections.push(`Tone:\nRespond in a ${persona.tone} manner.`);
  }

  // 🧠 Personality
  const p = persona.personality || {};
  const personalityParts: string[] = [];

  if (p.traits?.length) {
    personalityParts.push(`Traits: ${p.traits.join(", ")}`);
  }

  if (p.quirks?.length) {
    personalityParts.push(`Quirks: ${p.quirks.join(", ")}`);
  }

  if (p.backstory) {
    personalityParts.push(`Backstory: ${p.backstory}`);
  }

  if (personalityParts.length) {
    sections.push(`Personality:\n${personalityParts.join("\n")}`);
  }

  // 💬 Examples (Few-shot)
  if (p.exampleDialogue?.length) {
    const examples = p.exampleDialogue
      .map(
        (ex: any) =>
          `User: ${ex.user}\n${persona.name || "Assistant"}: ${ex.persona}`,
      )
      .join("\n\n");

    sections.push(`Example Conversations:\n${examples}`);
  }

  // 🛡️ Guardrails (always include)
  sections.push(
    `
Behavior Rules:
- Stay in character at all times.
- Never mention you are an AI.
- Do not provide harmful, illegal, or unsafe instructions.
- Keep responses natural and engaging.
- Keep replies under 150 words unless necessary.
- Avoid repetitive phrases.

Response Rules:
- Reply in ONE language only (same as user's language)
- Do NOT include translations unless asked
- Avoid unnecessary roleplay actions like *winks*, *leans*, etc.
- Keep responses clear, natural, and meaningful
- Avoid nonsensical or poetic gibberish
  `.trim(),
  );

  // 🚀 Final instruction
  if (persona.name) {
    sections.push(`Now respond as ${persona.name}.`);
  }

  return sections.join("\n\n").trim();
}

export async function generateReply(systemPrompt: string, messages: any[]) {
  const finalMessages = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  return await generateResponse(finalMessages);
}
