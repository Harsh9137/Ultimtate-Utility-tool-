// Enable "Convert to Video" when a GIF is selected
document.addEventListener("change", function (e) {
    if (currentTool === "gif-to-video" && e.target.id === "fileInput") {
        const files = e.target.files;
        const btn = document.getElementById("convertGifVideoBtn");
        if (files.length === 1 && btn) {
            btn.disabled = false;
        }
    }
});

// Convert GIF → MP4 video
document.addEventListener("click", async function (e) {
    if (currentTool === "gif-to-video" && e.target.id === "convertGifVideoBtn") {
        const file = document.getElementById("fileInput").files[0];
        if (!file) {
            alert("Please select a GIF file first!");
            return;
        }

        try {
            // Load FFmpeg
            const { createFFmpeg, fetchFile } = FFmpeg;
            const ffmpeg = createFFmpeg({ log: true });
            await ffmpeg.load();

            // Write input GIF
            ffmpeg.FS('writeFile', 'input.gif', await fetchFile(file));

            // Convert to MP4
            await ffmpeg.run('-i', 'input.gif', 'output.mp4');

            // Read the result
            const data = ffmpeg.FS('readFile', 'output.mp4');
            const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(videoBlob);

            // Show in preview
            const videoEl = document.getElementById("gifVideoResult");
            videoEl.src = url;

            // Enable download
            const downloadBtn = document.getElementById("downloadGifVideoBtn");
            downloadBtn.classList.remove("hidden");
            downloadBtn.onclick = () => {
                const a = document.createElement("a");
                a.href = url;
                a.download = "converted.mp4";
                a.click();
            };

            document.getElementById("convertGifVideoBtn").disabled = true;
        } catch (err) {
            console.error("Error converting GIF to video:", err);
            alert("Conversion failed: " + err.message);
        }
    }
});
