import connectDb from "../backend/config/DbConfig.js";

connectDb("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.9")

import ApkModel from "../backend/models/Apk.js";
import RunningModel from '../backend/models/Running.js';
import TestCaseModel from '../backend/models/TestCase.js';
import InputModel from '../backend/models/Input.js';


const deleteDb = async () => {
    await ApkModel.deleteMany();
    await RunningModel.deleteMany();
    await TestCaseModel.deleteMany();
    await InputModel.deleteMany();
}

await deleteDb();