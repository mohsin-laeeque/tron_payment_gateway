const express = require("express");
const router = express.Router();
const tronController = require("../controllers/tronController");

// generate user TRON address
router.get("/create-address", tronController.createAddress);

// watch and handle deposits
router.post("/watch-deposit", tronController.watchDeposit);

module.exports = router;
