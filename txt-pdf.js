let txtFileContent = null;

// Detect TXT upload
document.addEventListener('change', async (e) => {
    if (currentTool === 'txt-pdf' && e.target.id === 'fileInput') {
        const file = e.target.files[0];
        if (file && file.name.toLowerCase().endsWith('.txt')) {
            txtFileContent = await file.text();
            document.getElementById('convertTxtPdfBtn').disabled = false;
        }
    }
});

// Convert TXT to PDF
document.addEventListener('click', async (e) => {
    if (e.target.id === 'convertTxtPdfBtn' && txtFileContent) {
        try {
            const pdfDoc = await PDFLib.PDFDocument.create();
            const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

            let page = pdfDoc.addPage();
            const { width, height } = page.getSize();

            const fontSize = 12;
            const margin = 50;
            const maxWidth = width - margin * 2;
            const lineHeight = fontSize + 4;

            let y = height - margin;

            // Break text into words
            const words = txtFileContent.split(/\s+/);
            let line = "";

            for (let word of words) {
                const testLine = line.length ? line + " " + word : word;
                const textWidth = font.widthOfTextAtSize(testLine, fontSize);

                if (textWidth > maxWidth) {
                    // Draw current line
                    page.drawText(line, { x: margin, y, size: fontSize, font });
                    y -= lineHeight;

                    // New page if needed
                    if (y < margin) {
                        page = pdfDoc.addPage();
                        y = height - margin;
                    }

                    line = word;
                } else {
                    line = testLine;
                }
            }

            // Draw remaining text
            if (line) {
                page.drawText(line, { x: margin, y, size: fontSize, font });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'converted.pdf';
            link.click();

        } catch (err) {
            alert('Conversion failed: ' + err.message);
        }
    }
});
