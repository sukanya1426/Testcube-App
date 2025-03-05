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



const startDroidbot = () => {
    console.log("Starting droidbot...")
    const process = spawn("bash", ["-c", "cd && droidbot -a /home/saimon/Downloads/test.apk -o output_dir"]);

    process.stdout.on("data", (data) => {
        // console.log(`stdout: ${data}`);
    });

    process.stderr.on("data", (data) => {
        // console.error(`stderr: ${data}`);
    });

    process.on("close", (code) => {
        console.log(`Process exited with code ${code}`);
    });
}





io.on('connection', (socket) => {
    // console.log('A user connected');

    socket.on("input", async (data) => {
        console.log(data.data);
        const running = await RunningModel.findOne();
        if(!running) return;
        const input = await InputModel.find({userId: running.userId, apkId: running.apkId, field: data.data.field, text: data.data.text});
        if(input.length > 0) return;
        const newInput = new InputModel({userId: running.userId, apkId: running.apkId, field: data.data.field, text: data.data.text});
        await newInput.save();
    })

    socket.on('test_case', async (data) => {
        console.log(data.data);
        const running = await RunningModel.findOne();
        if(!running) return;
        const inputs = await InputModel.find({userId: running.userId, apkId: running.apkId});
        console.log(inputs);
        const testCase = new TestCaseModel({userId: running.userId, apkId: running.apkId, verdict: data.data.verdict, response: data.data.response, inputs: inputs.map(input => input.toObject())});
        await testCase.save();
        inputs.forEach(async (element) => {
            await InputModel.deleteOne({_id: element._id});
        });
    });

    socket.on('package', async (data) => {
        console.log(data.data);
        const running = await RunningModel.findOne();
        if(!running) return;
        const apk = await ApkModel.findOne({userId: running.userId, _id: running.apkId});
        if(!apk) return;
        apk.packageName = data.data.package_name;
        await apk.save();
    });

    socket.on("start_droidbot", async (data) => {
        console.log(data);
        if (!currentlyRunning) {
            await new RunningModel({userId: data.userId, apkId: data.apkId}).save();
            currentlyRunning = true;
            // socket.disconnect();
            startDroidbot();
        }else {
            console.log("Droidbot is already running");
        }
    });

    socket.on('disconnect', () => {
        // console.log('User disconnected');
    });
});

server.listen(4000, () => {
    console.log('Socket.io server is running on port 4000');
});