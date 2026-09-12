import crypto from "crypto";

export const generateTempPassword = () => {
  return crypto
    .randomBytes(8)
    .toString("base64")
    .replace(/[+/=]/g, "")
    .slice(0, 10);
};
