const tronService = require("../services/tronService");
const alertService = require("../services/alertService");
const { toSun } = require("../utils/tronHelper");

// Create a new TRON address for the user
exports.createAddress = async (req, res) => {
  try {
    // Step 1: Generate a new TRON address for the user
    const account = await tronService.generateAddress();

    // Step 2: Fund the new account with TRX to cover gas fees
    const gasAmount = toSun(10); // Sending 10 TRX for gas fees
    const platformAddress = process.env.FUNDWALLET_ADDRESS;
    const platformPrivateKey = process.env.FUNDWALLET_PRIVATE_KEY;

    // Send TRX to the newly created address for gas fees
    await tronService.sendToFinalAddress(platformAddress, platformPrivateKey, gasAmount, account.address.base58);

    // Step 3: Respond with the generated address and private key
    res.json({
      address: account.address.base58,
      privateKey: account.privateKey,
      message: "Address funded with TRX for gas fees",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating address" });
  }
};

// Watch for deposits on a user's address
exports.watchDeposit = async (req, res) => {
  const { userAddress, userPrivateKey } = req.body;

  try {
    tronService.watchDeposit(userAddress, (transaction) => {
      alertService.sendUserAlert(transaction);
      res.status(200).json({ message: "Deposit confirmed", transaction });
    });
  } catch (error) {
    res.status(500).json({ error: "Error watching deposit" });
  }
};
