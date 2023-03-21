const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");

function register(req, res) {
  const { firstname, lastname, email, password } = req.body;
  if (!email) res.status(400).send({ msg: "Email es obligatorio" });
  if (!password) res.status(400).send({ msg: "La contraseña es obligatoria" });

  const user = new User({
    firstname,
    lastname,
    email: email,
    role: "user",
    active: false,
    password,
  });

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  user.password = hashPassword;

  user
    .save()
    .then((userStorage) => {
      res.status(200).send(userStorage);
    })
    .catch((error) => {
      res.status(400).send({ msg: "Error" });
    });
}

function login(req, res) {
  const { email, password } = req.body;

  if (!email) res.status(400).send({ msg: "Email es obligatorio" });
  if (!password) res.status(400).send({ msg: "La contraseña es obligatoria" });

  User.findOne({ email })
    .then((userStore) => {
      bcrypt.compare(password, userStore.password, (bcryptError, check) => {
        if (bcryptError) {
          res.status(500).send({ msg: "Server error" });
        } else if (!check) {
          res.status(400).send({ msg: "contraseña incorrecta" });
        } else if (!userStore.active) {
          res.status(400).send({ msg: "usuario no activo" });
        } else {
          res.status(200).send({
            access: jwt.createAccessToken(userStore),
            refresh: jwt.createRefreshToken(userStore),
          });
        }
      });
    })
    .catch((error) => {
      res.status(500).send({ msg: "Server error" });
    });
}

function refreshAccessToken(req, res) {
  const { token } = req.body;

  if (!token) {
    res.status(400).send({ msg: "token requerido" });
  }

  const { user_id } = jwt.decoded(token);

  User.findOne({ _id: user_id })
    .then((userStorage) => {
      res.status(200).send({
        accesToken: jwt.createAccessToken(userStorage),
      });
    })
    .catch((error) => {
      res.status(500).send({ msg: "Server error" });
    });
}

module.exports = {
  register,
  login,
  refreshAccessToken,
};
