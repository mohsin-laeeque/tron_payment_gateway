const tronWeb = require("../config/tronConfig");

// Generate TRON address for user
exports.generateAddress = async () => {
  const account = await tronWeb.createAccount();
  return account;
};

// Watch USDT deposit and transfer to final address once confirmed
exports.watchDeposit = async (userAddress, userPrivateKey) => {
  tronWeb.setAddress(userAddress);

  // Polling the blockchain every 5 seconds to detect a new transaction
  setInterval(async () => {
    const transactions = await tronWeb.trx.getTransactionsRelated(userAddress, "to");

    transactions.forEach(async (tx) => {
      // Check if transaction contains value (amount greater than 0)
      if (tx.raw_data.contract[0].parameter.value.amount > 0) {
        // USDT contract address on Shasta Network
        const contractAddress = process.env.USDT_CONTRACT_ADDRESS;

        // Verify if it's a USDT transaction by comparing contract address
        if (tx.raw_data.contract[0].parameter.value.contract_address === contractAddress) {
          console.log("USDT Deposit Detected:", tx);

          // Get the amount of USDT (convert SUN to TRX equivalent)
          const amount = tx.raw_data.contract[0].parameter.value.amount;
          console.log(`Amount received: ${tronWeb.fromSun(amount)} USDT`);

          // Once the deposit is confirmed, transfer USDT to the final address
          try {
            const finalAddress = process.env.FINAL_WALLET_ADDRESS;
            // Call the function to transfer the funds to the final address
            const receipt = await exports.sendToFinalAddress(userAddress, userPrivateKey, amount, finalAddress);

            console.log("USDT Transferred to Final Address:", receipt);
          } catch (err) {
            console.error("Error while transferring USDT:", err);
          }
        }
      }
    });
  }, 5000); // Poll every 5 seconds
};

// Transfer USDT to the final address
exports.sendToFinalAddress = async (fromAddress, privateKey, amount, finalAddress) => {
  tronWeb.setPrivateKey(privateKey);

  // Create the transaction object to send TRX from the platform address to the user's address
  const tradeObj = await tronWeb.transactionBuilder.sendTrx(finalAddress, amount, fromAddress);

  // Sign the transaction using the platform's private key
  const signedTxn = await tronWeb.trx.sign(tradeObj, privateKey);

  // Broadcast the transaction to the network
  const receipt = await tronWeb.trx.sendRawTransaction(signedTxn);

  // Return the receipt of the transaction
  return receipt;
};
