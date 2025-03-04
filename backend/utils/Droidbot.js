class Droidbot{
    static runDroidbot = (userId, apkId) => {
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
}

export default Droidbot;