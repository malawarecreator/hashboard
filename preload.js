const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  fetchWalletData: (walletAddress) => ipcRenderer.invoke('fetch-wallet-data', walletAddress),
});