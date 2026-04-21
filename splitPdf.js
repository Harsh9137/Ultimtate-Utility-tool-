function initSplitPdfTool() {
  const pageNumberInput = document.getElementById('pageNumberInput');
  const splitBtn = document.getElementById('splitPdfBtn');

  // Enable split button when PDF selected via global Browse Files
  document.addEventListener("change", (e) => {
    if (e.target.id === "fileInput" && currentTool === "pdf-split") {
      const files = e.target.files;
      if (files.length === 1) {
        splitBtn.disabled = false;
      } else {
        splitBtn.disabled = true;
      }
    }
  });

  // Split PDF button click
  splitBtn.addEventListener('click', async () => {
    const file = document.getElementById('fileInput').files[0];
    if (!file) {
      alert("Please select a PDF file first!");
      return;
    }

    const pageNumbersInput = pageNumberInput.value.trim();
    if (!pageNumbersInput) {
      alert("Please enter page numbers (e.g. 1,3,5-7)");
      return;
    }

    try {
      const { PDFDocument } = PDFLib;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const totalPages = pdf.getPageCount();

      // Parse pages (1,3,5-7 → [0,2,4,5,6])
      let pagesToExtract = [];
      pageNumbersInput.split(",").forEach(part => {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map(n => parseInt(n.trim(), 10));
          for (let i = start; i <= end; i++) pagesToExtract.push(i - 1);
        } else {
          pagesToExtract.push(parseInt(part.trim(), 10) - 1);
        }
      });

      // Validate pages
      pagesToExtract = pagesToExtract.filter(p => p >= 0 && p < totalPages);
      if (pagesToExtract.length === 0) {
        alert("Invalid page numbers. This PDF has " + totalPages + " pages.");
        return;
      }

      // Create new PDF
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, pagesToExtract);
      copiedPages.forEach(p => newPdf.addPage(p));

      const pdfBytes = await newPdf.save();

      // Download
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "split.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      document.getElementById("splitResult").textContent = "✅ Split PDF downloaded!";
    } catch (err) {
      console.error("Error splitting PDF:", err);
      alert("Splitting failed: " + err.message);
    }
  });
}

// Initialize when tool is loaded
if (typeof initSplitPdfTool === "function") {
  initSplitPdfTool();
}
