const BACKEND_URL = "http://127.0.0.1:5000";


// ===============================
// ANALYZE SYMPTOMS
// ===============================

async function analyzeSymptoms() {

    const symptoms = document.getElementById("symptoms").value.trim();
    const result = document.getElementById("result");

    if (symptoms === "") {
        result.innerHTML = "⚠️ Please enter your symptoms.";
        return;
    }

    result.innerHTML = "⏳ Analyzing your symptoms...";

    try {

        const response = await fetch(`${BACKEND_URL}/analyze`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                symptoms: symptoms
            })
        });

        const data = await response.json();

        result.innerHTML = `
            <div class="hospital">
                <h3>🩺 Analysis Result</h3>
                <p><strong>Status:</strong> ${data.status}</p>
                <p><strong>Department:</strong> ${data.department}</p>
                <p>${data.message}</p>
            </div>
        `;

        loadRecommendedHospitals(data.department);

    } catch (error) {

        result.innerHTML =
            "❌ Backend connection failed. Please check whether Flask is running.";

        console.error(error);
    }
}


// ===============================
// LOAD HOSPITALS
// ===============================

async function loadHospitals() {

    const hospitalList = document.getElementById("hospitalList");

    hospitalList.innerHTML = "⏳ Loading hospitals...";

    try {

        const response = await fetch(`${BACKEND_URL}/hospitals`);
        const hospitals = await response.json();

        displayHospitals(hospitals);

    } catch (error) {

        hospitalList.innerHTML =
            "❌ Unable to load hospitals.";

        console.error(error);
    }
}


// ===============================
// DISPLAY HOSPITALS
// ===============================

function displayHospitals(hospitals) {

    const hospitalList = document.getElementById("hospitalList");

    const searchText =
        document.getElementById("hospitalSearch").value
        .toLowerCase()
        .trim();

    const filteredHospitals = hospitals.filter(hospital => {

        return (
            hospital.name.toLowerCase().includes(searchText) ||
            hospital.departments.some(dept =>
                dept.toLowerCase().includes(searchText)
            )
        );

    });

    if (filteredHospitals.length === 0) {

        hospitalList.innerHTML =
            "❌ No matching hospitals found.";

        return;
    }

    hospitalList.innerHTML = filteredHospitals.map(hospital => `

        <div class="hospital">

            <h3>🏥 ${hospital.name}</h3>

            <p>
                📍 Location: ${hospital.location}
            </p>

            <p>
                🩺 Departments:
                ${hospital.departments.join(", ")}
            </p>

            <p>
                ${hospital.emergency
                    ? "🚨 Emergency Available"
                    : "ℹ️ Regular Services"}
            </p>

            <button onclick="openMap('${hospital.location}')">
                🗺️ Navigate
            </button>

        </div>

    `).join("");
}


// ===============================
// EMERGENCY HOSPITALS
// ===============================

async function loadEmergencyHospitals() {

    const hospitalList = document.getElementById("hospitalList");

    hospitalList.innerHTML =
        "⏳ Finding emergency hospitals...";

    try {

        const response = await fetch(`${BACKEND_URL}/hospitals`);
        const hospitals = await response.json();

        const emergencyHospitals =
            hospitals.filter(hospital => hospital.emergency === true);

        displayEmergencyHospitals(emergencyHospitals);

    } catch (error) {

        hospitalList.innerHTML =
            "❌ Unable to load emergency hospitals.";

        console.error(error);
    }
}


function displayEmergencyHospitals(hospitals) {

    const hospitalList =
        document.getElementById("hospitalList");

    hospitalList.innerHTML = hospitals.map(hospital => `

        <div class="hospital">

            <h3>🚨 ${hospital.name}</h3>

            <p>📍 ${hospital.location}</p>

            <p>
                🩺 ${hospital.departments.join(", ")}
            </p>

            <button onclick="openMap('${hospital.location}')">
                🗺️ Navigate
            </button>

        </div>

    `).join("");
}


// ===============================
// RECOMMENDED HOSPITALS
// ===============================

async function loadRecommendedHospitals(department) {

    const container =
        document.getElementById("recommendedHospitalList");

    try {

        const response =
            await fetch(`${BACKEND_URL}/hospitals`);

        const hospitals = await response.json();

        const recommended = hospitals.filter(hospital =>
            hospital.departments.some(dept =>
                dept.toLowerCase().includes(
                    department.toLowerCase().split(" / ")[0]
                )
            )
        );

        if (recommended.length === 0) {

            container.innerHTML =
                "ℹ️ No specific hospital found for this department.";

            return;
        }

        container.innerHTML = recommended.map(hospital => `

            <div class="hospital">

                <h3>🏥 ${hospital.name}</h3>

                <p>📍 ${hospital.location}</p>

                <p>
                    🩺 Department:
                    ${department}
                </p>

                <button onclick="openMap('${hospital.location}')">
                    🗺️ Navigate
                </button>

            </div>

        `).join("");

    } catch (error) {

        container.innerHTML =
            "❌ Could not load recommendations.";

        console.error(error);
    }
}


// ===============================
// MAP NAVIGATION
// ===============================

function openMap(location) {

    const mapURL =
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

    window.open(mapURL, "_blank");
}

// ===============================
// 🌍 MULTILINGUAL VOICE INPUT
// ===============================

