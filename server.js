const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// ログイン（仮）
app.post("/login", (req, res) => {
    const { id, password } = req.body;

    if (id === "tanaka" && password === "1234") {
        res.json({ ok: true, id });
    } else {
        res.json({ ok: false });
    }
});

// Discord送信（仮）
app.post("/send", (req, res) => {
    console.log("受信:", req.body);
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("server start:", PORT);
});