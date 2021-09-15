const multer = require("multer");
const shortid = require("shortid");
const fs = require("fs");
const Enlace = require("../models/Enlace");
exports.subirArchivo = async (req, res, next) => {
  const configuracionMulter = {
    limits: { fileSize: req.usuario ? 1024 * 1024 * 20 : 1024 * 1024 },
    storage: (fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname + "/../uploads");
      },
      filename: (req, file, cb) => {
        const extension = file.originalname.substring(
          file.originalname.lastIndexOf("."),
          file.originalname.length
        );
        cb(null, `${shortid.generate()}${extension}`);
      },
    })),
  };
  const upload = multer(configuracionMulter).single("archivo");
  upload(req, res, async (error) => {
    console.log(req.file);
    if (!error) {
      res.json({ archivo: req.file.filename });
    } else {
      console.log(error);
      return next();
    }
  });
};
exports.eliminarArchivo = async (req, res) => {
  console.log("desde eliminar archivo");
  console.log(req.archivo);
  try {
    fs.unlinkSync(__dirname + `/../uploads${req.archivo}`);
    console.log("Archivo eliminado");
  } catch (error) {
    console.log(error);
  }
};
exports.descargar = async (req, res, next) => {
  const enlace = await Enlace.findOne({ nombre: req.params.archivo });
  console.log(req.params.archivo);
  const archivoDescarga = __dirname + "/../uploads/" + req.params.archivo;
  res.download(archivoDescarga);
  const { descargas, nombre } = enlace;

  if (descargas === 1) {
    console.log("Si solo 1");
    req.archivo = nombre;
    await Enlace.findOneAndRemove(enlace.id);
    next();
  } else {
    enlace.descargas--;
    await enlace.save();
    console.log("Aun hay descargas");
  }
};