function startVoiceInput() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice input is not supported. Please use Google Chrome or Microsoft Edge.");
        return;
    }

    const recognition = new SpeechRecognition();

    // Supported languages
    const languages = [
        "en-IN", // English
        "te-IN", // Telugu
        "hi-IN", // Hindi
        "ta-IN", // Tamil
        "kn-IN", // Kannada
        "ml-IN", // Malayalam
        "mr-IN", // Marathi
        "bn-IN", // Bengali
        "gu-IN", // Gujarati
        "pa-IN", // Punjabi
        "ur-IN", // Urdu
        "es-ES", // Spanish
        "fr-FR", // French
        "de-DE", // German
        "it-IT", // Italian
        "pt-PT", // Portuguese
        "ar-SA", // Arabic
        "zh-CN", // Chinese
        "ja-JP", // Japanese
        "ko-KR"  // Korean
    ];

    /*
       Browser SpeechRecognition cannot reliably detect
       20 languages automatically in one recognition session.

       We try the browser's default language first.
       For the best multilingual version, a speech-AI API
       should be connected later.
    */

    recognition.lang = navigator.language || "en-IN";

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.start();

    console.log("🎤 CareNav AI is listening...");

    recognition.onstart = function () {

        const result =
            document.getElementById("result");

        if (result) {
            result.innerHTML =
                "🎤 Listening... Please speak your symptoms.";
        }
    };

    recognition.onresult = function (event) {

        const text =
            event.results[0][0].transcript;

        console.log("🗣️ User said:", text);

        document.getElementById("symptoms").value = text;

        // Automatically analyze the spoken symptoms
        analyzeSymptoms();
    };

    recognition.onerror = function (event) {

        console.error(
            "Voice recognition error:",
            event.error
        );

        alert(
            "❌ Voice recognition failed. Please speak again."
        );
    };

    recognition.onend = function () {

        console.log("🎤 Voice recognition ended.");
    };
}


// ===============================
// 🌍 MULTILINGUAL VOICE INPUT
// ===============================

function startVoiceInput() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice input is not supported. Please use Google Chrome or Microsoft Edge.");
        return;
    }

    const recognition = new SpeechRecognition();

    // Supported languages
    const languages = [
        "en-IN", // English
        "te-IN", // Telugu
        "hi-IN", // Hindi
        "ta-IN", // Tamil
        "kn-IN", // Kannada
        "ml-IN", // Malayalam
        "mr-IN", // Marathi
        "bn-IN", // Bengali
        "gu-IN", // Gujarati
        "pa-IN", // Punjabi
        "ur-IN", // Urdu
        "es-ES", // Spanish
        "fr-FR", // French
        "de-DE", // German
        "it-IT", // Italian
        "pt-PT", // Portuguese
        "ar-SA", // Arabic
        "zh-CN", // Chinese
        "ja-JP", // Japanese
        "ko-KR"  // Korean
    ];

    /*
       Browser SpeechRecognition cannot reliably detect
       20 languages automatically in one recognition session.

       We try the browser's default language first.
       For the best multilingual version, a speech-AI API
       should be connected later.
    */

    recognition.lang = navigator.language || "en-IN";

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.start();

    console.log("🎤 CareNav AI is listening...");

    recognition.onstart = function () {

        const result =
            document.getElementById("result");

        if (result) {
            result.innerHTML =
                "🎤 Listening... Please speak your symptoms.";
        }
    };

    recognition.onresult = function (event) {

        const text =
            event.results[0][0].transcript;

        console.log("🗣️ User said:", text);

        document.getElementById("symptoms").value = text;

        // Automatically analyze the spoken symptoms
        analyzeSymptoms();
    };

    recognition.onerror = function (event) {

        console.error(
            "Voice recognition error:",
            event.error
        );

        alert(
            "❌ Voice recognition failed. Please speak again."
        );
    };

    recognition.onend = function () {

        console.log("🎤 Voice recognition ended.");
    };
}


// ===============================
// 🔊 MULTILINGUAL TEXT TO SPEECH
// ===============================

function speakCareNavResult(language = null) {

    const result =
        document.getElementById("result");

    if (!result) {
        return;
    }

    const text =
        result.innerText ||
        result.textContent;

    if (!text.trim()) {

        alert(
            "Please analyze symptoms first."
        );

        return;
    }

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(text);

    // If language is supplied use it,
    // otherwise use browser language
    speech.lang =
        language ||
        navigator.language ||
        "en-IN";

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    const voices =
        window.speechSynthesis.getVoices();

    const matchingVoice =
        voices.find(voice =>
            voice.lang
                .toLowerCase()
                .startsWith(
                    speech.lang
                        .split("-")[0]
                        .toLowerCase()
                )
        );

    if (matchingVoice) {
        speech.voice = matchingVoice;
    }

    window.speechSynthesis.speak(speech);
}


// ===============================
// AMBULANCE REQUEST
// ===============================

function showAmbulanceBooking() {

    const booking =
        document.getElementById("ambulanceBooking");

    booking.style.display = "block";

    booking.scrollIntoView({
        behavior: "smooth"
    });
}


function requestAmbulance() {

    const name =
        document.getElementById("patientName").value.trim();

    const phone =
        document.getElementById("patientPhone").value.trim();

    const location =
        document.getElementById("pickupLocation").value.trim();

    const emergency =
        document.getElementById("emergencyType").value;

    const hospital =
        document.getElementById("destinationHospital").value.trim();

    const result =
        document.getElementById("ambulanceResult");

    if (
        name === "" ||
        phone === "" ||
        location === "" ||
        emergency === ""
    ) {

        result.innerHTML =
            "⚠️ Please fill all required ambulance details.";

        return;
    }

    result.innerHTML = `
        <div class="hospital">

            <h3>✅ Ambulance Request Submitted</h3>

            <p><strong>Patient:</strong> ${name}</p>

            <p><strong>Pickup:</strong> ${location}</p>

            <p><strong>Emergency:</strong> ${emergency}</p>

            <p><strong>Destination:</strong>
                ${hospital || "Not specified"}
            </p>

            <p>
                🚑 Please contact emergency services
                for immediate assistance.
            </p>

        </div>
    `;
}