import { favoriteToggle } from "../controllers/controllerFavorite.js";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * /favorite-api/favouriteToggle:
 *   post:
 *     summary: Aggiunge o rimuove un film dai preferiti
 *     tags: [Preferiti]
 *     description: >
 *       Se il film è già nei preferiti lo rimuove, altrimenti lo aggiunge.
 *       Richiede un cookie JWT valido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *             properties:
 *               movieId:
 *                 type: number
 *                 description: ID del film su TMDB
 *                 example: 550
 *     responses:
 *       200:
 *         description: Lista aggiornata dei preferiti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Preferiti aggiornati
 *                 favoriteMovies:
 *                   type: array
 *                   items:
 *                     type: number
 *                   example: [550, 680]
 *       401:
 *         description: Nessun token fornito o token non valido
 *       404:
 *         description: Utente non trovato
 *       500:
 *         description: Errore interno del server
 */
router.post("/favouriteToggle", favoriteToggle);

export default router;
