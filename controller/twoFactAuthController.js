const uuid = require("uuid");
const speakEasy = require("speakeasy");
const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");
const qrcode = require("qrcode");
const db = new JsonDB(
  new Config("twoFactorAuthenticationDb", true, false, "/")
);
const twoFactorAuthenticationGeneration = async (req, res) => {
  const id = uuid.v4();
  try {
    const path = `/user/${id}`;
    const temp_secret = speakEasy.generateSecret();
    const qrData = await qrcode.toDataURL(temp_secret.otpauth_url);
    db.push(path, { id, temp_secret });
    res.send({ userId: id, temp_secret: temp_secret.base32, qrData: qrData });
  } catch (error) {
    console.log(error);
    res.send({ errorMessage: "Something went wrong." });
  }
};

const getTwofactorAuthenticationTOTPCode = (req, res) => {
  const code = speakEasy.totp({
    secret: req.body.secret,
    encoding: "base32",
  });
  const remainingTime = 30 - Math.floor((new Date().getTime() / 1000) % 30);
  res.status(200).send({ secretCode: code, remainingTime: remainingTime });
};

const twoFactorAuthenticationVerify = (req, res) => {
  const { id, token } = req.body;
  try {
    const path = `/user/${id}`;
    const user = db.getData(path);
    const { base32: secret } = user.temp_secret;
    console.log(secret, token);
    const verified = speakEasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: token,
      window: 2,
    });
    console.log(verified);
    if (verified) {
      db.push(path, { id: id, secret: secret });
      res.send({ verified: true });
    } else {
      res.send({ verified: false });
    }
  } catch (error) {
    console.log(error);
    res.send({ errorMessage: "Some thing went wrong." });
  }
};
const twoFactorAuthenticationValidation = (req, res) => {
  const { id, token } = req.body;
  try {
    const path = `/user/${id}`;
    const user = db.getData(path);
    console.log(user);
    const secret = user.secret;
    console.log(secret);
    const verified = speakEasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: token,
      window: 2,
    });
    console.log(verified);
    if (verified) {
      res.send({ validated: true });
    } else {
      res.send({ validated: false });
    }
  } catch (error) {
    console.log(error);
    res.send({ errorMessage: "Some thing went wrong." });
  }
};

module.exports = {
  twoFactorAuthenticationGeneration,
  getTwofactorAuthenticationTOTPCode,
  twoFactorAuthenticationVerify,
  twoFactorAuthenticationValidation,
};
