import jwt from "jsonwebtoken";
import RefreshTokenModel from "../models/RefreshToken.js";
const verifyRefreshToken = async (refreshToken) => {
  try {
    const privateKey = process.env.REFRESH_TOKEN_SECRET;
    const userRefreshToken = await RefreshTokenModel.findOne({ token: refreshToken });

    if (!userRefreshToken) {
      throw { error: true, message: "Invalid refresh token" };
    }

    const tokenDetails = jwt.verify(refreshToken, privateKey);

    return {
      tokenDetails,
      error: false,
      message: "Valid refresh token",
    };

  } catch (error) {
    throw { error: true, message: "Invalid refresh token" };
  }
}

export default verifyRefreshToken