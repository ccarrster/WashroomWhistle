var express = require("express");
var router = express.Router();

const WashroomStatus = require('../models/WashroomStatus.js');
const WashroomLog = require('../models/WashroomLog.js');

router.get("/", function(req, res, next) {
    res.send("Welcome to the WashroomWhistle API!");
});

router.get("/status/:deviceId", async (req, res, next) => {
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

router.get("/logs/:deviceId/:start?/:limit?", async (req, res, next) => {
    const deviceId = req.params.deviceId;

    const { skip = 0, limit = 0 } = req.params;

    const logs = await WashroomLog.find({ washroomId: deviceId }, '-_id occupied timestamp', { skip: +skip, limit: +limit, sort: '-timestamp' }).exec();

    if (logs != null && logs != undefined) {
        res.json({
            washroomId: deviceId,
            events: logs
        });
    } else {
        res.json({
            washroomId: deviceId,
            events: []
        });
    }
}); 

module.exports = router;