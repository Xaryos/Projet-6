/* Import des modules necessaires */
const jwt = require("jsonwebtoken");


/* Verification authentification */
// Token Verify
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);    
    const userId = decodedToken.userId;

    if(req.body.userId){
      if(req.body.userId !== userId){
        throw "Invalid user ID";
      }
    }
    
    req.userId = userId // Mise en palce de l'ID du token dans la requête pour les controllers
    next()
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};