import { Twilio } from "twilio";
import dotenv from "dotenv";
dotenv.config();

export const twilio = new Twilio(
  process.env.TWILIO_TOKEN_SID,
  process.env.TWILIO_TOKEN_SECRET,
  {
    accountSid: process.env.TWILIO_ACCOUNT_SID!,
  }
);
