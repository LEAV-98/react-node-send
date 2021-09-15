const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB conectada");
  } catch (err) {
    console.log("hubo un error");
    console.log(err);
    process.exit(1);
  }
};
module.exports = conectarDB;
