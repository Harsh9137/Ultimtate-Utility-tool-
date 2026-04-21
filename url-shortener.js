async function shortenURL() {
    if (currentTool === "url-shortener") {
        const longUrl = document.getElementById("longUrlInput").value.trim();
        const resultBox = document.getElementById("shortUrlResult");
        resultBox.innerHTML = "";

        if (!longUrl) {
            resultBox.innerHTML = "<p class='text-red-500'>Please enter a valid URL.</p>";
            return;
        }

        try {
            // Using TinyURL API (no API key required)
            const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
            const shortUrl = await response.text();

            resultBox.innerHTML = `
                <p class="text-green-500">Shortened URL:</p>
                <a href="${shortUrl}" target="_blank" class="text-blue-500 underline">${shortUrl}</a>
            `;
        } catch (error) {
            resultBox.innerHTML = "<p class='text-red-500'>Error shortening URL. Please try again.</p>";
        }
    }
}
