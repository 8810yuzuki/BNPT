function openLogin() {
    document.getElementById("loginModal").style.display = "block";
}

function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}

/* ======================
   ログイン処理
====================== */

function login() {

    const id = document.getElementById("loginId").value;
    const pw = document.getElementById("loginPw").value;

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            pw: pw
        })
    })
    .then(res => {

        if (!res.ok) {
            throw new Error("login failed");
        }

        return res.json();
    })
    .then(user => {

        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);

        setLoginUI(user.name);

        closeLogin();
    })
    .catch(err => {

        console.error(err);

        alert("ログイン失敗");
    });
}

/* ======================
   UI切り替え
====================== */

function setLoginUI(userName) {

    const link = document.getElementById("loginLink");

    if (link) {
        link.style.display = "none";
    }

    const status = document.getElementById("loginStatus");

    if (status) {

        status.style.display = "inline";

        status.innerHTML =
            'ログイン中：' + userName +
            ' <a href="#" onclick="logout()" style="color:white;margin-left:10px;">[ログアウト]</a>';
    }
}

/* ======================
   ログアウト
====================== */

function logout() {

    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    location.reload();
}

/* ======================
   再読み込み復元
====================== */

window.addEventListener("DOMContentLoaded", () => {

    const userName = localStorage.getItem("userName");

    if (userName) {
        setLoginUI(userName);
    }
});