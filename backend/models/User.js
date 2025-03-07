import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	email: {type: String, required: true, trim: true, unique: true, lowercase: true},
	password: { type: String, required: true },
	is_verified: { type: Boolean, default: false },
	createdAt: { type: Date, required: true, default: Date.now },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;