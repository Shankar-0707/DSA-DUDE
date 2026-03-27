import Document from "../../models/Document.js";
import {extractTextFromPDF} from "./pdf.service.js";
import {generateSummary, answerQuestion} from "./pdf.ai.service.js";

// POST -> /document/upload
export const uploadAndSummarizeDocument = async (req, res) => {
    if(!req.file){
        return res.status(400).send({message:"No file uploaded"});
    }
    const userId = req.user._id;

    try {
        // 1.) Extract the text from in-memory buffer
        const extractedText = await extractTextFromPDF(req.file.buffer);

        //2.) Generate Summary 
        const summary = await generateSummary(extractedText);

        // Save to db
        const newDocument = new Document({
            filename : req.file.originalname,
            user : userId,
            extractedText : extractedText,
            summary : summary,
        })
        await newDocument.save();
        res.status(201).json({
            id: newDocument._id,
            filename: newDocument.filename,
            summary: newDocument.summary,
        });
    } catch (error) {

        throw error;
    }
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

    throw error;
        }
}

