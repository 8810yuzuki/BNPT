window.addEventListener("DOMContentLoaded", () => {

    const userList = document.getElementById("userList");
    const gameList = document.getElementById("gameList");

    if (!userList || !gameList) {
        console.error("DOMが見つからない");
        return;
    }

    if (typeof users === "undefined") {
        console.error("usersが未定義（data.jsを読み込んでない）");
        return;
    }

    if (typeof games === "undefined") {
        console.error("gamesが未定義（data.jsを読み込んでない）");
        return;
    }

    // ======================
    // メンバー一覧
    // ======================
    users.forEach(user => {

        const label = document.createElement("label");
        label.className = "user-checkbox";

        label.innerHTML = `
            <input type="checkbox" value="${user.name}">
            ${user.name}
        `;

        userList.appendChild(label);
    });

    // ======================
    // ゲーム一覧
    // ======================
    games.forEach(game => {

        const label = document.createElement("label");
        label.className = "game-checkbox";

        label.innerHTML = `
            <input type="checkbox" value="${game.name}">
            ${game.name}
        `;

        gameList.appendChild(label);
    });

});