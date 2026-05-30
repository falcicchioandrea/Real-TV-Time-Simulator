import { fetchUser, logout, accedi, registrati } from "../controllers/controllerUser.js";
import express from 'express'  // ALTRO MODO --> const express = require('express'); 

const router = express.Router();  // creo un router per la gestione delle rotte nella gestione utenti


router.post("/registrati", registrati);
router.post("/accedi", accedi);
router.get("/fetch-user", fetchUser);

// POST per il Logout
router.post("/user-api/esci", logout);

 export default router // ALTRO MDOO--> module.exports = router