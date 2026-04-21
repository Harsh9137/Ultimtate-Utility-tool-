// Background Remover Logic
document.addEventListener("change", function(e) {
    if (e.target.id === "fileInput" && currentTool === "bg-remover") {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image_file", file);
        formData.append("size", "auto");

        fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: { "X-Api-Key": "pWSQa2N5FAdEHrBCZH7wbVXS" },
            body: formData
        })
        .then(res => res.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                const canvas = document.getElementById("bgRemoverCanvas");
                const ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                document.getElementById("bgRemoverWorkspace").classList.remove("hidden");
            };
            img.src = url;

            // Download button
            document.getElementById("btnDownloadBgRemoved").onclick = () => {
                const a = document.createElement("a");
                a.download = "bg-removed.png";
                a.href = url;
                a.click();
            };
        });
    }
});
