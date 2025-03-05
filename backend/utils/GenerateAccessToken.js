import jwt from 'jsonwebtoken';
import RefreshTokenModel from '../models/RefreshToken.js';

const generateAccessToken = async (user) => {
    try{
        const payload = {_id: user._id};
        const accessTokenExp = Math.floor(Date.now() / 1000) + 15 * 60;

        const accessToken = jwt.sign(
            {...payload, exp: accessTokenExp},
            process.env.ACCESS_TOKEN_SECRET
        )

        const refreshTokenExp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
        const refreshToken = jwt.sign(
            {...payload, exp: refreshTokenExp},
            process.env.REFRESH_TOKEN_SECRET
        )
        
        await RefreshTokenModel.findOneAndDelete({userId: user._id});

        await new RefreshTokenModel({
            userId: user._id,
            token: refreshToken
        }).save();

        return Promise.resolve({accessToken, refreshToken, accessTokenExp, refreshTokenExp});
    }catch(err){
        console.log(err);
        Promise.reject(err);
    }
};

export default generateAccessToken;