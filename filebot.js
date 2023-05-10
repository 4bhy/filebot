const fs = require('fs');
const got = require('got');
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const stream = require('stream');
const { promisify } = require('util');
const sessionFile = 'session.session';
const path = require('path');

require('dotenv').config();

const apiId = process.env.API_ID;
const apiHash = process.env.API_HASH;
const pipeline = promisify(stream.pipeline);

(async () => {
    let stringSession = "";

    if (fs.existsSync(sessionFile)) {
        stringSession = fs.readFileSync(sessionFile, "utf8");
    }

    const client = new TelegramClient(new StringSession(stringSession), apiId, apiHash, {
        connectionRetries: 5,
    });

    console.log("Loading interactive example...");
    await client.start({
        phoneNumber: async () => await input.text("Please enter your number: "),
        password: async () => await input.text("Please enter your password: "),
        phoneCode: async () =>
            await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err),
    });

    console.log("You should now be connected.");
    // Save the session string to a file if it's a new session
    if (!stringSession) {
        const newSessionString = client.session.save();
        fs.writeFileSync(sessionFile, newSessionString);
        console.log("Session string saved to", sessionFile);
    }

    const downloadFile = async (url, outputPath, onProgress) => {
        const downloadStream = got.stream(url);
        downloadStream.on('downloadProgress', onProgress);
        await pipeline(
            downloadStream,
            fs.createWriteStream(outputPath)
        );
    };

    const uploadFile = async () => {
        try {
            const fileUrl = 'https://nw7.seedr.cc/ff_get/1505192518/A.Perfect.Pairing.2022.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp4?st=amItx6lvgVwsq-dZZ_DPYQ&e=1683789391';
            const localFilePath = 'downloaded_file.mp4';

            const message = await client.sendMessage('me', { message: 'Downloading file: 0%' });

            // Download the file
            await downloadFile(fileUrl, localFilePath, async (progress) => {
                console.log(`Download progress: ${Math.round(progress.percent * 100)}%`);
                const text = `Downloading file: ${Math.round(progress.percent * 100)}%`;

                // Update the message with the download progress
                await client.editMessage('me', message, text);
            });

            console.log('File downloaded:', localFilePath);

            await client.editMessage('me', message, 'Uploading file: 0%');
            await client.sendFile('me', {
                file: localFilePath,
                forceDocument: true,
                progressCallback: async (progress) => {
                    console.log(`Upload progress: ${Math.round(progress * 100)}%`);
                    const text = `Uploading file: ${Math.round(progress * 100)}%`;

                    // Edit the message with the new progress
                    await client.editMessage('me', message, text);
                },
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    await client.sendMessage("me", { message: "Hello!" });
    uploadFile();
})();
