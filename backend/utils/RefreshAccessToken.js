import UserModel from "../models/User.js";
import RefreshTokenModel from "../models/RefreshToken.js";
import generateAccessToken from "./GenerateAccessToken.js";
import verifyRefreshToken from "./VerifyRefreshToken.js";

const refreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const { tokenDetails, error } = await verifyRefreshToken(oldRefreshToken);

    if (error) {
      return res.status(401).send({ message: "Invalid refresh token" });
    }
    const user = await UserModel.findById(tokenDetails._id)

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const userRefreshToken = await RefreshTokenModel.findOne({ userId: tokenDetails._id })

    if (oldRefreshToken !== userRefreshToken.token || userRefreshToken.blacklisted) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateAccessToken(user);
    return {
      newAccessToken: accessToken,
      newRefreshToken: refreshToken,
      newAccessTokenExp: accessTokenExp,
      newRefreshTokenExp: refreshTokenExp
    };

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

export default refreshAccessToken