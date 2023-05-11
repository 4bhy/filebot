const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require('input')


require('dotenv').config();

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = (process.env.SESSION);


const client = new TelegramClient(new StringSession(stringSession), apiId, apiHash, {
    connectionRetries: 5,
});

(async () => {
    console.log("Loading interactive example...");
    await client.start({
        phoneNumber: async () => await input.text("Please enter your number: "),
        password: async () => await input.text("Please enter your password: "),
        phoneCode: async () =>
            await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err),
    });
    console.log("You should now be connected.");





    sentmsg(client);
})();