// mods
const express = require("express");
const UserControler = require("../controlers/userlogs");

// récupération routes 
let router = express.Router();

//  routes user

// Signup
router.post("/signup", UserControler.signup);

// Login
router.post("/login", UserControler.login);

// export du routeur

module.exports = router;