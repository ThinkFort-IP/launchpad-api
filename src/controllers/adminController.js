const User = require("../models/User");
const Tool = require("../models/Tool");

exports.getAllTools = async (req, res) => {
  const tools = await Tool.find({}).sort({ name: 1 });
  res.json(tools);
};

exports.getUsers = async (req, res) => {
  const users = await User.find({}, "email displayName role toolAccess").sort({
    email: 1,
  });
  res.json(users);
};

exports.updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const updated = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, select: "email displayName role toolAccess" }
  );

  if (!updated) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(updated);
};

exports.updateUserAccess = async (req, res) => {
  const { userId } = req.params;
  const { toolAccess } = req.body;

  if (!Array.isArray(toolAccess)) {
    return res.status(400).json({ message: "toolAccess must be an array" });
  }

  const uniqueAccess = [...new Set(toolAccess)];

  const tools = await Tool.find({}, "toolKey");
  const allowedSet = new Set([
    ...tools.map((tool) => tool.toolKey),
    ...tools.map((tool) => String(tool._id)),
  ]);
  const invalid = uniqueAccess.filter((id) => !allowedSet.has(id));
  if (invalid.length) {
    return res.status(400).json({
      message: "toolAccess contains invalid tool keys",
      invalid,
    });
  }

  const updated = await User.findByIdAndUpdate(
    userId,
    { toolAccess: uniqueAccess },
    { new: true, select: "email displayName role toolAccess" }
  );

  if (!updated) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(updated);
};

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

exports.createTool = async (req, res) => {
  const {
    name,
    category,
    url,
    iconPath = "",
    role = "all",
    toolKey,
  } = req.body;

  if (!name || !category || !url) {
    return res
      .status(400)
      .json({ message: "name, category, and url are required" });
  }

  const resolvedToolKey = toolKey ? slugify(toolKey) : slugify(name);

  if (!resolvedToolKey) {
    return res.status(400).json({ message: "toolKey is required" });
  }

  const existing = await Tool.findOne({ toolKey: resolvedToolKey });
  if (existing) {
    return res.status(409).json({ message: "toolKey already exists" });
  }

  let tool;
  try {
    tool = await Tool.create({
      name,
      toolKey: resolvedToolKey,
      category,
      url,
      iconPath,
      role,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  res.status(201).json(tool);
};

exports.updateTool = async (req, res) => {
  const { toolId } = req.params;
  const { name, category, url, iconPath, role, toolKey } = req.body;

  const update = { name, category, url, iconPath, role };

  if (toolKey !== undefined) {
    const resolvedToolKey = slugify(toolKey || name);
    if (!resolvedToolKey) {
      return res.status(400).json({ message: "toolKey is required" });
    }
    const existing = await Tool.findOne({
      toolKey: resolvedToolKey,
      _id: { $ne: toolId },
    });
    if (existing) {
      return res.status(409).json({ message: "toolKey already exists" });
    }
    update.toolKey = resolvedToolKey;
  }

  let updated;
  try {
    updated = await Tool.findByIdAndUpdate(toolId, update, { new: true });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  if (!updated) {
    return res.status(404).json({ message: "Tool not found" });
  }

  res.json(updated);
};
