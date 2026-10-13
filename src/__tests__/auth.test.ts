import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  SessionUser,
} from "@/lib/auth";

describe("Cryptographic Authentication & Token Safety", () => {
  it("hashes password with salt and successfully verifies match", async () => {
    const password = "SecureSecretPassword123!*";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.startsWith("$2")).toBe(true); // bcrypt prefix

    const isMatch = await verifyPassword(password, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await verifyPassword("WrongPassword123", hash);
    expect(isWrongMatch).toBe(false);
  });

  it("signs JWT token and successfully decodes session user", () => {
    const user: SessionUser = {
      id: "usr_9921",
      email: "spershika@finvessa.in",
      name: "Spershika Sharma",
      currency: "INR",
    };

    const token = signToken(user);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3); // JWT structure

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.id).toBe(user.id);
    expect(decoded?.email).toBe(user.email);
    expect(decoded?.name).toBe(user.name);
  });

  it("safely rejects tampered or invalid JWT tokens", () => {
    const invalidToken = "invalid.token.structure";
    const result = verifyToken(invalidToken);
    expect(result).toBeNull();
  });
});
