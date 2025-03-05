import mongoose from "mongoose";
import { inputSchema } from "./Input.js";

const testCaseSchema = mongoose.Schema({
    userId: {type: String, required: true},
    apkId: {type: String, required: true},
    verdict: {type: String, required: true},
    response: {type: String, required: true},
    inputs: [inputSchema]
});

const TestCaseModel = mongoose.model("TestCase", testCaseSchema);

export default TestCaseModel;