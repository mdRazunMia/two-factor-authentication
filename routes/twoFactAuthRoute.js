const express = require("express");
const router = express.Router();
const twoFactAuth = require("../controller/twoFactAuthController");

router.post("/generation", twoFactAuth.twoFactorAuthenticationGeneration);
router.post("/verify", twoFactAuth.twoFactorAuthenticationVerify);
router.post("/validation", twoFactAuth.twoFactorAuthenticationValidation);

module.exports = router;
