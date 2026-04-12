import fs from "fs/promises";
import { generate } from "../llm/ollama";
import { resolveSafePath } from "./image.utils";
import type { Tool } from "./types";

const DEFAULT_VISION_MODEL = process.env.TOOL_VISION_MODEL ?? "llava-llama3";

export async function describeInkingFromBase64(
  base64Image: string,
  model: string,
): Promise<string> {
  const prompt =
    "You are an expert illustration assistant. This image is a hand-drawn sketch. " +
    "Describe in detail how this sketch would look as a clean, inked line drawing: " +
    "which lines should be bold or thin, where shadows and hatching would appear, " +
    "and how the final inked version would differ from the rough sketch. " +
    "Be specific about line weights, contours, and inking style.";

  return generate(prompt, {
    model,
    stream: false,
    images: [base64Image],
  });
}

export const imageInkTool: Tool = {
  name: "image_ink",
  description:
    "Analyze a sketch image and describe how it would look when inked (clean line art). " +
    "Input: { path: string, model?: string }",

  async execute({ path: imagePath, model }) {
    if (typeof imagePath !== "string" || imagePath.trim() === "") {
      throw new Error('"path" must be a non-empty string');
    }

    const safePath = resolveSafePath(imagePath);
    const buffer = await fs.readFile(safePath);
    const base64Image = buffer.toString("base64");
    const usedModel = typeof model === "string" && model.trim() ? model : DEFAULT_VISION_MODEL;

    const inkingDescription = await describeInkingFromBase64(base64Image, usedModel);

    return {
      model: usedModel,
      path: imagePath,
      inkingDescription: inkingDescription.trim(),
    };
  },
};
