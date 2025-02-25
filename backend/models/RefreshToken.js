import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    blacklisted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: '7d' },
});

const RefreshTokenModel = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshTokenModel;