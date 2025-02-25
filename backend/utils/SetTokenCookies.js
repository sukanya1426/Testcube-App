const setTokenCookies = (res, accessToken, refreshToken, newAccessTokenExp, newRefreshTokenExp) => {
    const accessTokenMaxAge = (newAccessTokenExp - Math.floor(Date.now() / 1000)) * 1000;
    const refreshTokenMaxAge = (newRefreshTokenExp - Math.floor(Date.now() / 1000)) * 1000;

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: accessTokenMaxAge,
        secure: true
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: refreshTokenMaxAge,
        secure: true
    });

    res.cookie('is_authenticated', true, {
        maxAge: refreshTokenMaxAge,
        secure: false,
        httpOnly: false
    });
};

export default setTokenCookies;