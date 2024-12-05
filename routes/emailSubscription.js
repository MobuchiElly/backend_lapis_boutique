const express = require("express");
const { subscribeEmail } = require("../controllers/auth.js");

const router = express.Router();

router.route("/subscribeemail").post(subscribeEmail);

module.exports = router;