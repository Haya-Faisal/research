# WebRTC Video Call Demo

1. **Tab-to-Tab** — two browser tabs on the same computer (`localhost`), no HTTPS needed.
2. **Subnet-to-Subnet** — two separate devices on the same Wi-Fi/LAN, which requires HTTPS and a self-signed certificate.

---

## How it works (quick overview)

- `server.js` is a small Node.js signaling server. It serves the webpage and relays connection-setup messages (`join`, `offer`, `answer`, `ice-candidate`) between the two browsers — it never touches the actual video.
- `public/index.html` is the actual app: it accesses your camera, creates the WebRTC connection, and displays both video feeds.
- Once the two browsers exchange enough info, they connect **directly** to each other for the video stream — the server's job is done after the handshake.

---

## Requirements

- [Node.js](https://nodejs.org/) installed (v18 or later recommended)
- npm (comes with Node.js)
- A modern browser (Chrome, Edge, Firefox)

---

## Install (both variants)

```bash
git clone <your-repo-url>
cd <repo-folder>
npm install
```

This installs `express`, `socket.io`, and (for the subnet-to-subnet variant) `selfsigned`.

---

##  1: Tab-to-Tab 

### Run

```bash
npm start
```

### Use

1. Open **two separate tabs** at:
   ```
   http://localhost:3000
   ```
2. Allow camera/mic access in both tabs.
3. You should see your own video in each tab, and after a moment, the other tab's video appears as the "remote" feed.
---

## 2: Subnet-to-Subnet 

### Step 1 — Generate a self-signed certificate (one-time setup)

```bash
node generate-cert.js
```

This creates `key.pem` and `cert.pem` in the project root. You only need to run this once — the files are reused on every subsequent `npm start`.

### Step 2 — Allow the port through your firewall

The first time you run the server, your OS may prompt "Allow this app through the firewall?" — click **Allow** for **Private networks**. If you don't get a prompt, manually allow inbound TCP traffic on port `3000`.

### Step 3 — Run the server

```bash
npm start
```

The terminal will print something like:
```
Server running! Open on any device on your subnet:
  https://192.168.1.42:3000
```

### Step 4 — Open it on both devices

On **both** devices, open:
```
https://<the-ip-printed-above>:3000
```

You'll see a **"Your connection is not private"** warning on each device — this is expected, since the certificate is self-signed rather than issued by a trusted authority. Click **Advanced → Proceed** on both devices. (You must accept this warning *before* the camera prompt will work.)

Allow camera/mic access when prompted, and the call should connect the same way as the tab-to-tab version.
