# Aegis Mark

Free QR maker from [Tycho Integrated](https://www.tychointegrated.com/).

Paste a link. Download a PNG. No account, no watermark, no expiry.

## Why it doesn’t expire

A lot of “free” QR sites put *their* short link in the code, then charge you later so the redirect keeps working.

This tool puts **your** URL (or text) in the QR. The PNG is just a picture of that. Keep the file and it works whether our page is up or not.

## Use it

**Online:** https://rph127665.github.io/aegis-mark/

**Offline:** download or clone this repo, open `index.html` in a browser. Nothing to install.

## Limits

- Makes a QR. Downloads PNG (preferred) or JPG.
- Does not shorten links, track scans, or host redirects.
- JPG is there if you need it. PNG scans more reliably.

Generation runs in the browser. The QR library is in `vendor/`. Your link is not sent to us to build the code. Loading the GitHub Pages site still loads a normal webpage from GitHub.

## Also from us

- [Aegis Argus](https://chromewebstore.google.com/detail/jkafdhppknlbbdeamjjamoaplkhlpbce) — free browser extension  
- [Aegis Defense Suite](https://www.tychointegrated.com/) — paid Windows toolkit  
- Contact: richard.harrison@tychointegrated.com

## License

MIT. See `LICENSE`. Bundled QR library is also MIT (`vendor/qrcode.LICENSE.txt`).

## Rebuild vendor (optional)

```bash
npm install qrcode@1.5.4 esbuild --no-save
npm run vendor
```
