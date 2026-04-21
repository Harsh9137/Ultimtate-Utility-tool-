// Enable "Convert to PDF" button when images selected
document.addEventListener("change", function (e) {
    if (currentTool === "image-to-pdf" && e.target.id === "fileInput") {
        const files = e.target.files;
        const btn = document.getElementById("convertImgPdfBtn");
        if (files.length > 0 && btn) {
            btn.disabled = false;
        }
    }
});

// Convert selected images into PDF
document.addEventListener("click", async function (e) {
    if (currentTool === "image-to-pdf" && e.target.id === "convertImgPdfBtn") {
        const files = document.getElementById("fileInput").files;
        if (!files.length) {
            alert("Please select at least one image!");
            return;
        }

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const imgData = await fileToDataURL(file);

                // Create an Image
                const img = new Image();
                img.src = imgData;

                await new Promise((resolve) => {
                    img.onload = function () {
                        const pageWidth = pdf.internal.pageSize.getWidth();
                        const pageHeight = pdf.internal.pageSize.getHeight();

                        let ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
                        let imgWidth = img.width * ratio;
                        let imgHeight = img.height * ratio;

                        let x = (pageWidth - imgWidth) / 2;
                        let y = (pageHeight - imgHeight) / 2;

                        pdf.addImage(img, 'PNG', x, y, imgWidth, imgHeight);

                        if (i < files.length - 1) {
                            pdf.addPage();
                        }
                        resolve();
                    };
                });
            }

            pdf.save("images.pdf");
            document.getElementById("imgPdfResult").textContent = "✅ PDF downloaded!";
        } catch (err) {
            console.error(err);
            alert("Conversion failed: " + err.message);
        }
    }
});

// Helper: convert file -> DataURL
function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
