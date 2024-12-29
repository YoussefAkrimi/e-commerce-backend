const jwt = require("jsonwebtoken");

const routeProtection = (req, res, next) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.status(400).json({
      message: "token not found",
    });
  }
  jwt.verify(token, process.env.Ftoken, (error, user) => {
    if (error) {
      return res.status(400).json({
        message: " invalid token",
      });
    }
    req.user = user;
    next();
  });
};

module.exports = routeProtection;
