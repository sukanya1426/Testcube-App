import refreshAccessToken from "../utils/RefreshAccessToken.js";
import isTokenExpired from "../utils/IsTokenExpired.js";
import setTokenCookies from "../utils/SetTokenCookies.js";
const accessTokenAutoRefresh = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (accessToken || !isTokenExpired(accessToken)) {
      req.headers['authorization'] = `Bearer ${accessToken}`
    }

    if (!accessToken || isTokenExpired(accessToken)) {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new Error('Refresh token is missing');
      }

      const { newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp } = await refreshAccessToken(req, res)

      setTokenCookies(res, newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp);

      req.headers['authorization'] = `Bearer ${newAccessToken}`
    }
    next()
  } catch (error) {
    console.error('Error adding access token to header:', error.message);
    res.status(401).json({ error: 'Unauthorized', message: 'Access token is missing or invalid' });
  }
}

export default accessTokenAutoRefresh;