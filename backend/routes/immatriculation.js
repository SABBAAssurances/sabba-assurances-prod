const express = require("express");
const router = express.Router();
const immatriculationController = require("../controllers/immatriculationController");

// Route pour récupérer les informations d'un véhicule par plaque
router.get("/", immatriculationController.getVehicleInfo);

module.exports = router;
