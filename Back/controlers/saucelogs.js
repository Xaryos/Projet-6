// importation des module
const Sauce = require("../models/sauce")

//  Get all sauces
exports.getAll = (req, res) => {   //1   
    Sauce.find().limit()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(500).json(error))
}

// Get One sauce
exports.getOne = (req, res) => { //3
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(500).json(error ));
}

// Create Sauce (one)
exports.create = (req, res) => { //2
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject.userId;

    const sauce = new Sauce({
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        userLiked: [],
        userDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(500).json(error));
} 

// Modify content of sauce
exports.modify = (req, res) => { //4
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                // suppression de l'ancienne image
                const filename = sauce.imageUrl.split('/images/')[1];
                FileSystem.unlink(`images/${filename}`, () => {
                    const sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'sauce modifiée !' }))
                        .catch(error => res.status(500).json(error));
                })
            })
            .catch(error => res.status(500).json(error ));
    } else {
        const sauceObject = { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifée' }))
            .catch(error => res.status(500).json(error));
    }
};

// Delete one sauce
exports.delete = (req, res) => { //5
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // If error in process delete
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Suppression impossible : Non autorisation' })
            } else {
                // If no error caught
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimée !' }) })
                        .catch(error => res.status(500).json(error));
                });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
}

// Like dislike display
exports.likedislike = (req, res) => { //6
    switch (req.body) {

            // If liked : 
        case 1:
            Sauce.updateOne({ _id: req.params.id }, { $addToSet: { usersLiked: req.body.userId }, $inc: { likes: 1 } })
                .then(() => res.status(200).json({ message: 'Like ajouté !' }))
                .catch((error) => res.status(500).json(error))
            break;

            // If default = 0 :
        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                            .then(() => res.status(200).json({ message: 'Aucun like' }))
                            .catch((error) => res.status(500).json(error))
                    }
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                            .then(() => res.status(200).json({ message: 'Aucun like' }))
                            .catch(error => res.status(500).json(error))
                    }
                })
                .catch(error => res.status(500).json(error))
            break;

            // If Disliked :
        case -1:
            Sauce.updateOne({ _id: req.params.id }, { $addToSet: { usersDisliked: req.body.userId }, $inc: { dislikes: 1 } })
                .then(() => { res.status(200).json({ message: 'Dislike ajouté !' }) })
                .catch((error) => res.status(500).json(error))
            break;

        default:
            return res.status(400).json({message: "Unknown like dislike value"})
    }
};
