import express, { Request, Response } from "express";
import twilioService from "./service/twilio.service";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || "3001";
app.use(express.json());
app.use(cors({ origin: "*" }));
app.post("/login", async (req: Request, res: Response) => {
  const { to, username } = req.body;
  const data = await twilioService.sendVerify(to, "sms");
  res.status(200);
});

app.post("/verify", async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const { to } = req.body;
  const data = await twilioService.checkVerify(to, code);
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
