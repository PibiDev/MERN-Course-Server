const jwt = require("../utils/jwt");

function asureAuth(req, res, next) {
  if (!req.headers.authorization) {
    res.status(403).send({ msg: "No tiene el token en el header" });
  }

  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    const playload = jwt.decoded(token);

    const { exp } = playload;
    const currentDate = new Date().getTime();

    if (exp <= currentDate) {
      return res.status(400).send({ msg: "Token caducado" });
    }

    req.user = playload;
    next();
  } catch (error) {
    return res.status(400).send({ msg: "Token invalido" });
  }
}

module.exports = {
  asureAuth,
};
