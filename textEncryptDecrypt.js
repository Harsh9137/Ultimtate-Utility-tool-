function initTextEncryptDecrypt() {
  const textInput     = document.getElementById("textInput");
  const passwordInput = document.getElementById("passwordInput");
  const encryptBtn    = document.getElementById("encryptBtn");
  const decryptBtn    = document.getElementById("decryptBtn");
  const copyBtn       = document.getElementById("copyResultBtn");
  const resultText    = document.getElementById("resultText");

  if (!textInput || !passwordInput || !encryptBtn || !decryptBtn || !resultText) {
    console.warn("❌ Text Encrypt/Decrypt: Elements not found in DOM.");
    return;
  }

  encryptBtn.onclick = () => {
    const text = textInput.value.trim();
    const pwd  = passwordInput.value.trim();
    if (!text || !pwd) return alert("Enter text and password first.");
    resultText.value = CryptoJS.AES.encrypt(text, pwd).toString();
  };

  decryptBtn.onclick = () => {
    const cipher = textInput.value.trim();
    const pwd    = passwordInput.value.trim();
    if (!cipher || !pwd) return alert("Enter encrypted text and password.");
    const bytes = CryptoJS.AES.decrypt(cipher, pwd);
    const plain = bytes.toString(CryptoJS.enc.Utf8);
    if (!plain) return alert("Invalid password or text.");
    resultText.value = plain;
  };

  copyBtn.onclick = async () => {
    if (!resultText.value) return alert("Nothing to copy.");
    await navigator.clipboard.writeText(resultText.value);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy Result"), 1200);
  };
}
