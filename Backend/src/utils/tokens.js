// Generates a 6-digit numeric OTP
export function generateOTP() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

// Returns a Date object N minutes from now
export function expiresInMinutes(minutes) {
    return new Date(Date.now() + minutes * 60 * 1000);
}
