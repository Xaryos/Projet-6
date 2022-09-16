// mods
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// userdata

const usersSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

// Controle mail unique

usersSchema.plugin(uniqueValidator);

// sending userdata

module.exports = mongoose.model("user", usersSchema);