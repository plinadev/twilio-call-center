import { Request, Response } from "express";
import twilioService from "../service/twilio.service";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

export const sendVerification = async (req: Request, res: Response) => {
  const { to, username } = req.body;

  if (!to || !username) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: 'to' and 'username'",
    });
  }

  const result = await twilioService.sendVerify(to, "sms");

  if (result.success) {
    return res.status(200).json({
      success: true,
      status: result.status,
      message: `Verification code sent to ${to}`,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: result.error,
    });
  }
};

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

export const verifyCode = async (req: Request, res: Response) => {
  const { to, code } = req.body;

  if (!to || !code) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: 'to' and 'code'",
    });
  }

  try {
    const result = await twilioService.checkVerify(to, code);

    if (result.status === "approved") {
      const token = jwt.sign(
        { phone: to },
        JWT_SECRET as Secret,
        {
          expiresIn: JWT_EXPIRES_IN,
        } as SignOptions
      );

      return res.status(200).json({
        success: true,
        status: "approved",
        message: "Phone number verified successfully",
        token, // send token to client
      });
    }

    if (result.status === "pending") {
      return res.status(200).json({
        success: false,
        status: "pending",
        message: "Code is incorrect or expired",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Verification failed. Please try again.",
    });
  } catch (error: any) {
    console.error("❌ Verification error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error during verification.",
    });
  }
};
