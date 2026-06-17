let start = 0;

window.onload = () => {
    render();
    renderUsers();
    renderGames();
};

/* ===== TOP カルーセル ===== */
function render() {
    const cards = document.getElementById("cards");
    cards.innerHTML = "";

    for (let i = 0; i < 3; i++) {
        const user = users[(start + i) % users.length];

        cards.innerHTML += `
            <div class="card">
                ${user.image ? `<img src="${user.image}">` : ""}

                <div class="card-text">
                    <h3>${user.name}</h3>
                    <p>誕生日: ${user.birthday}</p>
                    <p>趣味: ${user.hobby}</p>
                </div>
            </div>
        `;
    }
}

function next() {
    start = (start + 1) % users.length;
    render();
}

function prev() {
    start = (start - 1 + users.length) % users.length;
    render();
}

/* ===== asobi ユーザー ===== */
function renderUsers() {
    const userList = document.getElementById("userList");

    users.forEach(u => {
        userList.innerHTML += `
            <label class="user-checkbox">
                <input type="checkbox" value="${u.name}">
                ${u.name}
            </label>
        `;
    });
}

/* ===== asobi ゲーム ===== */
function renderGames() {
    const gameList = document.getElementById("gameList");

    games.forEach(g => {
        gameList.innerHTML += `
            <label class="game-checkbox">
                <input type="checkbox" value="${g.name}">
                ${g.name}
            </label>
        `;
    });
}/**
 * 
 */