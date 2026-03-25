const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/requireAdmin");
const {
  getAllTools,
  getUsers,
  createTool,
  updateTool,
  updateUserRole,
  updateUserAccess,
} = require("../controllers/adminController");

router.use(verifyToken, requireAdmin);

router.get("/tools", getAllTools);
router.post("/tools", createTool);
router.put("/tools/:toolId", updateTool);
router.get("/users", getUsers);
router.put("/users/:userId/role", updateUserRole);
router.put("/users/:userId/access", updateUserAccess);

module.exports = router;
