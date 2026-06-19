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

    const message =
        "🎮 " + proposer + "さんから遊びの提案\n\n" +
        "メンバー: " + memberNames + "\n" +
        "内容: " + games.join("、") + "\n" +
        (startText ? "日時: " + startText + "\n" : "") +
        (mentionText ? "\n" + mentionText : "");

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