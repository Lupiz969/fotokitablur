// ======================================
// Cute AI Camera
// script.js
// ======================================

// Element
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const ctx = canvas.getContext("2d");

// Global (dipakai gesture.js)
window.video = video;
window.canvas = canvas;
window.ctx = ctx;

let stream = null;
let cameraRunning = false;

// ======================================
// Resize Canvas
// ======================================

function resizeCanvas() {

    if (!video.videoWidth || !video.videoHeight) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

}

// ======================================
// Start Camera
// ======================================

async function startCamera() {

    if (cameraRunning) return;

    try {

        const constraints = {

            video: {

                facingMode: {

                    ideal: "user"

                },

                width: {

                    ideal: 1280

                },

                height: {

                    ideal: 720

                }

            },

            audio: false

        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);

        video.srcObject = stream;

        await video.play();

        resizeCanvas();

        cameraRunning = true;

        window.dispatchEvent(new Event("cameraStarted"));

    }

    catch (err) {

        console.error(err);

        alert("Kamera tidak dapat diakses.");

    }

}

// ======================================
// Stop Camera
// ======================================

function stopCamera() {

    if (!stream) return;

    stream.getTracks().forEach(track => {

        track.stop();

    });

    stream = null;

    video.srcObject = null;

    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );

    cameraRunning = false;

}

// ======================================
// Blur
// ======================================

window.enableBlur = function () {

    video.classList.add("blur");

}

window.disableBlur = function () {

    video.classList.remove("blur");

}

// ======================================
// Event
// ======================================

video.addEventListener(

    "loadedmetadata",

    resizeCanvas

);

window.addEventListener(

    "resize",

    resizeCanvas

);

startBtn.addEventListener(

    "click",

    startCamera

);

stopBtn.addEventListener(

    "click",

    stopCamera

);