import Document from "../../models/pdf_qna_models/document.js";
import {extractTextFromPDF} from "../../services/pdf_qna_tool/pdf.service.js";
import {generateSummary, answerQuestion} from "../../services/pdf_qna_tool/ai.js";
import fs from "fs";

// POST -> /document/upload
export const uploadAndSummarizeDocument = async (req, res) => {
    if(!req.file){
        return res.status(400).send({message:"No file uploaded"});
    }
    const userId = req.user._id;
    const filePath = req.file.path;

    try {
        // 1.) Extract the text
        const extractedText = await extractTextFromPDF(filePath);

        //2.) Generate Summary 
        const summary = await generateSummary(extractedText);

        // Save to db
        const newDocument = new Document({
            filename : req.file.originalname,
            user : userId,
            extractedText : extractedText,
            summary : summary,
        })
        await newDocument.save();  // ye asynchronous function hota h isiliye await 
        res.status(201).json({
            id: newDocument._id,
            filename: newDocument.filename,
            summary: newDocument.summary,
            // extractedText is large, so generally don't send back in full response
        });
    } catch (error) {
          console.error(error);
    throw error;
    }
    finally{
        // Clean up the tempoorary file
if (filePath) {
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.error("Failed to delete temp file:", err.message);
        }
    }    }
};

// POST /api/documents/:id/qa

export const handleQuestion = async (req, res) => {
    const { question } = req.body;
    const { id } = req.params;

    try{
        const document = await Document.findById(id);
        if(!document){
            return res.status(404).json({ message: 'Document not found' });
        }

        // 1.) Use document text as context for the answer
        const answer = await answerQuestion(document.extractedText, question);

        // 2. Save Q&A to history in MongoDB
        document.qaHistory.push({ question, answer });
        await document.save();

        // 3. Respond
        res.status(200).json({ answer, history: document.qaHistory });
    }
    catch (error) {
         console.error(error);
    throw error;
    }
};

// GET /api/documents/:id
export const getDocumentDetails = async (req, res) => {
    try{
        const document = await Document.findById(req.params.id).select('-extractedText');
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(document);
    }
    catch (error) {
 console.error(error);
    throw error;    }
}

// GET /api/documents/

export const getUserDocuments =  async (req,res) => {
        // req.user is set by your 'protect' middleware after authentication
        try{
            const documents = await Document.find({user : req.user._id}).select('filename summary qaHistory createdAt').sort({ createdAt: -1 });
            res.status(200).json(documents);
        }
        catch(error){
             console.error(error);
    throw error;
        }
}

