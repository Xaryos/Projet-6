// imports modules 
const express = require("express");
const saucesControler = require("../controlers/saucelogs");
const checkToken = require('../middleware/checkToken');
const multer = require('../middleware/multer-config');

// récupération des routes
let router = express.Router();

// import sauces

router.get('', checkToken, saucesControler.getAll);

router.get('/:id', checkToken, saucesControler.getOne);

router.post('', checkToken, multer, saucesControler.create);

router.put('/:id', checkToken, multer, saucesControler.modify);

router.delete('/:id', checkToken, saucesControler.delete);

router.post('/:id/like', checkToken, saucesControler.likedislike);

// export
module.exports = router;