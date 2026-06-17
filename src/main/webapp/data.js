const users = [
    {
        name: "田中",
        birthday: "04-26",
        hobby: "ゲーム",
        image: "image/tanaka.jpg",
        discordId: "1355547299014512866"
    },
    {
        name: "りチャ",
        birthday: "09-29",
        hobby: "佐間 龍斗",
        discordId: ""
    },
    {
        name: "ちょぱおう",
        birthday: "12-31",
        hobby: "天使さんごっこ",
        discordId: ""
    },
    {
        name: "りう",
        birthday: "03-13",
        hobby: "嵐",
        discordId: ""
    },
    {
        name: "いのがに",
        birthday: "09-17",
        hobby: "ギター",
        discordId: ""
    },
    {
        name: "はるゆき",
        birthday: "02-18",
        hobby: "コスプレ",
        image: "image/haruyuki.jpg",
        discordId: ""
    },
    {
        name: "もねちやん",
        birthday: "12-21",
        hobby: "朝の光の中で",
        image: "image/mone.jpg",
        discordId: ""
    },
    {
        name: "るにやーん",
        birthday: "07-18",
        hobby: "冷笑",
        image: "image/runya.jpg",
        discordId: ""
    }
];


const games = [
    { name: "LOL" },
    { name: "APEX" },
    { name: "Among us" },
    { name: "スプラ" },
    { name: "REPO" },
    { name: "Over Cooked" },
    { name: "MineCraft" },
    { name: "Over Watch" }
];


users.sort(() => Math.random() - 0.5);
users.sort(() => Math.random() - 0.5);
let start = 0;

function render() {
    const cards = document.querySelectorAll(".card");

    for(let i = 0; i < 3; i++) {

        const user = users[(start + i) % users.length];

		cards[i].innerHTML = `
		    <div style="
		        width:100%;
		        height:100%;
		        box-sizing:border-box;
		        text-align:center;
		    ">
			<img src="${user.image || 'image/default.jpg'}"
			     style="
			        width:90%;
			        height:150px;
			        object-fit:cover;
			        border-radius:20px;
			        display:block;
			        margin:10px auto;
			     ">

		        <div style="
		            padding:0 10px;
		            font-size:16px;
		            word-break:break-word;
		        ">
		            <h3 style="margin:5px 0;">
		                ${user.name}
		            </h3>

		            <p style="margin:5px 0;">
		                誕生日: ${user.birthday}
		            </p>

		            <p style="margin:5px 0;">
		                趣味: ${user.hobby}
		            </p>
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

window.addEventListener("DOMContentLoaded", render);