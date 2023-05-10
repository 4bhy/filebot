const fs = require('fs');
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input"); // npm i input
const sessionFile = 'session.session';
const path = require('path');


require('dotenv').config();


const apiId = process.env.API_ID;
const apiHash = process.env.API_HASH;


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












    const uploadfile = async () => {
        try {
            const filePath = path.resolve('https://nw7.seedr.cc/ff_get/1505192518/A.Perfect.Pairing.2022.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp4?st=amItx6lvgVwsq-dZZ_DPYQ&e=1683789391');
            const message = await client.sendMessage('me', { message: 'Uploading file: 0%' });
            await client.sendFile('me', {
                file: filePath,
                forceDocument: true,
                progressCallback: async (progress) => {
                    console.log(`Upload progress: ${Math.round(progress * 100)}%`);
                    const text = `Uploading file: ${progressPercentage}%`;

                    // Edit the message with the new progress
                    await client.editMessage('me', message, text);
                },
            });
        } catch (error) {
            console.log(error.message);
        }
    }


    await client.sendMessage("me", { message: "Hello!" });
    uploadfile();
    //   await new Promise(solve=>setTimeout(solve, 10000)); // Wait 10 seconds before sending the next message
})();