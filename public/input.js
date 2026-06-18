const WEBHOOK_URL = "https://discordapp.com/api/webhooks/1514996766414733454/5eMU4qh_dSxKUTwWDEGh6RhOxwTigVRCu7p_6PSWIe_H-7A4DKdKgZUhwAb6X1aRyRhB";

function submitData() {

    const members = [];
    const gamesArr = [];

    document.querySelectorAll('#userList input:checked')
        .forEach(cb => {

            const user = users.find(u => u.name === cb.value);

            if (!user) return;

            members.push({
                name: user.name,
                discordId: user.discordId
            });
        });

    document.querySelectorAll('#gameList input:checked')
        .forEach(cb => gamesArr.push(cb.value));

    const other = document.getElementById("otherGame").value;
    const startTime = document.getElementById("startTime").value;
    const mention = document.getElementById("mentionFlag").checked;

    const message = buildMessage({
        members,
        games: gamesArr,
        other,
        startTime,
        mention
    });

    fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: message
        })
    })
    .then(res => {
        if (!res.ok) throw new Error();
        alert("送信成功");
    })
    .catch(err => {
        console.error(err);
        alert("送信失敗");
    });
}

function buildMessage(data) {

    let mentionText = "";

    if (data.mention) {
        mentionText = (data.members || [])
            .filter(m => m.discordId)
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

    return (
        `${mentionText ? mentionText + "\n\n" : ""}` +
        `🎮 遊びの提案\n\n` +
        `メンバー: ${memberNames}\n` +
        `内容: ${games.join("、")}\n` +
        (startText ? `日時: ${startText}` : "")
    );
}