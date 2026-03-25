const express = require("express");
const router = express.Router();

const { getTools } = require("../controllers/toolController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, getTools);

module.exports = router;
