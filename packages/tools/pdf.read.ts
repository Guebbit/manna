/**
 * PDF reader tool — extract text content from PDF files.
 *
 * Uses the `pdf-parse` library to parse the document and the shared
 * `resolveSafePath` helper to prevent directory traversal.
 *
 * @module tools/pdf.read
 */

import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import type { Tool } from "./types";
import { resolveSafePath } from "../shared";

/**
 * Tool instance for reading text from PDF files.
 *
 * Input: `{ path: string }`
 * Output: `{ path, pageCount, text }`
 */
export const readPdfTool: Tool = {
  name: "read_pdf",
  description: "Read text from a PDF file. Input: { path: string }",

  /**
   * Read and parse the PDF at the given path, returning its text content.
   *
   * @param input      - Tool input object.
   * @param input.path - Path to the PDF file (relative to project root).
   * @returns `{ path, pageCount, text }` with the extracted text.
   * @throws {Error} When the path is missing, empty, or escapes the project root.
   */
  async execute({ path: pdfPath }) {
    if (typeof pdfPath !== "string" || pdfPath.trim() === "") {
      throw new Error('"path" must be a non-empty string');
    }

    const safePath = resolveSafePath(pdfPath);
    const buffer = await fs.readFile(safePath);
    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    await parser.destroy();

    return {
      path: pdfPath,
      pageCount: parsed.total,
      text: parsed.text.trim(),
    };
  },
};
