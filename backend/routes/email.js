const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

// Route pour envoyer l'email de récapitulatif
router.post("/send-email-recap", emailController.sendEmailRecap);

module.exports = router;
