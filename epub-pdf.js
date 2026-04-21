let epubFileBuffer = null;

// Listen for file uploads only when currentTool is epub-pdf
document.addEventListener('change', async (e) => {
    if (currentTool === 'epub-pdf' && e.target.id === 'fileInput') {
        const file = e.target.files[0];
        if (file && file.name.toLowerCase().endsWith('.epub')) {
            epubFileBuffer = await file.arrayBuffer();
            document.getElementById('convertEpubBtn').disabled = false;
        }
    }
});

// Handle Convert button click
document.addEventListener('click', async (e) => {
    if (e.target.id === 'convertEpubBtn' && epubFileBuffer) {
        try {
            const zip = await JSZip.loadAsync(epubFileBuffer);
            const pdfDoc = await PDFLib.PDFDocument.create();

            const htmlFiles = Object.keys(zip.files)
                .filter(f => f.endsWith('.xhtml') || f.endsWith('.html'));

            for (const file of htmlFiles) {
                const text = await zip.files[file].async('string');
                const plainText = text.replace(/<[^>]+>/g, ' '); // strip HTML tags

                const page = pdfDoc.addPage();
                page.drawText(plainText.substring(0, 3000), {
                    x: 50,
                    y: page.getHeight() - 50,
                    size: 12
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'converted.pdf';
            link.click();
        } catch (err) {
            alert('Error converting ePub: ' + err.message);
        }
    }
});
