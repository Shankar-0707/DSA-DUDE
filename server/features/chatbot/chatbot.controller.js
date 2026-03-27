import { sanitizeMessage, processMessage } from "./chatbot.service.js";

export const handleMessage = async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const sanitizedMessage = sanitizeMessage(message);
    const result = await processMessage(req.user._id, sanitizedMessage, history || []);
    return res.json(result);
  } catch (error) {
    if (
      (error.message && error.message.includes("TIMEOUT")) ||
      error.code === "TIMEOUT"
    ) {
      return res.status(504).json({
        error: "AI service temporarily unavailable",
        code: "TIMEOUT",
      });
    }

    if (
      (error.message && error.message.includes("SERVICE_ERROR")) ||
      error.code === "SERVICE_ERROR"
    ) {
      return res.status(503).json({
        error: "AI service unavailable",
        code: "SERVICE_ERROR",
      });
    }

    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};
