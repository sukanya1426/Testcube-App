import mongoose from "mongoose";

const verificationEmailSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    otp: {type: String, required: true},
    createdAt: {type: Date, default: Date.now, expires: '10m'}
});

const VerificationEmailModel = mongoose.model('VerificationEmail', verificationEmailSchema);

export default VerificationEmailModel;