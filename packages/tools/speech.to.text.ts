/**
 * Speech-to-text tool — transcribe audio files using Ollama's
 * OpenAI-compatible `/v1/audio/transcriptions` endpoint.
 *
 * The audio file is read from disk and sent as a multipart form
 * upload.  Uses the shared `resolveSafePath` helper to prevent
 * directory traversal.
 *
 * @module tools/speech.to.text
 */

import fs from "fs/promises";
import path from "path";
import type { Tool } from "./types";
import { resolveSafePath } from "../shared";

/** Ollama base URL for the transcription endpoint. */
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";

/** Default speech-to-text model. */
const DEFAULT_STT_MODEL = process.env.TOOL_STT_MODEL ?? "whisper";

/**
 * Tool instance for transcribing audio files.
 *
 * Input:
 * ```json
 * { "path": "audio/meeting.wav", "model": "whisper", "language": "en", "prompt": "context" }
 * ```
 */
export const speechToTextTool: Tool = {
  name: "speech_to_text",
  description:
    "Transcribe an audio file using Ollama OpenAI-compatible transcription endpoint. " +
    "Input: { path: string, model?: string, language?: string, prompt?: string }",

  /**
   * Read the audio file and send it to Ollama for transcription.
   *
   * @param input          - Tool input object.
   * @param input.path     - Path to the audio file (relative to project root).
   * @param input.model    - Optional override for the STT model name.
   * @param input.language - Optional language hint (ISO 639-1 code, e.g. `"en"`).
   * @param input.prompt   - Optional context/prompt to guide transcription.
   * @returns `{ model, path, text }` where `text` is the transcribed content.
   * @throws {Error} When the path is missing, file is empty, or API fails.
   */
  async execute({ path: audioPath, model, language, prompt }) {
    if (typeof audioPath !== "string" || audioPath.trim() === "") {
      throw new Error('"path" must be a non-empty string');
    }

    const safePath = resolveSafePath(audioPath);
    const data = await fs.readFile(safePath);
    if (data.length === 0) {
      throw new Error("Audio file is empty");
    }

    const usedModel = typeof model === "string" && model.trim() ? model : DEFAULT_STT_MODEL;

    /* Build multipart form data for the transcription API. */
    const form = new FormData();
    form.append("model", usedModel);
    if (typeof language === "string" && language.trim()) {
      form.append("language", language);
    }
    if (typeof prompt === "string" && prompt.trim()) {
      form.append("prompt", prompt);
    }
    form.append("file", new Blob([data]), path.basename(safePath));

    const res = await fetch(`${OLLAMA_BASE_URL}/v1/audio/transcriptions`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `Ollama transcription error: ${res.status} ${res.statusText}${body ? ` — ${body}` : ""}`,
      );
    }

    const parsed = (await res.json()) as { text?: string };
    return {
      model: usedModel,
      path: audioPath,
      text: parsed.text ?? "",
    };
  },
};
