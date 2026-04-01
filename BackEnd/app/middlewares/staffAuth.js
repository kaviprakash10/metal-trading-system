// middlewares/staffAuth.js
// Allows both "staff" and "admin" roles

const staffAuth = (req, res, next) => {
  const { role } = req.user; // set by authUser middleware

  if (role === "staff" || role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Access denied. Staff only." });
};

export default staffAuth;
