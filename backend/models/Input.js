import mongoose from "mongoose";

export const inputSchema = mongoose.Schema({
    userId: {type: String, required: true},
    apkId: {type: String, required: true},
    field: {type: String, required: true},
    text: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now},
});

const InputModel = mongoose.model("Input", inputSchema);

export default InputModel;