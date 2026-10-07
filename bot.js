const fs = require('fs');
const https = require('https');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { showBanner } = require('./utils/banner');

const MY_PROJECT = 'Giwaascii Waitlist';

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const RED = '\x1b[91m';
const GREEN = '\x1b[92m';
const YELLOW = '\x1b[93m';

function logGreen(msg) {
  console.log(`${GREEN}${BOLD}${msg}${RESET}`);
}

function logYellow(msg) {
  console.log(`${YELLOW}${BOLD}${msg}${RESET}`);
}

function logRed(msg) {
  console.log(`${RED}${BOLD}${msg}${RESET}`);
}

function maskProxy(proxyStr) {
  try {
    let raw = proxyStr;
    if (raw.includes('://')) {
      raw = raw.slice(raw.indexOf('://') + 3);
    }
    let hostPort;
    if (raw.includes('@')) {
      hostPort = raw.slice(raw.indexOf('@') + 1);
    } else {
      hostPort = raw;
    }
    const parts = hostPort.split(':');
    const host = parts[0];
    const port = hostPort.includes(':') ? parts[1] : '';
    const ipParts = host.split('.');
    let masked;
    if (ipParts.length === 4) {
      masked = `${ipParts[0]}*****${ipParts[3]}`;
    } else {
      masked = host.slice(0, 3) + '*****';
    }
    return `http://user:pass@${masked}:${port}`;
  } catch (e) {
    return 'http://user:pass@***:***';
  }
}

function readLines(file) {
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l);
}

function loadProxies() {
  if (!fs.existsSync('proxy.txt')) {
    return [];
  }
  return readLines('proxy.txt');
}

function getProxy(proxies, index) {
  if (!proxies.length) {
    return null;
  }
  return proxies[index % proxies.length];
}

function loadAddresses() {
  if (!fs.existsSync('address.txt')) {
    logRed('Address file not found on disk.');
    process.exit(1);
  }
  const lines = readLines('address.txt');
  if (!lines.length) {
    logRed('Address file is empty, nothing to process.');
    process.exit(1);
  }
  return lines;
}

async function submitAddress(address, proxyUrl) {
  const url = 'https://giwaascii.art/api/whitelist';
  const headers = {
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    origin: 'https://giwaascii.art',
    pragma: 'no-cache',
    priority: 'u=1, i',
    referer: 'https://giwaascii.art/',
    'sec-ch-ua': '"Chromium";v="154", "Google Chrome";v="154", "Not A(Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36',
  };
  const payload = { addr: address, hp: '' };

  const httpsAgent = proxyUrl
    ? new HttpsProxyAgent(proxyUrl, { rejectUnauthorized: false })
    : new https.Agent({ rejectUnauthorized: false });

  const resp = await axios.post(url, payload, {
    headers,
    httpsAgent,
    proxy: false,
    validateStatus: () => true,
  });

  if (resp.data === null || typeof resp.data !== 'object') {
    throw new Error('Invalid JSON response');
  }
  return resp.data;
}

async function processAccount(address, proxy, index) {
  let proxyUrl = null;
  if (proxy) {
    proxyUrl = proxy.startsWith('http') ? proxy : `http://${proxy}`;
  }

  logYellow(`Processing wallet number ${index + 1}`);
  logGreen(`Wallet address is ${address}`);
  if (proxy) {
    logGreen(`Using proxy ${maskProxy(proxy)}`);
  } else {
    logYellow('Running without proxy for this wallet');
  }

  try {
    const result = await submitAddress(address, proxyUrl);
    const ok = result.ok || false;
    if (ok) {
      logGreen(`Wallet ${address.slice(0, 6)}...${address.slice(-4)} registered successfully to whitelist`);
    } else {
      logRed(`Wallet ${address.slice(0, 6)}...${address.slice(-4)} failed to register, server returned not ok`);
    }
  } catch (e) {
    logRed(`Request failed for wallet ${address.slice(0, 6)}...${address.slice(-4)}, skipping this entry`);
  }
}

async function main() {
  showBanner(MY_PROJECT);
  const addresses = loadAddresses();
  const proxies = loadProxies();

  logGreen(`Loaded ${addresses.length} wallet addresses from file`);

  for (let idx = 0; idx < addresses.length; idx++) {
    if (idx > 0) {
      console.log();
    }
    const proxy = getProxy(proxies, idx);
    await processAccount(addresses[idx], proxy, idx);
  }
}

process.on('SIGINT', () => {
  console.log();
  logRed('Script stopped by user');
  process.exit(0);
});

main();
