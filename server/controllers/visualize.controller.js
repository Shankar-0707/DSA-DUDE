import { aiValidatePrefixSum, aiTracePrefixSum } from "../services/ai.service.js";

export const validatePrefixSum = async (req, res) => {
  const { problem, constraints, code } = req.body;

  const result = await aiValidatePrefixSum(problem, constraints, code);
  res.json(result);
};

export const tracePrefixSum = async (req, res) => {
  const { code, input } = req.body;

  const trace = await aiTracePrefixSum(code, input);
  res.json(trace);
};
