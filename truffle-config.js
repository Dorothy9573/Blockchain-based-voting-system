const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

const MNEMONIC = process.env.MNEMONIC;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY; // Make sure this is in your .env

module.exports = {
  networks: {
    sepolia: {
      provider: () => {
        if (!MNEMONIC) {
          throw new Error("MNEMONIC environment variable not set.");
        }
        if (!ALCHEMY_API_KEY) { // Changed this to ALCHEMY_API_KEY
          throw new Error("ALCHEMY_API_KEY environment variable not set.");
        }

        return new HDWalletProvider({
          mnemonic: {
            phrase: MNEMONIC,
          },
          providerOrUrl: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
          addressIndex: 0
        });
      },
      network_id: 11155111,
      gas: 6721975,
      gasPrice: 15000000000,
      confirmations: 2,
      timeoutBlocks: 500,
      skipDryRun: true,
      networkCheckTimeout: 12000000,
      // pollingInterval: 5000, // You can uncomment this if it helps stabilize, but often not needed.
    }
  },
  compilers: {
    solc: {
      version: "0.8.21",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  }
};