let watermarkImage = null;

document.addEventListener("change", function (e) {
    if (currentTool === "watermark" && e.target.id === "fileInput") {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            watermarkImage = new Image();
            watermarkImage.src = event.target.result;
            watermarkImage.onload = function () {
                const canvas = document.getElementById("watermarkCanvas");
                const ctx = canvas.getContext("2d");

                canvas.width = watermarkImage.width;
                canvas.height = watermarkImage.height;
                ctx.drawImage(watermarkImage, 0, 0);
            };
        };
        reader.readAsDataURL(file);
    }
});

document.addEventListener("click", function (e) {
    if (currentTool === "watermark" && e.target.id === "applyWatermarkBtn" && watermarkImage) {
        const canvas = document.getElementById("watermarkCanvas");
        const ctx = canvas.getContext("2d");

        // redraw image
        ctx.drawImage(watermarkImage, 0, 0);

        // add watermark text
        const text = document.getElementById("watermarkText").value || "Sample Watermark";
        ctx.font = "48px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.textAlign = "center";
        ctx.fillText(text, canvas.width / 2, canvas.height - 50);
    }

    if (currentTool === "watermark" && e.target.id === "downloadWatermarkBtn") {
        const canvas = document.getElementById("watermarkCanvas");
        const link = document.createElement("a");
        link.download = "watermarked.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }
});
