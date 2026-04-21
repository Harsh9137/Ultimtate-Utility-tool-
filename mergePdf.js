// mergePdf.js
toolConfigs['pdf-merge'] = {
  title: 'Merge PDFs',
  showUpload: true,
  accept: '.pdf',
  content: `
  <div class="text-center">
    <p class="mb-4">Upload multiple PDF files to merge into a single PDF</p>

    <br>
    <button id="mergePdfBtn"
            class="gradient-bg text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
            disabled>
      Merge PDFs
    </button>
  </div>
`,

  onLoad: () => {
    const fileInput = document.getElementById('mergePdfInput');
    const mergeBtn = document.getElementById('mergePdfBtn');

    let pdfFiles = [];

    if (!fileInput || !mergeBtn) return;

    // Enable button when at least 2 PDFs are uploaded
    fileInput.addEventListener('change', (e) => {
      pdfFiles = Array.from(e.target.files);
      mergeBtn.disabled = pdfFiles.length < 2;
    });

    mergeBtn.addEventListener('click', async () => {
      if (pdfFiles.length < 2) {
        alert("Please upload at least two PDF files to merge!");
        return;
      }

      try {
        const { PDFDocument } = PDFLib; // From pdf-lib library
        const mergedPdf = await PDFDocument.create();

        for (const file of pdfFiles) {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach(page => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();

        // Download the merged PDF
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'merged.pdf';
        link.click();
      } catch (error) {
       
      }
    });
  }
};
