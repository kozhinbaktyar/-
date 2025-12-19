const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbysGtWgBc_df30UpZLLoqBkYCC4eTqjgR5YrySSwkC-v6HmhG6uE-0YiFuyax1x84af/exec";

let currentUserId = null;
let lastMessageCount = 0;
let soundUnlocked = false;

// unlock sound for mobile
function unlockSound(){
if(soundUnlocked) return;
const audio = document.getElementById("notificationSound");
audio.volume = 0;
audio.play().then(()=>{
audio.pause();
audio.currentTime = 0;
audio.volume = 1;
soundUnlocked = true;
}).catch(()=>{});
}

document.addEventListener("click", unlockSound, {once:true});
document.addEventListener("touchstart", unlockSound, {once:true});

window.onload = () => {
const savedId = localStorage.getItem("userId");
if(savedId){
currentUserId = savedId;
autoLogin();
}
};

function login(){
const id = document.getElementById("userIdInput").value.trim();
if(!id) return;
localStorage.setItem("userId", id);
currentUserId = id;
loadMessages();
}

function autoLogin(){
document.getElementById("loginBox").classList.add("hidden");
document.getElementById("chatContainer").classList.add("show");
loadMessages();
}

async function loadMessages(){
try{
const res = await fetch(SCRIPT_URL);
const data = await res.json();
const msgs = data.filter(m => m.id === currentUserId);

if(msgs.length === 0){
document.getElementById("error").style.display="block";
return;
}

document.getElementById("loginBox").classList.add("hidden");
document.getElementById("chatContainer").classList.add("show");
document.getElementById("userInfo").innerText = "ID: " + currentUserId;

if(lastMessageCount && msgs.length > lastMessageCount && soundUnlocked){
document.getElementById("notificationSound").play().catch(()=>{});
}

lastMessageCount = msgs.length;
displayMessages(msgs);

}catch(err){
console.log(err);
}
}

function displayMessages(msgs){
const box = document.getElementById("messagesArea");
box.innerHTML="";
msgs.forEach(m=>{
const d = document.createElement("div");
d.className="message";
d.innerText = m.message;
box.appendChild(d);
});
box.scrollTop = box.scrollHeight;
}

function refreshMessages(){
if(currentUserId) loadMessages();
}

setInterval(()=>{
if(currentUserId) refreshMessages();
},30000);
