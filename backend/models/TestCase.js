import mongoose from "mongoose";
import InputModel from "./Input";

const testCaseSchema = mongoose.Schema({
    userId: {type: String, required: true},
    apkId: {type: String, required: true},
    verdict: {type: String, required: true},
    response: {type: String, required: true},
});

const TestCaseModel = mongoose.model("TestCase", testCaseSchema);

export default TestCaseModel;