const tronWeb = require("../config/tronConfig");
// Helper function for converting amount from TRX to SUN (if needed)
exports.toSun = (trxAmount) => {
  return tronWeb.toSun(trxAmount);
};
