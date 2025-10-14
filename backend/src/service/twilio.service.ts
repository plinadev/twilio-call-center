import { twilio } from "../config/twilioConfig";

export class TwilioService {
  private from: string;
  private verifyServiceSid: string;

  constructor() {
    this.from = process.env.PHONE_NUMBER!;
    this.verifyServiceSid = process.env.TWILIO_SERVICE_VERIFY_SID!;
  }

  async sendVerify(to: string, channel: string) {
    try {
      const verification = await twilio.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({
          to,
          channel,
        });

      console.log(`Verification sent to ${to} (${channel})`);
      return verification;
    } catch (error: any) {
      console.error(" Failed to send verification:", error.message);
      throw error;
    }
  }
  async checkVerify(to: string, code: string) {
    try {
      const verificationCheck = await twilio.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({
          to,
          code,
        });
      console.log(`Verification check for ${to}: ${verificationCheck.status}`);
      return verificationCheck;
    } catch (error: any) {
      console.error(" Failed to check verification:", error.message);
      throw error;
    }
  }
}
const twilioService = new TwilioService();
export default twilioService;
