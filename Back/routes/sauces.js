// imports modules 
const express = require("express");
const saucesControler = require("../controlers/saucelogs.js");

// récupération des routes
let router = express.Router();

// import sauces

router.get('', saucesControler.getAll);

router.get('/:id', saucesControler.getOne);

router.post('', saucesControler.create);

router.put('/:id', saucesControler.modify);

router.delete('/:id', saucesControler.delete);

router.post('/:id/like', saucesControler.likedislike);

// export
module.exports = router;