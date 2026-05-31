import {favoriteToggle} from '../controllers/controllerFavorite.js'
import express from 'express'  // ALTRO MODO --> const express = require('express'); 

const router = express.Router();  // creo un router per la gestione delle rotte nella gestione utenti

router.post("/favouriteToggle",favoriteToggle);

 export default router