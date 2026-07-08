import client from "../config/twilio.js";

const sendSms = async (phone, otp) => {
    const message = await client.messages.create({
        body: `Your Lumix OTP is ${otp}.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
    });

    return message;
};

export default sendSms;