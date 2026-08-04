import { jwtVerify, SignJWT } from "jose";

const issuer = "arena-api";
const audience = "arena-mobile";

export function createTokenService(secret: string) {
  const key = new TextEncoder().encode(secret);
  return {
    async issue(userId: string) {
      return new SignJWT({})
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(userId)
        .setIssuer(issuer)
        .setAudience(audience)
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(key);
    },
    async verify(token: string) {
      const { payload } = await jwtVerify(token, key, { issuer, audience });
      if (!payload.sub) throw new Error("Token has no subject");
      return payload.sub;
    },
  };
}

export type TokenService = ReturnType<typeof createTokenService>;
