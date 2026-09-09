import crypto from "crypto";

const generateVerificationToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

const generateTokenExpiry = (minutes) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

export { generateVerificationToken, generateTokenExpiry };