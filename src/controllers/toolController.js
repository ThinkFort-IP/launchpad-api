const Tool = require("../models/Tool");

exports.getTools = async (req, res) => {
  const dbUser = req.dbUser;
  const userRole = dbUser?.role || "user";
  const allowedTools = dbUser?.toolAccess || [];

  const tools = await Tool.find({}).sort({ name: 1 });

  const filteredTools = tools.filter((tool) => {
    if (userRole === "admin") return true;
    if (allowedTools.length === 0) return false;
    const key = tool.toolKey || String(tool._id);
    return (
      allowedTools.includes(key) || allowedTools.includes(String(tool._id))
    );
  });

  res.json(filteredTools);
};
