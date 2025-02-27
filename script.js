// Updated script.js with Admin Panel & Game Sharing

let currentIndex = 0;
const radius = 50; // Default radius in meters
let locations = JSON.parse(localStorage.getItem("locations")) || [];

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(updatePosition, showError);
    } else {
        alert("Geolocation is not supported.");
    }
}

function updatePosition(position) {
    if (locations.length === 0) return;
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;
    const target = locations[currentIndex];

    const distance = getDistance(userLat, userLon, target.lat, target.lon);
    document.getElementById("distance").innerText = `Distance: ${Math.round(distance)}m`;
    updateArrow(userLat, userLon, target.lat, target.lon);

    if (distance < target.radius) {
        showQuestion(target);
    }
}

function updateArrow(userLat, userLon, targetLat, targetLon) {
    const angle = getBearing(userLat, userLon, targetLat, targetLon);
    document.getElementById("arrow").style.transform = `rotate(${angle}deg)`;
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function getBearing(lat1, lon1, lat2, lon2) {
    const dLon = (lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function showQuestion(target) {
    document.getElementById("question-box").style.display = "block";
    document.getElementById("question-text").innerText = target.question;
    document.getElementById("answer-input").style.display = target.options ? "none" : "block";
    document.getElementById("mcq-options").innerHTML = "";
    if (target.options) {
        target.options.forEach(option => {
            const btn = document.createElement("button");
            btn.innerText = option;
            btn.onclick = () => checkAnswer(option);
            document.getElementById("mcq-options").appendChild(btn);
        });
    }
}

function checkAnswer(userAnswer) {
    const target = locations[currentIndex];
    if (userAnswer.toLowerCase() === target.answer.toLowerCase()) {
        alert("Correct! Moving to the next location.");
        currentIndex++;
        document.getElementById("question-box").style.display = "none";
        if (currentIndex >= locations.length) {
            alert("You completed the quest!");
        }
    } else {
        alert("Wrong answer, try again!");
    }
}

function showError(error) {
    alert("Error getting location: " + error.message);
}

// Admin Panel
function showAdminPanel() {
    const password = prompt("Enter Admin Password:");
    if (password === "Rijssen123") {
        document.getElementById("admin-panel").style.display = "block";
    } else {
        alert("Incorrect Password!");
    }
}

function saveLocation() {
    const lat = parseFloat(document.getElementById("lat").value);
    const lon = parseFloat(document.getElementById("lon").value);
    const radius = parseInt(document.getElementById("radius").value);
    const question = document.getElementById("question").value;
    const answer = document.getElementById("answer").value;
    const options = document.getElementById("mcq").checked ? document.getElementById("options").value.split(",") : null;
    
    locations.push({ lat, lon, radius, question, answer, options });
    localStorage.setItem("locations", JSON.stringify(locations));
    alert("Location saved!");
}

function generateGameLink() {
    const link = `${window.location.origin}?game=${btoa(JSON.stringify(locations))}`;
    prompt("Copy this link to share your game:", link);
}

document.addEventListener("DOMContentLoaded", () => {
    getUserLocation();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("game")) {
        locations = JSON.parse(atob(urlParams.get("game")));
    }
});
