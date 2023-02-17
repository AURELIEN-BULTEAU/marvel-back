const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const User = require("../models/User");

router.post("/user/sign_up", async (req, res) => {
  try {
    const userExist = await User.find({ email: req.body.email });
    const userCorrect = req.body.username;

    const password = req.body.password;
    const saltGenerator = uid2(16);
    const hashGenerator = SHA256(password + saltGenerator).toString(encBase64);
    const tokenGenerator = uid2(16);

    if (userCorrect === "") {
      res.status(400).json({
        message: "Enter user name",
      });
    } else if (userExist.length === 0) {
      const newUser = new User({
        account: { username: req.body.username, avatar: req.body.Object },
        email: req.body.email,

        token: tokenGenerator,
        hash: hashGenerator,
        salt: saltGenerator,
        newsletter: req.body.newsletter,
      });
      await newUser.save();
      const resUser = await User.findOne({ email: req.body.email });
      const resUserFinal = {
        _id: resUser._id,
        token: resUser.token,
        account: resUser.account,
      };
      res.status(200).json(resUserFinal);
    } else {
      res.status(400).json({ message: "Email all ready exist" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const checkUser = await User.findOne({ email: req.body.email });

    if (checkUser) {
      const checkHashReq = checkUser.hash;
      const checkHashData = SHA256(req.body.password + checkUser.salt).toString(
        encBase64
      );
      if (checkHashData === checkHashReq) {
        res.status(200).json({
          _id: checkUser._id,
          token: checkUser.token,
          account: {
            username: checkUser.account.username,
          },
        });
      } else {
        res.status(400).json({ message: "email ou password incorrects" });
      }
    } else {
      res.status(400).json({ message: "email ou password incorrects" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
