import jwt from "jsonwebtoken";

// Generate access token (short-lived: 15 minutes)
export const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

// Generate refresh token (long-lived: 7 days)
export const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// Generate both tokens
export const generateTokens = (id) => {
  return {
    accessToken: generateAccessToken(id),
    refreshToken: generateRefreshToken(id),
  };
};
