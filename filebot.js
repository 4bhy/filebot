const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events")
const input = require('input')
const sentmsg = require('./functions')
require('dotenv').config();

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = (process.env.SESSION);
const chatid = (process.env.CHAT_ID)


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

    async function eventPrint(event) {
        try {
            const message = event.message.message;
            console.log("Here is the message", message)
            if (message == "/eclipse_java@Brototype_bot") {
                await client.sendMessage(chatid, { message: "Here is the download link for Eclipse: https://www.eclipse.org/downloads/download.php?file=/oomph/epp/2023-03/R/eclipse-inst-jre-win64.exe" });
            } else if (message == "/mingw@Brototype_bot") {
                await client.sendMessage(chatid, { message: "Here is the download link for cygwin: https://cygwin.com/setup-x86_64.exe" });
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    client.addEventHandler(eventPrint, new NewMessage({ chats: [chatid] }));

    // sentmsg(client);
})();