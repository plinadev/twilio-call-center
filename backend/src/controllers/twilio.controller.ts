import { Request, Response } from "express";
import twilioService from "../service/twilio.service";

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

export const verifyCode = async (req: Request, res: Response) => {
  const { to, code } = req.body;

  if (!to || !code) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: 'to' and 'code'",
    });
  }

  const result = await twilioService.checkVerify(to, code);

  if (result.success && result.status === "approved") {
    return res.status(200).json({
      success: true,
      status: "approved",
      message: "Phone number verified successfully",
    });
  } else if (result.success && result.status === "pending") {
    return res.status(200).json({
      success: false,
      status: "pending",
      message: "Code is incorrect or expired",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.error,
    });
  }
};
