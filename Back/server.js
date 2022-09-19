// How to start the project : 
//  Front activate > ng serve  (msg told if valid = ** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **)
//  Back activate > 
//                 User openning : npm run start (msg told id valid = server Online [port: 4200])
//                 Developper openning : npm run dev (msg told id valid = server Online [port: 4200])

/* Modules */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// import routes

const usersRouter = require("./routes/users");
const saucesRouter = require("./routes/sauces");
// INIT API

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routage start

app.use("/images", express.static(path.join(__dirname, "images")));

app.get('/', (req, res) => res.send("Online to server"));

app.use('/api/auth', usersRouter);

app.use('/api/sauces', saucesRouter);

app.all('*', (req, res) => res.status(501).send("Error server catch please fix it"));


// test DB START
mongoose.connect(process.env.ATLAS,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`server Online [port: ${process.env.SERVER_PORT} ]`)
        })
    })
    .catch(() => console.log('Connexion à MongoDB échouée !'));
