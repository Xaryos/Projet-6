// importation des modules
const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require('jsonwebtoken')


// ( save )         permet de sauvegarder dans la base de données
// ( findOne )      permet de chercher un objet dans la base de données

// Sign up to BDD
exports.signup = (req, res) => {
    // Hash du mdp
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(500).json(error));
        })
        .catch(error => res.status(500).json(error));
};

// Login to BDD
exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            console.log(user)
            if (!user) {
                return res.status(401).json({ message: 'identifiant ou mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        console.log('PAS OK')
                        return res.status(401).json({ message: 'identifiant ou mot de passe incorrecte' });
                    } else {
                        console.log('ok')
                        console.log(user)
                        //return res.status(200).json({ message: '' });
                        return res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id },
                                process.env.TOKEN_SECRET,
                                { expiresIn: '1h' })
                        });
                    }
                })
                .catch(error => res.status(500).json(error));
        })
        .catch(error => res.status(500).json(error));
};