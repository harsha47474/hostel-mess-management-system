module.exports.isMessActive = (req, res, next) => {
  if (req.user.messStatus !== "active") {
    return res.status(403).send("Your mess subscription is inactive.");
  }
  next();
};
