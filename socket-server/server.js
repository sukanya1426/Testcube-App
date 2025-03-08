import { Server } from 'socket.io';
import { createServer } from 'node:http';
import express from 'express';
import cors from 'cors';
import { spawn } from 'node:child_process';
import connectDb from "../backend/config/DbConfig.js"
import ApkModel from "../backend/models/Apk.js"
import RunningModel from '../backend/models/Running.js';
import TestCaseModel from '../backend/models/TestCase.js';
import InputModel from '../backend/models/Input.js';
import fs from 'fs-extra';
import path from 'path';
import UserModel from '../backend/models/User.js';
import sendReportNotification from '../backend/utils/EmailNotification.js';


const app = express();

app.use(cors(
    {
        origin: '*',
        credentials: true
    }
));

app.use(express.json());

const server = createServer(app);
const io = new Server(server);
connectDb("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.9")



let currentlyRunning = false;
let droidbotProcess = null;
let apkQueue = [];

const processQueue = async () => {
    if (currentlyRunning || apkQueue.length === 0) return;

    const { apkId, userId } = apkQueue.shift();
    startDroidbot(apkId, userId);
};




const startDroidbot = async (apkId, userId) => {
    console.log("Starting droidbot for: ", apkId, userId);
    currentlyRunning = true;

    const apk = await ApkModel.findOne({_id: apkId, userId});
    if (!apk) {
        console.log("APK not found");
        currentlyRunning = false;
        processQueue();
        return;
    }

    await new RunningModel({ apkId, userId }).save();

    if (fs.existsSync("/home/saimon/TestCube/droidbot/credential.txt")) fs.unlinkSync("/home/saimon/TestCube/droidbot/credential.txt");
    fs.copyFileSync(apk.txtLink, "/home/saimon/TestCube/droidbot/credential.txt");

    droidbotProcess = spawn("bash", ["-c", `cd && droidbot -a ${apk.apkLink} -o output_dir -is_emulator`]);

    droidbotProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    droidbotProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    droidbotProcess.on("close", (code) => {
        console.log(`Droidbot process exited with code ${code}`);
        droidbotProcess = null;
    });
};

const stopDroidbot = (apkLink, email) => {
    if (droidbotProcess) {
        console.log("Stopping droidbot...");
        droidbotProcess.kill("SIGTERM");
        droidbotProcess = null;
        currentlyRunning = false;
        const folderPath = path.dirname(apkLink);
        const fileName = path.basename(apkLink);
        const sourceDir = "/home/saimon/output_dir";
        fs.moveSync(sourceDir, path.join(folderPath, "output"), { overwrite: true });
        sendReportNotification(email, fileName.substring(1));
        processQueue();
    } else {
        console.log("No droidbot process running.");
    }
};





io.on('connection', (socket) => {
    // console.log('A user connected');

    socket.on("restart", async (data) => {
        console.log("Restarting droidbot...", data.data);
        if (data.data > 3) {
            currentlyRunning = false;
            const runnings = await RunningModel.find().sort({ createdAt: -1 }).limit(1);
            const running = await runnings[0] || null;
            if (!running) return;
            await InputModel.deleteMany({ userId: running.userId, apkId: running.apkId });
            const apk = await ApkModel.findOne({ userId: running.userId, _id: running.apkId });
            const user = await UserModel.findOne({ _id: running.userId });
            stopDroidbot(apk.apkLink, user.email);
            apk.isFinished = true;
            apk.progress = 100;
            await apk.save();
            await RunningModel.deleteOne({ userId: running.userId, apkId: running.apkId });
        }else{
            const runnings = await RunningModel.find().sort({ createdAt: -1 }).limit(1);
            const running = await runnings[0] || null;
            if (!running) return;
            const apk = await ApkModel.findOne({ userId: running.userId, _id: running.apkId });
            if (!apk) return;
            apk.progress = Math.floor((data.data / 4) * 100);
            await apk.save();
        }
    })

    socket.on("input", async (data) => {
        console.log(data.data);
        try {
            const runnings = await RunningModel.find().sort({ createdAt: -1 }).limit(1);
            const running = await runnings[0] || null;
            if (!running) return;
            const input = await InputModel.find({ userId: running.userId, apkId: running.apkId, field: data.data.field, text: data.data.text });
            console.log(input);
            if (input.length > 0) return;
            const newInput = new InputModel({ userId: running.userId, apkId: running.apkId, field: data.data.field, text: data.data.text });
            await newInput.save();
        } catch (error) {
            console.trace(error);
        }
    })

    socket.on('test_case', async (data) => {
        console.log(data.data);
        const runnings = await RunningModel.find().sort({ createdAt: -1 }).limit(1);
        const running = await runnings[0] || null;
        if (!running) return;
        const inputs = await InputModel.find({ userId: running.userId, apkId: running.apkId });
        console.log(inputs);
        const testCase = new TestCaseModel({ userId: running.userId, apkId: running.apkId, verdict: data.data.verdict, response: data.data.response, inputs: inputs.map(input => input.toObject()) });
        await testCase.save();
        inputs.forEach(async (element) => {
            await InputModel.deleteOne({ _id: element._id });
        });
    });

    socket.on('package', async (data) => {
        console.log(data.data);
        const runnings = await RunningModel.find().sort({ createdAt: -1 }).limit(1);
        const running = await runnings[0] || null;
        if (!running) return;
        const apk = await ApkModel.findOne({ userId: running.userId, _id: running.apkId });
        if (!apk) return;
        apk.packageName = data.data.package_name;
        await apk.save();
    });

    socket.on("start_droidbot", async (data) => {
        console.log(data);
        console.log("Received start_droidbot event");
        apkQueue.push({ apkId: data.apkId, userId: data.userId });
        processQueue();
    });

    socket.on('disconnect', () => {
        // console.log('User disconnected');
    });
});``

server.listen(4000, () => {
    console.log('Socket.io server is running on port 4000');
});

