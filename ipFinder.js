// ipFinder.js - Real-time IP Address Finder

async function findMyIP() {
    // Show browser/network info immediately
    document.getElementById('userAgent').textContent = navigator.userAgent.substring(0, 50) + '...';
    document.getElementById('browserLang').textContent = navigator.language;
    document.getElementById('platform').textContent = navigator.platform;
    document.getElementById('screenRes').textContent = `${screen.width}×${screen.height}`;

    try {
        // Use ipinfo.io (replace 'demo' with your own token for production)
        const response = await fetch('https://ipinfo.io/json?token=demo');
        if (!response.ok) throw new Error('Failed to fetch IP info');
        const data = await response.json();

        document.getElementById('ipAddress').textContent = data.ip || '-';
        document.getElementById('ipLocation').textContent = data.city && data.region ? `${data.city}, ${data.region}` : (data.city || data.region || '-');
        document.getElementById('ipISP').textContent = data.org || '-';
        document.getElementById('ipCountry').textContent = data.country || '-';

        document.getElementById('ipResults').classList.remove('hidden');
    } catch (err) {
        document.getElementById('ipAddress').textContent = 'Unable to fetch';
        document.getElementById('ipLocation').textContent = '-';
        document.getElementById('ipISP').textContent = '-';
        document.getElementById('ipCountry').textContent = '-';
        document.getElementById('ipResults').classList.remove('hidden');
        alert('Failed to get your IP address info. Please check your internet connection or try again later.');
    }
}