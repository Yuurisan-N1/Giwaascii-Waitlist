<div align="center">

<img width="100%" alt="header" src="https://capsule-render.vercel.app/api?type=waving&height=210&text=Giwaascii%20Waitlist%20Bot&fontAlign=50&fontAlignY=36&fontSize=56&desc=Auto%20Whitelist%20%7C%20Multi-Wallet%20%7C%20Proxy%20Support&descAlign=50&descAlignY=58"/>

<img alt="typing" src="https://readme-typing-svg.demolab.com?font=Inter&size=18&duration=3000&pause=650&center=true&vCenter=true&width=900&lines=Auto+Submit+Wallet+to+Whitelist;Multi-Wallet+%7C+Sequential+Processing;Proxy+Support+%7C+One+Proxy+Per+Wallet"/>

<p>
  <img alt="javascript" src="https://img.shields.io/badge/JavaScript-Node.js%2022+-F7DF1E?logo=nodedotjs&logoColor=black"/>
  <img alt="platform" src="https://img.shields.io/badge/Platform-Giwaascii%20Waitlist-111111"/>
  <img alt="multi-wallet" src="https://img.shields.io/badge/Multi--Wallet-Supported-111111"/>
  <img alt="proxy" src="https://img.shields.io/badge/Proxy-Supported-111111"/>
  <img alt="author" src="https://img.shields.io/badge/by-Yuurisandesu-111111"/>
</p>

<p>
  <b>Giwaascii Waitlist Bot</b> is an automation bot for the Giwaascii NFT whitelist registration.<br/>
  It submits all wallet addresses in your list to the Giwaascii whitelist endpoint one by one, logging the registration result for each wallet with proxy support per wallet.<br/>
  Built and distributed by <b>Yuurisandesu</b>.
</p>

</div>

---

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Bot](#running-the-bot)
- [Features](#features)
- [File Structure](#file-structure)
- [Disclaimer](#disclaimer)

---

## Requirements

- Node.js `22+`
- Git

---

## Installation

### Install Node.js

**Windows:**

1. Go to https://nodejs.org and download the LTS installer
2. Run the installer and follow the setup wizard
3. Open Command Prompt and verify the installation:

```cmd
node -v
npm -v
```

**Linux (Ubuntu / Debian):**

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

**macOS:**

```bash
brew install node
node -v
npm -v
```

> If you do not have Homebrew, install it first from https://brew.sh

**Termux (Android):**

```bash
pkg update && pkg upgrade -y
pkg install nodejs -y
node -v
npm -v
```

---

### Clone and Install

**Clone the repository:**

```bash
git clone https://github.com/Yuurisan-N1/Giwaascii-Waitlist.git
cd Giwaascii-Waitlist
```

**Install dependencies:**

```bash
npm install
```

---

## Configuration

### 1. Wallets (address.txt)

Fill `address.txt` with one wallet address per line:

```
0xabc123...
0xdef456...
```

### 2. Proxy (proxy.txt) - Optional

Fill `proxy.txt` with proxies, one per line. Proxies are assigned to wallets by index (first proxy to first wallet, second proxy to second wallet, and so on). If the number of proxies is fewer than the number of wallets, proxies wrap around cyclically. If `proxy.txt` is missing or empty, the bot runs without a proxy.

```
http://user:pass@ip:port
http://user:pass@ip:port
```

---

## Running the Bot

```bash
node bot.js
```

Press `Ctrl+C` at any time to stop the bot cleanly.

---

## Features

### Auto Whitelist Submission
The bot loads all wallet addresses from `address.txt` and submits each one to the Giwaascii whitelist endpoint. The result of each submission is logged individually. A successful registration and a failed one are each reported with the first six and last four characters of the wallet address shown for easy identification.

### Proxy Support
Each wallet can be assigned its own proxy via `proxy.txt`. If a proxy is configured for the current wallet, it is shown in masked form before processing begins. Proxy assignment uses a round-robin fallback if there are fewer proxies than wallets.

### Multi Wallet
All wallets in `address.txt` are processed sequentially in a single run. The wallet index and address are logged at the start of each entry. A blank line separates each wallet output in the terminal for readability.

---

## File Structure

```text
Giwaascii-Waitlist/
├── bot.js          # Main bot, wallet whitelist submission
├── address.txt     # Wallet addresses, one per line
├── proxy.txt       # Proxies, one per line (optional)
├── package.json    # Node.js dependencies
├── LICENSE         # License file
└── utils/
    ├── banner.js   # Banner display on startup
```

---

## Disclaimer

This tool is built for educational and technical exploration purposes. Use it wisely and at your own responsibility.

---

<div align="center">
<img width="100%" alt="footer" src="https://capsule-render.vercel.app/api?type=waving&height=120&section=footer"/>
</div>