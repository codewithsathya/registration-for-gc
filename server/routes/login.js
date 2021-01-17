const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/login", ensureGuest, (req, res) => {
  res.render("login");
  res.status(200);
});

router.get("/dashboard", ensureAuth, (req, res) => {
  res.render("dash");
});

module.exports = router;
