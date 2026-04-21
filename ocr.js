let ocrImageFile = null;

// File input change
document.addEventListener('change', async (e) => {
    if (currentTool === 'ocr' && e.target.id === 'fileInput') {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            ocrImageFile = file;
            document.getElementById('startOcrBtn').disabled = false;
        }
    }
});

// OCR button click
document.addEventListener('click', async (e) => {
    if (e.target.id === 'startOcrBtn' && ocrImageFile) {
        e.target.disabled = true;
        e.target.textContent = 'Processing...';

        try {
            const { data: { text } } = await Tesseract.recognize(
                ocrImageFile,
                'eng',
                {
                    logger: m => console.log(m),
                    corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core.wasm.js',
                    workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
                    langPath: 'https://tessdata.projectnaptha.com/4.0.0'
                }
            );

            document.getElementById('ocrResult').value = text.trim();
            document.getElementById('ocrResultContainer').classList.remove('hidden');

        } catch (err) {
            alert('OCR failed: ' + err.message);
        } finally {
            e.target.disabled = false;
            e.target.textContent = 'Start OCR';
        }
    }

    if (e.target.id === 'copyOcrResult') {
        const resultText = document.getElementById('ocrResult');
        resultText.select();
        document.execCommand('copy');
        alert('Text copied to clipboard!');
    }
});
