import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sendVerification, verifyCode } from "./controllers/twilio.controller";
dotenv.config();

const app = express();
const PORT = process.env.PORT || "3001";
app.use(express.json());
app.use(cors({ origin: "*" }));

app.post("/login", sendVerification);

app.post("/verify", verifyCode);

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
