import mongoose, { mongo } from "mongoose";

const currentSessionSchema = mongoose.Schema({
    userId: {type: String, required: true},
    apkId:  {type: String, required: true},
    createdAt: {type: Date, default: Date.now, expires: '15m'}
});

const CurrentSessionModel = mongoose.model("CurrentSession", currentSessionSchema);

export default CurrentSessionModel;