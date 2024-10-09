const express = require("express");
const bodyParser = require("body-parser");
const tronRoutes = require("./routes/tronRoutes");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());

// Tron routes for blockchain interactions
app.use("/tron", tronRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
