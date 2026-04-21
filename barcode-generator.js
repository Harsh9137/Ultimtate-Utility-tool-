function generateBarcode() {
    if (typeof currentTool !== "undefined" && currentTool === "barcode-generator") {
        const input = document.getElementById("barcodeInput").value.trim();
        const barcodeElement = document.getElementById("barcode");

        // clear old barcode
        barcodeElement.innerHTML = "";

        if (input) {
            JsBarcode("#barcode", input, {
                format: "CODE128",
                lineColor: "#000",
                width: 2,
                height: 100,
                displayValue: false // 👈 hides the text under barcode
            });
        } else {
            barcodeElement.innerHTML = "<text x='10' y='20' fill='red'>Enter valid text</text>";
        }
    }
}
