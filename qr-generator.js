function generateQR() {
    if (typeof currentTool !== "undefined" && currentTool === "qr-generator") {
        const urlInput = document.getElementById("urlInput").value.trim();
        const qrContainer = document.getElementById("qrContainer");
        qrContainer.innerHTML = ""; // clear previous QR

        if (urlInput) {
            new QRCode(qrContainer, {
                text: urlInput,
                width: 200,
                height: 200,
            });
        } else {
            qrContainer.innerHTML = "<p class='text-red-500'>Please enter a valid URL.</p>";
        }
    }
}
