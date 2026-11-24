# Telepresence Robot (WebRTC + Raspberry Pi + Arduino)

A remote-controlled robot you drive from a web browser. The operator sees the
robot's camera and sends driving commands over WebRTC. A Raspberry Pi receives
them and passes them to an Arduino that controls the motors.

Inspired by William Cooley's WebRTC telepresence robot (wtip.net).

## How it works

```
Operator browser  <-- WebRTC (PeerJS) -->  Chromium on the Pi (robot.html)
                                                   |
                                           WebSocket (localhost:8765)
                                                   |
                                          Python server (server.py)
                                                   |
                                             USB serial
                                                   |
                                                Arduino -> motor driver -> motors
```

## Setup

### 1. Install dependencies on the Pi

```bash
sudo apt update
sudo apt install python3-pip python3-serial chromium
pip3 install websockets --break-system-packages
```

### 2. Get the files

```bash
git clone <this-repo-url>
cd telepresence-robot
```

### 3. Choose your Arduino port

```bash
ls /dev/ttyACM* /dev/ttyUSB*
```

Put the name you see (for example `/dev/ttyACM0`) in `server/server.py`.
If you have no Arduino connected yet, comment out the `serial` lines in
`server.py` so the server can still run.

### 4. Upload the Arduino sketch

Open `arduino/robot_test/robot_test.ino` in the Arduino IDE, select
**Board: Arduino Uno** and the correct port, then upload. The test sketch lights
the built-in LED while commands arrive and stops after 0.5 seconds of silence.

### 5. Run it

Terminal 1:

```bash
cd server
python3 server.py
```

Terminal 2:

```bash
cd web
python3 -m http.server 8000
```

In Chromium on the Pi, open **`http://localhost:8000/robot.html`** and allow
camera access. Then open `http://localhost:8000/operator.html` in a second tab
(or from another device on the same network, using the Pi's address).

## Important notes

- **Use `localhost`, not an IP address, for `robot.html`.** Browsers only allow
  camera access on secure origins, and `0.0.0.0` or `192.168.x.x` over plain
  HTTP does not count.
- **Keep `audio: false` in `robot.html` unless a microphone is connected.**
  Requesting a missing microphone makes the whole camera request fail.
- **Change the PeerJS ID** (`my-robot-1234`) in both HTML files to a long random
  string, otherwise anyone who guesses it can drive your robot.
- The pages load PeerJS from the internet, so the Pi needs internet access.
- Connecting from a different network may need a TURN server.
