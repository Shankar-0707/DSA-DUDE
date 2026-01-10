import express from "express";
import cors from"cors";
import dotenv from "dotenv";
import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./error/error.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js"

const app = express();
dotenv.config({path: "./config/config.env"});

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods : ["POST", "GET","UPDATE", "DELETE"],
    credentials : true
}));

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use("/auth", authRoutes);

dbConnection();

app.use(errorMiddleware);

export default app;