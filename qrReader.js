let html5QrCode; 

function startQrScanner() {
    const qrReader = document.getElementById("qr-reader");
    const resultContainer = document.getElementById("qr-reader-results");

    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("qr-reader");
    }

    html5QrCode.start(
        { facingMode: "environment" }, // use back camera on phone
        {
            fps: 10,    // frames per second
            qrbox: 250  // scanning box size
        },
        (decodedText) => {
            resultContainer.innerHTML = `Scanned QR Code: <a href="${decodedText}" target="_blank" class="text-blue-500 underline">${decodedText}</a>`;
            html5QrCode.stop().then(() => {
                console.log("QR scanner stopped after success.");
            });
        },
        (errorMessage) => {
            // ignore scanning errors
        }
    ).catch(err => {
        resultContainer.innerHTML = `<p class="text-red-500">Camera access error: ${err}</p>`;
    });
}
