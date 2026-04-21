let cropper;

document.addEventListener("change", function (e) {
    if (currentTool === "image-cropper" && e.target.id === "fileInput") {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const content = document.getElementById("toolContent");

            // Insert preview image
            content.insertAdjacentHTML("afterbegin", `
                <div class="mb-4 flex justify-center">
                    <img id="imageToCrop" src="${event.target.result}" class="max-w-full rounded border" />
                </div>
            `);

            // Show crop button
            document.getElementById("cropBtn").classList.remove("hidden");

            // Initialize Cropper.js
            const cropImage = document.getElementById("imageToCrop");
            cropper = new Cropper(cropImage, {
                aspectRatio: NaN, // free crop
                viewMode: 1,
                autoCropArea: 1,
            });
        };
        reader.readAsDataURL(file);
    }
});

document.addEventListener("click", function (e) {
    if (currentTool === "image-cropper" && e.target.id === "cropBtn" && cropper) {
        const canvas = cropper.getCroppedCanvas({
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        });

        // Show cropped preview
        const resultImg = document.getElementById("croppedResult");
        resultImg.src = canvas.toDataURL("image/png");

        // Auto-download
        const link = document.createElement("a");
        link.download = "cropped.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }
});
