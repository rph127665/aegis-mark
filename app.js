(function () {
  const form = document.getElementById("form");
  const content = document.getElementById("content");
  const sizeInput = document.getElementById("size");
  const sizeOut = document.getElementById("sizeOut");
  const ecc = document.getElementById("ecc");
  const canvas = document.getElementById("canvas");
  const placeholder = document.getElementById("placeholder");
  const statusEl = document.getElementById("status");
  const pngBtn = document.getElementById("pngBtn");
  const jpgBtn = document.getElementById("jpgBtn");

  let ready = false;
  let lastText = "";

  function setStatus(message, kind) {
    statusEl.textContent = message || "";
    if (kind) statusEl.dataset.kind = kind;
    else delete statusEl.dataset.kind;
  }

  function setReady(isReady) {
    ready = isReady;
    pngBtn.disabled = !isReady;
    jpgBtn.disabled = !isReady;
    canvas.classList.toggle("visually-hidden", !isReady);
    canvas.classList.toggle("is-ready", isReady);
    placeholder.hidden = isReady;
  }

  sizeInput.addEventListener("input", function () {
    sizeOut.textContent = sizeInput.value + " px";
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const text = content.value.trim();
    if (!text) {
      setReady(false);
      setStatus("Paste a link or some text first.", "error");
      content.focus();
      return;
    }

    if (typeof QRCode === "undefined" || typeof QRCode.toCanvas !== "function") {
      setReady(false);
      setStatus("QR library failed to load. Check that vendor/qrcode.js is present.", "error");
      return;
    }

    const size = Number(sizeInput.value) || 512;
    setStatus("Making QR…");

    QRCode.toCanvas(
      canvas,
      text,
      {
        width: size,
        margin: 2,
        errorCorrectionLevel: ecc.value,
        color: { dark: "#000000", light: "#ffffff" },
      },
      function (err) {
        if (err) {
          setReady(false);
          setStatus(err.message || "Could not make that QR. Try shorter text.", "error");
          return;
        }
        lastText = text;
        setReady(true);
        setStatus("Ready. Download a PNG (recommended) or JPG.");
      }
    );
  });

  function download(mime, ext) {
    if (!ready) return;

    if (mime === "image/jpeg") {
      setStatus(
        "JPG downloaded. If a phone won’t scan it, use the PNG instead.",
        "warn"
      );
    } else {
      setStatus("PNG downloaded.");
    }

    const exportCanvas =
      mime === "image/jpeg" ? canvasWithWhiteBackground(canvas) : canvas;

    exportCanvas.toBlob(
      function (blob) {
        if (!blob) {
          setStatus("Download failed in this browser.", "error");
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const stamp = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = "aegis-mark-" + stamp + "." + ext;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      },
      mime,
      mime === "image/jpeg" ? 0.95 : undefined
    );
  }

  function canvasWithWhiteBackground(source) {
    const out = document.createElement("canvas");
    out.width = source.width;
    out.height = source.height;
    const ctx = out.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(source, 0, 0);
    return out;
  }

  pngBtn.addEventListener("click", function () {
    download("image/png", "png");
  });

  jpgBtn.addEventListener("click", function () {
    download("image/jpeg", "jpg");
  });

  // Rebuild if options change after a successful make
  function maybeRebuild() {
    if (!lastText || content.value.trim() !== lastText) return;
    form.requestSubmit();
  }

  sizeInput.addEventListener("change", maybeRebuild);
  ecc.addEventListener("change", maybeRebuild);
})();
