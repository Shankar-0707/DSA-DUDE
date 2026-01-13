import {PDFParse} from "pdf-parse";
import fs from 'fs';

/**
 * Extracts text from a PDF file path.
 * @param {string} filePath - The temporary path of the uploaded file.
 * @returns {Promise<string>} The extracted text.
 */

export const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const parser = new PDFParse({data : dataBuffer});
        const textResult = await parser.getText();
        return textResult.text;
    } catch (error) {
        console.error(`Error parsing from PDF File : ${error}`);
        throw new Error("Pdf processing failed.");
    }
}

