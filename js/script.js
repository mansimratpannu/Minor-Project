const ready = (fn) => document.readyState !== "loading" ? fn() : document.addEventListener("DOMContentLoaded", fn);

ready(() => {
  const loginForm = document.querySelector("[data-login-form]");
  const loginMsg = document.querySelector("[data-login-message]");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = loginForm.querySelector("[name='username']").value.trim();
      const password = loginForm.querySelector("[name='password']").value.trim();

      if (!username || !password) {
        loginMsg.textContent = "Please enter both username and password.";
        loginMsg.classList.remove("notice");
        loginMsg.style.color = "#b3261e";
        return;
      }

      loginMsg.textContent = "Login successful. Redirecting...";
      loginMsg.classList.add("notice");
      loginMsg.style.color = "";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 700);
    });
  }

  const generateBtn = document.querySelector("[data-generate-qr]");
  const qrContainer = document.getElementById("qr-output");
  if (generateBtn && qrContainer) {
    const makeQr = (text) => {
      qrContainer.innerHTML = "";
      new QRCode(qrContainer, {
        text,
        width: 200,
        height: 200,
        colorDark: "#1f1f1f",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    };

    generateBtn.addEventListener("click", () => {
      const classVal = document.getElementById("class-select").value;
      const subjectVal = document.getElementById("subject-select").value;
      const payload = `Class:${classVal} | Subject:${subjectVal} | ${new Date().toLocaleString()}`;
      makeQr(payload);
    });

    makeQr("Class:CS-101 | Subject:Web Tech | Demo QR");
  }

  const scanBtn = document.querySelector("[data-start-scan]");
  const stopBtn = document.querySelector("[data-stop-scan]");
  const scanMsg = document.querySelector("[data-scan-message]");
  if (scanBtn) {
    let html5QrCode;

    scanBtn.addEventListener("click", async () => {
      scanMsg.textContent = "Starting camera...";
      scanMsg.classList.add("notice");

      if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
      }

      try {
        const devices = await Html5Qrcode.getCameras();
        const cameraId = devices?.[0]?.id;

        await html5QrCode.start(
          cameraId,
          { fps: 10, qrbox: 250 },
          () => {
            scanMsg.textContent = "Attendance Marked Successfully – Demo Mode";
            scanMsg.classList.add("notice");
          }
        );
      } catch (err) {
        scanMsg.textContent = "Unable to access camera. Please allow permissions.";
        scanMsg.style.color = "#b3261e";
      }
    });

    if (stopBtn) {
      stopBtn.addEventListener("click", async () => {
        if (!html5QrCode) return;
        await html5QrCode.stop();
        scanMsg.textContent = "Scanner stopped.";
      });
    }
  }

  const searchInput = document.querySelector("[data-report-search]");
  if (searchInput) {
    const rows = Array.from(document.querySelectorAll("tbody tr"));
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? "" : "none";
      });
    });
  }
});
