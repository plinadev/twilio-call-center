import express, { Request, Response } from "express";
import twilioService from "./service/twilio.service";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || "3001";
app.use(express.json());

app.post("/login", async (req: Request, res: Response) => {
  const data = await twilioService.sendVerify(process.env.MY_NUMBER!, "sms");
});

app.post("/verify", async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const data = await twilioService.checkVerify(process.env.MY_NUMBER!, code);
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
