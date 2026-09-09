import jwt from "jsonwebtoken";

const generateAccessToken = (userId, role) => {
  return jwt.sign(
    {
      id: userId,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export { generateAccessToken };