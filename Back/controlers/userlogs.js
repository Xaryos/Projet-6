// importation des modules
const bcrypt = require('bcrypt');
const User = require("../models/user");


// ( save )         permet de sauvegarder dans la base de données
// ( findOne )      permet de chercher un objet dans la base de données

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
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res) => {
    User.findOne({ email: req.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'identifiant ou mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.passworld, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'identifiant ou mot de passe incorrecte' });
                    } else {
                        return res.status(200).json({ message: '' });
                    }
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};