const classifyMessage = (content) => {
    const text = content.toLowerCase();

    // OTP Messages
    if (
        text.includes("otp") ||
        text.includes("verification code") ||
        text.includes("one time password")
    ) {
        return "otp";
    }

    // Banking Messages
    if (
        text.includes("credited") ||
        text.includes("debited") ||
        text.includes("account") ||
        text.includes("transaction") ||
        text.includes("balance") ||
        text.includes("upi")
    ) {
        return "bank";
    }

    // Promotional Messages
    if (
        text.includes("offer") ||
        text.includes("discount") ||
        text.includes("sale") ||
        text.includes("cashback") ||
        text.includes("coupon") ||
        text.includes("deal")
    ) {
        return "offer";
    }

    // Default
    return "personal";
};

export default classifyMessage;