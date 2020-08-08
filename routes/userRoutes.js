const express = require('express');
const router = express.Router();

// User Controller
const userController = require('../controllers/userController');

// Routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", userController.profile);



module.exports = router;