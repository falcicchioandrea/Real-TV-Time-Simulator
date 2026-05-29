import mongoose from "mongoose";

// 1. DEFINIZIONE DELLO SCHEMA

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
});

// 2. CREAZIONE/CONNESSIONE DEL MODELLO

const User = mongoose.model.User || mongoose.model("User", userSchema);

export default User;

