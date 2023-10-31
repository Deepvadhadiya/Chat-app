const express = require('express');
const protect = require('../middlewares/authMiddleware.jsx');
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require('../controllers/chatControllers.jsx');

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/allchat").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);

module.exports = router;