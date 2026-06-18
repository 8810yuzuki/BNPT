require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const WEBHOOK_URL = process.env.WEBHOOK_URL;

/* ======================
   ルート
====================== */

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/top.html");
});

/* ======================
   提案API（Webhook送信）
====================== */

app.post("/send", async (req, res) => {

    try {

        const data = req.body;

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
            .join("、");

        const message = data.mention
            ? `${mentionText}\n\n🎮 遊びの提案\n${data.mention ? "メンションあり\n" : ""}メンバー: ${memberNames}\n内容: ${games.join("、")}\n${startText ? `日時: ${startText}` : ""}`
            : `🎮 遊びの提案\n\nメンバー: ${memberNames}\n内容: ${games.join("、")}\n${startText ? `日時: ${startText}\n\n` : ""}`;

        const result = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: message
            })
        });

        if (!result.ok) {
            console.error("Webhook失敗:", await result.text());
            return res.status(500).send("webhook failed");
        }

        console.log("送信成功");

        return res.sendStatus(200);

    } catch (err) {
        console.error("送信失敗:", err);
        return res.sendStatus(500);
    }
});

/* ======================
   お問い合わせ（そのままWebhook化も可）
====================== */

app.post("/contact", async (req, res) => {

    try {

        const result = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: `📩 お問い合わせ\n\n${req.body.message}`
            })
        });

        if (!result.ok) {
            return res.status(500).send("contact failed");
        }

        console.log("問い合わせ送信成功");

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
    console.log("API起動:", PORT);
});