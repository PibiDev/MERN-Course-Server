const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { use } = require("../router/user");
const image = require("../utils/image");

async function getMe(req, res) {
  const { user_id } = req.user;
  const response = await User.findById(user_id);
  if (!response) {
    res.status(400).send({ msg: "usuario no encontrado" });
  } else {
    res.status(200).send(response);
  }
}

async function getUsers(req, res) {
  const { active } = req.query;

  let response = null;

  if (active === undefined) {
    response = await User.find();
  } else {
    response = await User.find({ active });
  }

  res.status(200).send(response);
}

async function createUser(req, res) {
  const { password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const haspassword = bcrypt.hashSync(password, salt);

  const user = new User({ ...req.body, active: false, password: haspassword });

  if (req.files.avatar) {
    const imagePath = image.getFilePath(req.files.avatar);
    user.avatar = imagePath;
  }

  console.log(user);

  user
    .save()
    .then((userStore) => {
      res.status(201).send(userStore);
    })
    .catch((err) => {
      res.status(400).send({ msg: "Error al crear el usuario" });
    });
}

async function updateUser(req, res) {
  const { id } = req.params;
  const userData = req.body;

  if (userData.password) {
    const salt = bcrypt.genSaltSync(10);
    const hasPassword = bcrypt.hashSync(userData.password, salt);
    userData.password = hasPassword;
  } else {
    delete userData.password;
  }

  if (req.files.avatar) {
    const imagePath = image.getFilePath(req.files.avatar);
    userData.avatar = imagePath;
  }

  User.findByIdAndUpdate({ _id: id }, userData)
    .then((userData) => {
      res.status(200).send({ msg: "Actualizacion correcta" });
    })
    .catch((err) => {
      res.status(400).send({ msg: "Error al actualziar usuario" });
    });
}

async function deleteUser(req, res) {
  const { id } = req.params;

  User.findByIdAndDelete(id)
    .then((userData) => {
      res.status(200).send({ msg: "Eliminacion correcta" });
    })
    .catch((err) => {
      res.status(400).send({ msg: "Error al eliminar usuario" });
    });
}

module.exports = {
  getMe,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
