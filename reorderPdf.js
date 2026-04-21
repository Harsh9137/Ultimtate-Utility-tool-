// PDF Page Reorder Script

// Enable reorder button when a file is selected
document.addEventListener("change", function (e) {
    if (e.target.id === "fileInput" && window.currentTool === "pdf-reorder") {
        const files = e.target.files;
        const btn = document.getElementById("reorderPdfBtn");
        if (files.length === 1 && btn) {
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
    }
});

// Handle reorder action
document.addEventListener("click", async function (e) {
    if (e.target.id === "reorderPdfBtn") {
        const file = document.getElementById("fileInput").files[0];
        const orderInput = document.getElementById("reorderPagesInput").value.trim();

        if (!file) {
            alert("Please select a PDF file first!");
            return;
        }
        if (!orderInput) {
            alert("Please enter a new page order (e.g. 3,1,2)");
            return;
        }

        try {
            const { PDFDocument } = PDFLib;
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const totalPages = pdfDoc.getPageCount();

            // Parse input order
            let newOrder = orderInput.split(",").map(n => parseInt(n.trim(), 10) - 1);

            // Validate order
            if (newOrder.some(p => isNaN(p) || p < 0 || p >= totalPages)) {
                alert("Invalid page order. This PDF has " + totalPages + " pages.");
                return;
            }
            if (newOrder.length !== totalPages) {
                alert("You must include all " + totalPages + " pages in the order.");
                return;
            }

            // Create new reordered PDF
            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(pdfDoc, newOrder);
            copiedPages.forEach(p => newPdf.addPage(p));

            const pdfBytes = await newPdf.save();

            // Download the reordered PDF
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "reordered.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            document.getElementById("reorderResult").textContent = "✅ Reordered PDF downloaded!";
        } catch (err) {
            console.error("Error reordering PDF:", err);
            alert("Reordering failed: " + err.message);
        }
    }
});
