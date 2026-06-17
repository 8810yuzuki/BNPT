require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// ======================
// Discord Bot 起動
// ======================
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// ⚠️ 本番は絶対.envにする
client.login(process.env.DISCORD_TOKEN);

client.once("ready", () => {
    console.log("Bot起動:", client.user.tag);
});


console.log("ROOT ROUTE LOADED");

app.get("/", (req, res) => {
    console.log("ROOT HIT");
    res.sendFile(__dirname + "/public/top.html");
});


// ======================
// 提案API
// ======================
app.post("/send", async (req, res) => {

    try {

        const data = req.body;

        const channel = await client.channels.fetch("1509848164776022046").catch(() => null);

        if (!channel) {
            return res.status(500).send("channel not found");
        }

        await channel.send("test");

        res.sendStatus(200);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

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

        await channel.send(message);

        console.log("Discord送信成功");

        res.sendStatus(200);

    } catch (err) {
        console.error("送信失敗:", err);
        res.sendStatus(500);
    }
});


// ======================
// お問い合わせAPI
// ======================
app.post("/contact", async (req, res) => {

    try {
        const user = await client.users.fetch("1355547299014512866");

        await user.send(`📩 お問い合わせ\n\n${req.body.message}`);

        console.log("DM送信完了");

        res.sendStatus(200);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


// ======================
// 起動
// ======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("APIサーバ起動:", PORT);
});