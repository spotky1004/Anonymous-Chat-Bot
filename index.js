const Discord = require("discord.js");
const bot = new Discord.Client();

let sesionData = {
    started: false,
    channel: null,
    /** @type {Array} */
    playerIdList: null,
    playerList: null
};

bot.on("message", async msg => {
    if (sesionData.started && msg.guild === null) {
        if (msg.author.bot) return;
        let playerNum = sesionData.playerIdList.findIndex(e => e == msg.author.id);
        const toSend = `${(playerNum+10).toString(36).toUpperCase()}: ${msg.content}`;
        sesionData.playerIdList.map((e, i) => {
            if (e === msg.author.id) return;
            sesionData.playerList[i].send(toSend)
        });
        sesionData.channel.send(toSend);
    } else if (!sesionData.started && msg.content.startsWith("startgame")) {
        let [channel, ...players] = msg.content.substr("startgame".length+1).split(" ");
        players.sort(function() { return 0.5 - Math.random() });
        const playerFetched = [];
        players.map(async e => {
            let user;
            try {
                await bot.users.fetch(e).then(u => user = u);
            } catch (e) {
                console.log(e);
                process.exit(1);
            }
            playerFetched.push(user);
            return user;
        });

        let tmpChannel;
        try {
            await bot.channels.fetch(channel).then(ch => tmpChannel = ch);
        } catch (e) {
            console.log(e);
            process.exit(1);
        }

        sesionData.channel = tmpChannel;
        sesionData.started = true;
        sesionData.playerIdList = players;
        sesionData.playerList = playerFetched;

        msg.channel.send(`Started at channel <#${channel}>\nWith players [${players.map(e => `<@${e}>`).sort(function() { return 0.5 - Math.random() }).join(", ")}]\n\`idea by _plat_ & 황금돼지부계정\``);
        sesionData.playerList.map(e => e.send("Use DM!"));
    } else if (msg.content.startsWith("stop")) {
        sesionData.channel.send(`Player List\n------------------\n${sesionData.playerIdList.map((e, i) => `${(i+10).toString(36).toUpperCase()}: <@${e}>`).join("\n")}`);

        sesionData.channel = null;
        sesionData.started = false;
        sesionData.playerIdList = null;
        sesionData.playerList = null;
    }
});

bot.on("ready", () => {
    console.log("hi!");
});

bot.login("token");