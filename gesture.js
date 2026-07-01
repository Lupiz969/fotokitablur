// ======================================
// Vintage AI Camera
// Gesture Detection (No Landmark Drawing)
// ======================================

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

// ======================================
// Konfigurasi MediaPipe
// ======================================

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

    // Bersihkan canvas (jika masih ada)
    if (typeof ctx !== "undefined" && typeof canvas !== "undefined") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Tidak ada tangan
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {

        if (blurEnabled) {
            disableBlur();
            blurEnabled = false;
        }

        return;
    }

    const landmarks = results.multiHandLandmarks[0];

    // ================================
    // TIDAK ADA drawConnectors()
    // TIDAK ADA drawLandmarks()
    // ================================

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
// Peace Gesture Detection
// ======================================

function isPeaceGesture(lm) {

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
