import { fetchUser, logout, prova_registrati, accedi, registrati } from "../controllers/controllerUser.js";
import express from 'express'  // ALTRO MODO --> const express = require('express'); 

const router = express.Router();  // creo un router per la gestione delle rotte nella gestione utenti

router.get("/", prova_registrati);
router.post("/user-api/registrati", registrati);
router.post("/user-api/accedi", accedi);
router.get("/user-api/fetch-user", fetchUser);

// POST per il Logout
router.post("/user-api/esci", logout);

 export default router // ALTRO MDOO--> module.exports = router