// excelToPdf.js (replace existing excel-pdf toolConfig with this)
toolConfigs['excel-pdf'] = {
  title: 'Excel to PDF Converter',
  showUpload: true,
  accept: '.xls,.xlsx',   // <-- fixed, include both with dots
  content: `
    <div class="text-center">
      <p class="mb-4">Upload an Excel file to convert it to PDF</p>
      <button id="convertExcelToPDF"
              class="gradient-bg text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
              disabled>
        Convert to PDF
      </button>
    </div>
  `,
  onLoad: () => {
    let excelData = [];
    const fileInputEl = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertExcelToPDF');

    if (!fileInputEl || !convertBtn) return; // safety

    // Enable Convert button after file upload
    fileInputEl.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        convertBtn.disabled = false;
      };
      reader.readAsArrayBuffer(file);
    });

    // Convert and download PDF directly, plus show "View PDF"
    let lastPdfUrl = null;
    convertBtn.addEventListener('click', () => {
      if (!excelData.length) {
        alert("Please upload an Excel file first!");
        return;
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'pt', 'a4');
      doc.autoTable({
        head: [excelData[0]],
        body: excelData.slice(1),
        startY: 20
      });

      // create blob for view and to trigger download
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // direct download
      doc.save('converted.pdf');

      // show or enable a View PDF button
      let viewBtn = document.getElementById('viewPdfBtn');
      if (!viewBtn) {
        viewBtn = document.createElement('button');
        viewBtn.id = 'viewPdfBtn';
        viewBtn.className = 'ml-4 gradient-bg text-white px-4 py-2 rounded-lg font-semibold';
        viewBtn.textContent = 'View PDF';
        convertBtn.insertAdjacentElement('afterend', viewBtn);
      }
      viewBtn.disabled = false;
      viewBtn.onclick = () => window.open(pdfUrl);

      // clean up previous url
      if (lastPdfUrl) URL.revokeObjectURL(lastPdfUrl);
      lastPdfUrl = pdfUrl;
    });
  }
};
