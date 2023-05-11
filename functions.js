const sentmsg = async (client) => {
    await client.sendMessage("me", { message: "Hello!" });
}


module.exports = sentmsg;