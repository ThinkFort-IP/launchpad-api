const admin = require("../config/firebase");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    const dbUser = await User.findOneAndUpdate(
      { firebaseUid: decoded.uid },
      {
        $set: {
          email: decoded.email || "",
          displayName: decoded.name || decoded.email || "",
        },
        $setOnInsert: {
          role: "user",
          toolAccess: [],
        },
      },
      { new: true, upsert: true }
    );
    req.dbUser = dbUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
