require("dotenv").config({ path: "variables.env" });
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const usuario = jwt.verify(token, process.env.SECRETA);
      //   console.log(usuario);
      //   res.json({ usuario });
      req.usuario = usuario;
    } catch (err) {
      console.log(`error : ${err}`);
    }
  }
  return next();
};
