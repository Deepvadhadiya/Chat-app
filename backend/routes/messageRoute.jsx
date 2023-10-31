const express = require('express');
const protect = require('../middlewares/authMiddleware.jsx');
const { sendMessage, allMessage } = require('../controllers/messageControllers.jsx');

const router = express.Router();

router.route('/').post(protect, sendMessage);
router.route('/:chatId').get(protect, allMessage);

module.exports = router;