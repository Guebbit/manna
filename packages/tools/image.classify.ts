/**
 * Image classification / description tool.
 *
 * Reads an image from disk, base64-encodes it, and sends it to a
 * multimodal (vision) model via Ollama.  The model returns a textual
 * description or classification of the image.
 *
 * Uses the shared `resolveSafePath` helper to prevent path traversal.
 * Uses the shared `envFloat` / `envInt` helpers for option parsing.
 *
 * @module tools/image.classify
 */

import fs from "fs/promises";
import { generate } from "../llm/ollama";
import type { Tool } from "./types";
import { resolveSafePath, envFloat, envInt } from "../shared";

/** Default vision model, configurable via environment variable. */
const DEFAULT_VISION_MODEL = process.env.TOOL_VISION_MODEL ?? "llava-llama3";

/**
 * Tool instance for classifying / describing images.
 *
 * Input:
 * ```json
 * { "path": "images/photo.jpg", "prompt": "What is this?", "model": "llava:13b" }
 * ```
 */
export const imageClassifyTool: Tool = {
  name: "image_classify",
  description:
    "Classify/describe an image with a vision model. " +
    "Input: { path: string, prompt?: string, model?: string }",

  /**
   * Read the image, encode it as base64, and ask the vision model.
   *
   * @param input        - Tool input object.
   * @param input.path   - Path to the image file (relative to project root).
   * @param input.prompt - Optional custom prompt (defaults to a generic "describe this image" prompt).
   * @param input.model  - Optional override for the vision model name.
   * @returns `{ model, path, response }` where `response` is the model's description.
   * @throws {Error} When the path is missing, empty, or escapes the project root.
   */
  async execute({ path: imagePath, prompt, model }) {
    if (typeof imagePath !== "string" || imagePath.trim() === "") {
      throw new Error('"path" must be a non-empty string');
    }

    const safePath = resolveSafePath(imagePath);
    const buffer = await fs.readFile(safePath);
    const base64Image = buffer.toString("base64");
    const usedModel = typeof model === "string" && model.trim() ? model : DEFAULT_VISION_MODEL;
    const usedPrompt =
      typeof prompt === "string" && prompt.trim()
        ? prompt
        : "Describe this image and identify what it most likely contains.";

    const response = await generate(usedPrompt, {
      model: usedModel,
      stream: false,
      images: [base64Image],
      options: {
        temperature: envFloat(process.env.TOOL_VISION_TEMPERATURE, 0.2),
        top_p: envFloat(process.env.TOOL_VISION_TOP_P, 0.8),
        top_k: envInt(process.env.TOOL_VISION_TOP_K, 20),
        num_ctx: envInt(process.env.TOOL_VISION_NUM_CTX, 4096),
        repeat_penalty: envFloat(process.env.TOOL_VISION_REPEAT_PENALTY, 1.3),
      },
    });

    return {
      model: usedModel,
      path: imagePath,
      response: response.trim(),
    };
  },
};
