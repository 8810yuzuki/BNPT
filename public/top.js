let start = 0;

// シャッフル（必要なら）
users.sort(() => Math.random() - 0.5);
users.sort(() => Math.random() - 0.5);

function render() {

    const cards = document.querySelectorAll(".card");

    if (!cards.length) return;

    for (let i = 0; i < 3; i++) {

        const user = users[(start + i) % users.length];

        cards[i].innerHTML = `
            <div style="text-align:center;">
                <img src="${user.image || 'image/default.jpg'}"
                     style="width:90%; height:150px; object-fit:cover; border-radius:20px;">

                <h3>${user.name}</h3>
                <p>誕生日: ${user.birthday}</p>
                <p>趣味: ${user.hobby}</p>
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

window.addEventListener("DOMContentLoaded", render);