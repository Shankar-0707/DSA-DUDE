/**
 * Builds the context window for the AI provider.
 * Takes the last 10 messages and maps role "ai" → "assistant".
 * @param {Array} messages - Full messages array from ChatWidget state
 * @returns {Array} - Array of { role, content } objects
 */
export const buildContextWindow = (messages) => {
  return messages
    .slice(-10)
    .map(({ role, content }) => ({
      role: role === "ai" ? "assistant" : role,
      content,
    }));
};
