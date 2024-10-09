const TronWeb = require("tronweb");

// Configure TronWeb to use Shasta Testnet
const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io", // Shasta Network API endpoint
  privateKey: process.env.PLATFORM_PRIVATE_KEY, // Add your private key in environment variables
});

module.exports = tronWeb;
