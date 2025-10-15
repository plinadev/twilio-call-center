import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import { twilio } from "../config/twilioConfig";

export class TwilioService {
  private from: string;
  private verifyServiceSid: string;

  constructor() {
    this.from = process.env.PHONE_NUMBER!;
    this.verifyServiceSid = process.env.TWILIO_SERVICE_VERIFY_SID!;
  }

  async sendVerify(to: string, channel: string = "sms") {
    try {
      const verification = await twilio.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({ to, channel });

      console.log(`✅ Verification sent to ${to} via ${channel}`);
      return {
        success: true,
        status: verification.status,
        to: verification.to,
      };
    } catch (error: any) {
      console.error("❌ Failed to send verification:", error.message);
      return {
        success: false,
        error: error.message || "Failed to send verification",
      };
    }
  }

  async checkVerify(to: string, code: string) {
    try {
      const verificationCheck = await twilio.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({ to, code });

      console.log(
        `✅ Verification check for ${to}: ${verificationCheck.status}`
      );

      return {
        success: true,
        status: verificationCheck.status,
      };
    } catch (error: any) {
      console.error("❌ Failed to check verification:", error.message);
      return {
        success: false,
        error: error.message || "Verification failed",
      };
    }
  }
  async newCall(from: string, to: string) {
    try {
      console.log(`📞 Incoming call from ${from} to ${to}`);

      const twiml = new VoiceResponse();
      twiml.say(
        {
          voice: "alice",
          language: "en-US",
        },
        "Thank you for your call. Our representative will contact you shortly."
      );

      return twiml.toString();
    } catch (error: any) {
      console.error("❌ Failed to handle new call:", error.message);
      throw error;
    }
  }
  async changeCallStatus(callSid: string, callStatus: string) {
    try {
      console.log(`📞 Call ${callSid} changed status → ${callStatus}`);

      return { callSid, status: callStatus };
    } catch (error: any) {
      console.error("❌ Failed to change call status:", error.message);
      throw error;
    }
  }
}

const twilioService = new TwilioService();
export default twilioService;
