const express = require("express");
const router = express.Router();
const archivosController = require("../controllers/archivosController");
const auth = require("./../middleware/auth");
// const multer = require("multer");
// const upload = multer({ dest: "./uploads/" });
router.post("/", auth, archivosController.subirArchivo);
// router.delete("/:id", archivosController.eliminarArchivo);
router.get(
  "/:archivo",
  archivosController.descargar,
  archivosController.eliminarArchivo
);
module.exports = router;
