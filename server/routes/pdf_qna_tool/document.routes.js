import express from "express";
import multer from "multer";
import {
    uploadAndSummarizeDocument,
    handleQuestion,
    getDocumentDetails,
    getUserDocuments,
} from "../../controllers/pdf_qna_tool/document.controller.js";
import { isAuthenticated } from "../../middlewares/auth.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.route("/").get(isAuthenticated, getUserDocuments);

router.post("/upload", isAuthenticated, upload.single("pdfFile"), uploadAndSummarizeDocument);

router.post("/:id/qa", isAuthenticated, handleQuestion);

router.get("/:id", isAuthenticated, getDocumentDetails);

export default router;