import mongoose from "mongoose";

export const inputSchema = mongoose.Schema({
    userId: {type: String, required: true},
    apkId: {type: String, required: true},
    field: {type: String, required: true},
    text: {type: String, required: true},
});

const InputModel = mongoose.model("Input", inputSchema);

export default InputModel;