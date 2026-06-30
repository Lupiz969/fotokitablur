// ======================================
// Cute AI Camera
// Gesture Detection
// ======================================

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

// Konfigurasi MediaPipe
hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.75,
    minTrackingConfidence: 0.75
});

let camera = null;
let blurEnabled = false;

// ======================================
// Hasil Deteksi
// ======================================

hands.onResults(onResults);

function onResults(results) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {

        disableBlur();

        blurEnabled = false;

        return;

    }

    const landmarks = results.multiHandLandmarks[0];

    // Gambar garis tangan
    drawConnectors(
        ctx,
        landmarks,
        HAND_CONNECTIONS,
        {
            color: "#6EC6FF",
            lineWidth: 4
        }
    );

    // Gambar titik tangan
    drawLandmarks(
        ctx,
        landmarks,
        {
            color: "#FF4F9A",
            radius: 5
        }
    );

    // Cek gesture Peace
    if (isPeaceGesture(landmarks)) {

        if (!blurEnabled) {

            enableBlur();
            blurEnabled = true;

        }

    } else {

        if (blurEnabled) {

            disableBlur();
            blurEnabled = false;

        }

    }

}

// ======================================
// Peace Detection
// ======================================

function isPeaceGesture(lm) {

    const thumbFold =
        lm[4].x < lm[3].x;

    const indexUp =
        lm[8].y < lm[6].y;

    const middleUp =
        lm[12].y < lm[10].y;

    const ringDown =
        lm[16].y > lm[14].y;

    const pinkyDown =
        lm[20].y > lm[18].y;

    return (
        indexUp &&
        middleUp &&
        ringDown &&
        pinkyDown
    );

}

// ======================================
// Jalankan AI setelah kamera aktif
// ======================================

window.addEventListener("cameraStarted", () => {

    if (camera) {

        camera.stop();

    }

    camera = new Camera(video, {

        onFrame: async () => {

            await hands.send({
                image: video
            });

        },

        width: 1280,
        height: 720

    });

    camera.start();

});