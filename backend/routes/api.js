const express = require("express");
const router = express.Router();
const ConfigurationController = require("../controllers/ConfigurationController");

router.get("/", (req, res) => {
    res.send("Hello World");
});

router.get('/api/configurations', ConfigurationController.index);
router.post("/api/configurations", ConfigurationController.store)

module.exports = router;