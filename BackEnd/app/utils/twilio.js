import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const fromPhone = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

// Option 1: Using Twilio Verify Service (Recommended)
export const sendOTP = async (phoneNumber) => {
  try {
    // If Service SID is provided, use Verify API
    if (serviceSid) {
      const verification = await client.verify.v2
        .services(serviceSid)
        .verifications.create({ to: phoneNumber, channel: "sms" });
      return { success: true, method: "verify", data: verification };
    } 
    
    // Fallback/Option 2: Manual SMS with generated code (must be handled in controller)
    throw new Error("TWILIO_SERVICE_SID is missing for Verify API. Use sendManualSMS instead.");
  } catch (error) {
    console.error("Twilio sendOTP error:", error);
    throw error;
  }
};

export const verifyOTP = async (phoneNumber, code) => {
  try {
    if (serviceSid) {
      const verificationCheck = await client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({ to: phoneNumber, code });
      return verificationCheck.status === "approved";
    }
    
    // If no serviceSid, verification must be handled manually in the controller using the database
    return false; 
  } catch (error) {
    console.error("Twilio verifyOTP error:", error);
    throw error;
  }
};

// Option 2: Send manual SMS (user must generate and store the code)
export const sendManualSMS = async (phoneNumber, message) => {
  try {
    if (!fromPhone) throw new Error("TWILIO_PHONE is missing.");
    
    const response = await client.messages.create({
      body: message,
      from: fromPhone,
      to: phoneNumber
    });
    return response;
  } catch (error) {
    console.error("Twilio sendManualSMS error:", error);
    throw error;
  }
};
