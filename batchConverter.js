// Enable Convert button when multiple images are selected
document.addEventListener("change", function (e) {
    if (currentTool === "batch-converter" && e.target.id === "fileInput") {
        const files = e.target.files;
        const btn = document.getElementById("batchConvertBtn");
        if (files.length > 0 && btn) {
            btn.disabled = false;
        }
    }
});

// Batch convert selected images
document.addEventListener("click", function (e) {
    if (currentTool === "batch-converter" && e.target.id === "batchConvertBtn") {
        const files = document.getElementById("fileInput").files;
        const format = document.getElementById("batchFormatSelect").value;
        if (!files.length) {
            alert("Please select at least one image!");
            return;
        }

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = new Image();
                img.src = event.target.result;
                img.onload = function () {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    const link = document.createElement("a");
                    link.download = file.name.replace(/\.[^/.]+$/, "") + "." + format;
                    link.href = canvas.toDataURL("image/" + format);
                    link.click();
                };
            };
            reader.readAsDataURL(file);
        });

        document.getElementById("batchConvertResult").textContent = "✅ Conversion completed! Files downloaded.";
    }
});
