import mongoose from "mongoose";

const ApkSchema = new mongoose.Schema({
    name: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    version: {type: String, required: true},
    apkLink: {type: String, required: true},
    packageName: {type: String, required: false},
    isFinished: {type: Boolean, required: true, default: false},
});

const ApkModel = mongoose.model("Apk", ApkSchema);

export default ApkModel;