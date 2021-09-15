const Enlace = require("../models/Enlace");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.nuevoEnlace = async (req, res, next) => {
  //   console.log("desde nuevo enlace");
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  console.log(req.body);
  const { nombre_original, password, nombre } = req.body;
  const enlace = new Enlace();
  enlace.url = shortid.generate();
  enlace.nombre = nombre;
  enlace.nombre_original = nombre_original;
  //   enlace.descargas = 1;
  //   enlace.password = password;
  console.log(enlace);
  console.log(req.usuario);
  if (req.usuario) {
    const { password, descargas } = req.body;
    if (descargas) {
      enlace.descargas = descargas;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      enlace.password = await bcrypt.hash(password, salt);
    }
    enlace.autor = req.usuario.id;
  }
  try {
    await enlace.save();
    res.json({ msg: `${enlace.url}` });
    return next();
  } catch (err) {
    console.log(err);
  }
};

exports.obtenerEnlace = async (req, res, next) => {
  console.log(req.params.url);
  const enlace = await Enlace.findOne({ url: req.params.url });
  console.log(enlace);
  if (!enlace) {
    res.status(404).json({ msg: "Ese enlace no existe" });
    return next();
  }
  res.json({ archivo: enlace.nombre, password: false });
  next();
  // return;
  // const { descargas, nombre } = enlace;

  // if (descargas === 1) {
  //   console.log("Si solo 1");
  //   req.archivo = nombre;
  //   await Enlace.findOneAndRemove(req.params.url);
  //   next();
  // } else {
  //   enlace.descargas--;
  //   await enlace.save();
  //   console.log("Aun hay descargas");
  // }
};
exports.todosEnlaces = async (req, res) => {
  try {
    const enlaces = await Enlace.find({}).select("url -_id");
    res.json({ enlaces });
  } catch (err) {
    console.log(err);
  }
};
exports.tienePassword = async (req, res, next) => {
  console.log(req.params.url);
  const enlace = await Enlace.findOne({ url: req.params.url });
  console.log(enlace);
  if (!enlace) {
    res.status(404).json({ msg: "Ese enlace no existe" });
    return next();
  }
  if (enlace.password) {
    return res.json({
      password: true,
      enlace: enlace.url,
      archivo: enlace.nombre,
    });
  }
  next();
};
exports.verificarPassword = async (req, res, next) => {
  const { url } = req.params;
  const { password } = req.body;
  console.log(req.body);
  const enlace = await Enlace.findOne({ url });
  if (bcrypt.compareSync(password, enlace.password)) {
    next();
  } else {
    return res.status(401).json({ msg: "Password incorrecto" });
  }
};
