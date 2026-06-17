function submitData() {

    const members = [];
    const gamesArr = [];

    document.querySelectorAll('#userList input:checked')
        .forEach(cb => {

            const user = users.find(
                u => u.name === cb.value
            );

            members.push({
                name: user.name,
                discordId: user.discordId
            });
        });

    document.querySelectorAll('#gameList input:checked')
        .forEach(cb => gamesArr.push(cb.value));

    const other = document.getElementById("otherGame").value;
	
	const startTime =
	    document.getElementById("startTime").value;

    const mention =
        document.getElementById("mentionFlag").checked;
	
	const sendData = {
		    members,
		    games: gamesArr,
		    other,
		    startTime,
		    mention
		};

    fetch("/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(sendData)
    })
    .then(res => {
        if (!res.ok) throw new Error();
        alert("送信成功");
    })
    .catch(() => {
        alert("送信失敗");
    });
}