// ---------------- PDF PASSWORD PROTECTOR ----------------
document.addEventListener("click", async function (e) {
    if (currentTool === "pdf-password" && e.target.id === "protectPdfBtn") {
        const file = document.getElementById("fileInput").files[0];
        const password = document.getElementById("passwordInput").value.trim();

        if (!file) {
            alert("Please select a PDF file first!");
            return;
        }
        if (!password) {
            alert("Please enter a password!");
            return;
        }

        try {
            const { PDFDocument } = PDFLib;

            // Load the PDF
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // 🔐 Encrypt the PDF with password
            const pdfBytes = await pdfDoc.save({
                useObjectStreams: false,
                encrypt: {
                    ownerPassword: password,
                    userPassword: password,
                    permissions: {
                        printing: 'highResolution',
                        modifying: false,
                        copying: false,
                        annotating: false,
                        fillingForms: false,
                        contentAccessibility: false,
                        documentAssembly: false,
                    }
                }
            });

            // Download
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "protected.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            document.getElementById("protectResult").textContent = "✅ PDF protected & downloaded!";
        } catch (err) {
            console.error("Error protecting PDF:", err);
            alert("Failed to protect PDF: " + err.message);
        }
    }
});
