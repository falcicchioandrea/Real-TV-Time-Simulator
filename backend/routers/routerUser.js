import { fetchUser, logout, accedi, registrati } from "../controllers/controllerUser.js";
import express from 'express'  // ALTRO MODO --> const express = require('express'); 

const router = express.Router();  // creo un router per la gestione delle rotte nella gestione utenti

router.post("/registrati", registrati);
router.post("/accedi", accedi);
router.get("/fetch-user", fetchUser);
router.post("/esci", logout);

 export default router // ALTRO MODO--> module.exports = router con "type": "commonjs"