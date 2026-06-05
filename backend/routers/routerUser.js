import {
  fetchUser,
  logout,
  accedi,
  registrati,
} from "../controllers/controllerUser.js";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * /user-api/registrati:
 *   post:
 *     summary: Registra un nuovo utente
 *     tags: [Utenti]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: alessio
 *               email:
 *                 type: string
 *                 example: alessio@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Utente creato con successo
 *       400:
 *         description: Campi mancanti o credenziali già in uso
 */
router.post("/registrati", registrati);

/**
 * @swagger
 * /user-api/accedi:
 *   post:
 *     summary: Effettua il login
 *     tags: [Utenti]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: alessio
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login riuscito, cookie JWT impostato
 *       400:
 *         description: Credenziali non valide
 */
router.post("/accedi", accedi);

/**
 * @swagger
 * /user-api/fetch-user:
 *   get:
 *     summary: Restituisce l'utente attualmente loggato
 *     tags: [Utenti]
 *     description: Legge il cookie JWT dalla richiesta per identificare l'utente.
 *     responses:
 *       200:
 *         description: Dati dell'utente loggato
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     favoriteMovies:
 *                       type: array
 *                       items:
 *                         type: number
 *       401:
 *         description: Nessun token fornito o token non valido
 *       404:
 *         description: Utente non trovato
 */
router.get("/fetch-user", fetchUser);

/**
 * @swagger
 * /user-api/esci:
 *   post:
 *     summary: Effettua il logout
 *     tags: [Utenti]
 *     description: Cancella il cookie JWT e termina la sessione.
 *     responses:
 *       200:
 *         description: Logout effettuato con successo
 */
router.post("/esci", logout);

export default router;
