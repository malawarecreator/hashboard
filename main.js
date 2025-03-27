const { app, BrowserWindow, ipcMain } = require('electron');
const { createPublicClient, http } = require('viem');
const { mainnet } = require('viem/chains');
const { isAddress } = require('ethers');
const path = require("path");

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();
});

ipcMain.handle('fetch-wallet-data', async (event, walletAddress) => {
  console.log('Received wallet address:', walletAddress);
  try {
    if (!isAddress(walletAddress)) {
      throw new Error('Invalid Ethereum wallet address.');
    }

    const balance = await client.getBalance({ address: walletAddress });
    const transactionCount = await client.getTransactionCount({ address: walletAddress });
    const activity = [10, 20, 15, 30, 25];

    return {
      address: walletAddress,
      balance: balance.toString(),
      transactionCount,
      activity,
    };
  } catch (error) {
    console.error('Error in fetch-wallet-data:', error.message);
    return { error: error.message || 'Failed to fetch wallet data. Please check the address.' };
  }
});