var express = require("express");
var router = express.Router();

const WashroomStatus = require('../models/WashroomStatus.js');

router.get("/", function(req, res, next) {
    res.send("Welcome to the WashroomWhistle API!");
});

router.get("/status/:deviceId", async function(req, res, next) {
    const deviceId = req.params.deviceId;
    const deviceStatus = await WashroomStatus.findOne({ washroomId: deviceId }).exec();

    if (deviceStatus != null && deviceStatus != undefined) {
        res.json({
            washroomId: deviceId,
            occupied: deviceStatus.occupied
        });
    } else {
        res.json({
            washroomId: deviceId,
            occupied: false
        });
    }
});

module.exports = router;