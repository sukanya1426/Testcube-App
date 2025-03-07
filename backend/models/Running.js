import mongoose, { mongo } from "mongoose";

const runningSchema = mongoose.Schema({
    userId: {type: String, required: true},
    apkId:  {type: String, required: true},
    createdAt: {type: Date, default: Date.now, expires: '15m'}
});

const RunningModel = mongoose.model("Running", runningSchema);

export default RunningModel;