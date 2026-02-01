require("dotenv").config();
const app = require("./src/app");
const connecToDb = require("./src/config/database");

connecToDb();

app.listen(3000, (req, res) => {
  console.log("server running on port 3000...");
});

