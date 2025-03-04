
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import express from 'express';
import cors from 'cors';
import { spawn } from 'node:child_process';

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

let currentlyRunning = false;



const startDroidbot = () => {
    const process = spawn("bash", ["-c", "cd && droidbot -a /home/saimon/Downloads/test.apk -o output_dir -is_emulator"]);

    process.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    process.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    process.on("close", (code) => {
        console.log(`Process exited with code ${code}`);
    });
}





io.on('connection', (socket) => {
    console.log('A user connected');

    // socket.on('', async (data) => {
    //     console.log('Received from Python:', data);
    //     const test_case = new TestCase(data.test_case);
    //     await test_case.save();
    //     console.log(test_case);

    //     // Send response back to the client
    //     socket.emit('message_from_server', { response: 'Goodbye' });
    // });

    socket.on('package', async (data) => {
        console.log(data);
    });

    socket.on("start_droidbot", (data) => {
        console.log(data);
        if (!currentlyRunning) {
            currentlyRunning = true;
            startDroidbot();
        }else {
            console.log("Droidbot is already running");
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(4000, () => {
    console.log('Socket.io server is running on port 4000');
});