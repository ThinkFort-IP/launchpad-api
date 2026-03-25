const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String, default: "" },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    toolAccess: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
