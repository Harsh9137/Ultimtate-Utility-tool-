// Enable GIF Create button when images selected
document.addEventListener("change", function (e) {
    if (currentTool === "gif-creator" && e.target.id === "fileInput") {
        const files = e.target.files;
        const btn = document.getElementById("createGifBtn");
        if (files.length > 1 && btn) {
            btn.disabled = false;
        } else if (btn) {
            btn.disabled = true;
        }
    }
});

// Create GIF from uploaded images
document.addEventListener("click", function (e) {
    if (currentTool === "gif-creator" && e.target.id === "createGifBtn") {
        const files = document.getElementById("fileInput").files;
        if (files.length < 2) {
            alert("Please select at least 2 images to create a GIF!");
            return;
        }

        const readerPromises = Array.from(files).map(file => fileToDataURL(file));

        Promise.all(readerPromises).then(images => {
            gifshot.createGIF(
                {
                    images: images,
                    interval: 0.3, // speed (seconds per frame)
                    gifWidth: 500,
                    gifHeight: 500,
                },
                function (obj) {
                    if (!obj.error) {
                        const gifImage = obj.image;
                        const gifPreview = document.getElementById("gifPreview");
                        gifPreview.src = gifImage;

                        const downloadBtn = document.getElementById("downloadGifBtn");
                        downloadBtn.classList.remove("hidden");

                        // Save GIF on download button click
                        downloadBtn.onclick = () => {
                            const link = document.createElement("a");
                            link.href = gifImage;
                            link.download = "created.gif";
                            link.click();
                        };
                    } else {
                        alert("Failed to create GIF. Please try again.");
                    }
                }
            );
        });
    }
});

// Helper: file -> DataURL
function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
