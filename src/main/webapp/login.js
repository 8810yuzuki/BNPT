
function openLogin() {
    document.getElementById("loginModal").style.display = "block";
}

function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}

// ===== ログイン情報 =====
const usersDB = {
    tanaka: "1234",
    richa: "1111",
    chopao: "2222",
    riu: "3333"
};

// ===== ログイン処理 =====
function login() {

    const id = document.getElementById("loginId").value;
    const pw = document.getElementById("loginPw").value;

    if (usersDB[id] && usersDB[id] === pw) {

        localStorage.setItem("userId", id);

        setLoginUI(id);
        closeLogin();

    } else {
        alert("ログイン失敗");
    }
}


// ===== UI切り替え =====
function setLoginUI(user) {

    const link = document.getElementById("loginLink");
    if (link) link.style.display = "none";

    const status = document.getElementById("loginStatus");
    if (status) {
        status.style.display = "inline";
        status.textContent = "ログイン中：" + user;
    }
}


// ===== 再読み込み復元 =====
window.addEventListener("DOMContentLoaded", () => {

    const user = localStorage.getItem("userId");

    if (user) {
        setLoginUI(user);
    }

});