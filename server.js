require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const SEND_WEBHOOK = process.env.SEND_WEBHOOK;
const CONTACT_WEBHOOK = process.env.CONTACT_WEBHOOK;

/* ======================
ログイン情報
====================== */

const accounts = [
{ id: "tanaka", pw: "0000", name: "田中" },
{ id: "richa", pw: "2222", name: "りチャ" },
{ id: "chopao", pw: "3333", name: "ちょぱおう" },
{ id: "riu", pw: "4444", name: "りう" },
{ id: "inogani", pw: "5555", name: "いのがに" },
{ id: "haruyuki", pw: "6666", name: "はるゆき" },
{ id: "mone", pw: "7777", name: "もねちやん" },
{ id: "runya", pw: "8888", name: "るにやーん" },
{ id: "rio", pw: "9999", name: "りお" },
{ id: "alchu", pw: "1010", name: "アル中" },
{ id: "menchu", pw: "1111", name: "めんちゅ" },
{ id: "tsubame", pw: "1212", name: "つばめくん" },
{ id: "nick", pw: "1313", name: "ニック" },
{ id: "gin", pw: "1414", name: "ぎんちゃん" },
{ id: "nemu", pw: "1515", name: "ねむ" },
{ id: "gordon", pw: "1616", name: "ゴードン・ラムゼイ" },
{ id: "sakata", pw: "1717", name: "坂田" },
{ id: "ryoryo", pw: "1818", name: "りょりょ" },
{ id: "rana", pw: "1919", name: "らな" },
{ id: "rinka", pw: "2020", name: "りんか" }
];

/* ======================
ルート
====================== */

app.get("/", (req, res) => {
res.sendFile(__dirname + "/public/top.html");
});

/* ======================
ログインAPI
====================== */

app.post("/login", (req, res) => {

const { id, pw } = req.body;

const account = accounts.find(
    a => a.id === id && a.pw === pw
);

if (!account) {
    return res.status(401).send("login failed");
}

return res.json({
    id: account.id,
    name: account.name
});

});

/* ======================
提案API
====================== */

app.post("/send", async (req, res) => {

try {

    const data = req.body;

    const mentionText = data.mention
        ? (data.members || [])
            .filter(m => m.discordId)
            .map(m => "<@" + m.discordId + ">")
            .join(" ")
        : "";

    let startText = "";

    if (data.startTime) {

        const dt = new Date(data.startTime);

        startText =
            (dt.getMonth() + 1) + "/" +
            dt.getDate() + " " +
            String(dt.getHours()).padStart(2, "0") + ":" +
            String(dt.getMinutes()).padStart(2, "0");
    }

    const games = [...(data.games || [])];

    if (data.other && data.other.trim()) {
        games.push(data.other);
    }

    const memberNames = (data.members || [])
        .map(m => m.name)
        .join("、");

    const proposer =
        data.proposer || "誰か";

    let message = "";

    if (data.mention) {

        message =
            mentionText + "\n\n" +
            proposer + "さんが提案しました。\n\n" +
            "内容：" + games.join("、") + "\n" +
            (startText ? "日時：" + startText + "\n" : "");

    } else {

        message =
            proposer + "さんが提案しました。\n\n" +
            "メンバー：" + memberNames + "\n" +
            "内容：" + games.join("、") + "\n" +
            (startText ? "日時：" + startText + "\n" : "");

    }

    const result = await fetch(SEND_WEBHOOK, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: message
        })
    });

    if (!result.ok) {

        console.error(
            "Webhook送信失敗:",
            await result.text()
        );

        return res.status(500).send("send failed");
    }

    console.log("提案送信成功");

    return res.sendStatus(200);

} catch (err) {

    console.error(err);

    return res.sendStatus(500);
}

});

/* ======================
お問い合わせ
====================== */

app.post("/contact", async (req, res) => {

try {

    const message = req.body.message;

    const result = await fetch(CONTACT_WEBHOOK, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content:
                "📩 お問い合わせ\n\n" + message
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
