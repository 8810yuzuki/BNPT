console.log("TOKEN存在:", !!process.env.DISCORD_TOKEN);
require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(express.json());
app.use(express.static("public"));

/* ======================
   Discord Bot
====================== */

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

let botReady = false;

client.once("ready", () => {
    botReady = true;
    console.log("Bot起動:", client.user.tag);
});

client.login(process.env.DISCORD_TOKEN)
    .catch(err => {
        console.error("Discord login失敗:", err);
    });

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

/* ======================
   ルート
====================== */

console.log("ROOT ROUTE LOADED");

app.get("/", (req, res) => {
    console.log("ROOT HIT");
    res.sendFile(__dirname + "/public/top.html");
});

/* ======================
   提案API
====================== */

app.post("/send", async (req, res) => {

    try {

        // 💥 bot未起動ガード
        if (!client.isReady() || !botReady) {
            return res.status(503).send("bot not ready");
        }

        const data = req.body;

        let channel;
        try {
            channel = await client.channels.fetch("1509848164776022046");
        } catch (err) {
            console.error("channel fetch失敗:", err);
            return res.status(500).send("channel error");
        }

        if (!channel) {
            return res.status(500).send("channel not found");
        }

        let mentionText = "";

        if (data.mention) {
            mentionText = (data.members || [])
                .filter(m => m.discordId && m.discordId.trim() !== "")
                .map(m => `<@${m.discordId}>`)
                .join(" ");
        }

        let startText = "";

        if (data.startTime) {
            const dt = new Date(data.startTime);
            startText =
                `${dt.getMonth() + 1}/${dt.getDate()} ` +
                `${String(dt.getHours()).padStart(2, "0")}:` +
                `${String(dt.getMinutes()).padStart(2, "0")}`;
        }

        const games = [...(data.games || [])];

        if (data.other && data.other.trim() !== "") {
            games.push(data.other);
        }

        const memberNames = (data.members || [])
            .map(m => m.name)
            .join(", ");

        const proposer = "田中";

        let message = "";

        if (data.mention) {
            message =
                `${mentionText}\n\n` +
                `${proposer}さんから${games.join("、")}の誘いが届いています。\n` +
                (startText ? `提案時刻\n${startText}` : "");
        } else {
            message =
                `${proposer}さんが遊びを提案しました。\n\n` +
                `メンバー\n${memberNames}\n\n` +
                (startText ? `提案時刻\n${startText}\n\n` : "") +
                `提案内容\n${games.join("、")}`;
        }

        try {
            await channel.send(message);
            console.log("Discord送信成功");
        } catch (err) {
            console.error("send失敗:", err);
            return res.status(500).send("send failed");
        }

        return res.sendStatus(200);

    } catch (err) {
        console.error("送信失敗:", err);
        return res.sendStatus(500);
    }
});

/* ======================
   お問い合わせ
====================== */

app.post("/contact", async (req, res) => {

    try {

        if (!client.isReady()) {
            return res.status(503).send("bot not ready");
        }

        const user = await client.users.fetch("1355547299014512866");

        await user.send(`📩 お問い合わせ\n\n${req.body.message}`);

        console.log("DM送信完了");

        return res.sendStatus(200);

    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

/* ======================
   起動
====================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("APIサーバ起動:", PORT);
});