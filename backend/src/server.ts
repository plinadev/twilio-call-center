import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  changeCallStatus,
  enqueueCall,
  receiveNewCall,
  sendVerification,
  verifyCode,
} from "./controllers/twilio.controller";
import { authMiddleware } from "./middleware/auth.middleware";
dotenv.config();

const app = express();
const PORT = process.env.PORT || "3001";
app.use(express.json());
app.use(cors({ origin: "*" }));

app.post("/login", sendVerification);

app.post("/verify", verifyCode);
app.post("/call-new", authMiddleware, receiveNewCall);
app.post("/call-enqueue", authMiddleware, enqueueCall);
app.post("/call-status", authMiddleware, changeCallStatus);

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
