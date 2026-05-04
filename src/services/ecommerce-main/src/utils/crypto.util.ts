import crypto from "crypto";

export const generateRandomString = (bytes = 16) => {
  return crypto.randomBytes(bytes).toString("hex");
};
