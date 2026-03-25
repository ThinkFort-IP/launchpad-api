const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    toolKey: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    url: { type: String, required: true },
    iconPath: { type: String, default: "" },
    role: { type: String, enum: ["all", "admin", "user"], default: "all" },
  },
  { timestamps: true }
);

toolSchema.index({ name: 1, category: 1 });

module.exports = mongoose.model("Tool", toolSchema);
