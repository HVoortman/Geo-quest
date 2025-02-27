let currentIndex = 0;
const radius = 50; // Meters

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(updatePosition, showError);
    } else {
        alert("Geolocation is not supported.");
    }
}

function updatePosition(position) {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;
    const target = locations[currentIndex];

    const distance = getDistance(userLat, userLon, target.lat, target.lon);
    document.getElementById("distance").innerText = `Distance: ${Math.round(distance)}m`;

    updateArrow(userLat, userLon, target.lat, target.lon);

    if (distance < radius) {
        showQuestion(target.question);
    }
}

function updateArrow(userLat, userLon, targetLat, targetLon) {
    const angle = getBearing(userLat, userLon, targetLat, targetLon);
    document.getElementById("arrow").style.transform = `rotate(${angle}deg)`;
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth radius in meters
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

function showQuestion(question) {
    document.getElementById("question-box").style.display = "block";
    document.getElementById("question-text").innerText = question;
}

function checkAnswer() {
    const userAnswer = document.getElementById("answer-input").value.trim().toLowerCase();
    if (userAnswer === locations[currentIndex].answer.toLowerCase()) {
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

// Start tracking location
getUserLocation();
