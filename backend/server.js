import dotenv from "dotenv";
import express from "express";
import { connectToDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

dotenv.config(); // Carica le variabili d'ambiente (.env) prima di tutto il resto

import userRouter from "./routers/routerUser.js";
import favoriteRouter from "./routers/routerFavorite.js";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app); // Server HTTP che avvolge Express, condiviso con Socket.IO

// Server WebSocket per la comunicazione in tempo reale
const io = new Server(server, {
  cors: {
    origin: [
      import.meta.env.FRONTEND_URL,
    ],
    credentials: true,
  },
});

const visualizzatoriFilm = {}; // Conta gli utenti presenti su ogni pagina film

// Gestione real-time: ogni client entra/esce dalla "stanza" di un film e
// il contatore degli spettatori viene aggiornato e trasmesso a tutti i presenti.
io.on("connection", (socket) => {
  let stanzaCorrente = null;

  socket.on("entra_film", (idFilm) => {
    stanzaCorrente = idFilm;
    socket.join(idFilm); // Entra nella stanza del film (funzione nativa di Socket.IO)
    if (!visualizzatoriFilm[idFilm]) {
      visualizzatoriFilm[idFilm] = 0;
    }
    visualizzatoriFilm[idFilm]++;
    io.to(idFilm).emit("aggiorna_contatore", visualizzatoriFilm[idFilm]);
  });

  socket.on("esci_film", (idFilm) => {
    if (visualizzatoriFilm[idFilm]) {
      visualizzatoriFilm[idFilm]--;
      io.to(idFilm).emit("aggiorna_contatore", visualizzatoriFilm[idFilm]);
    }
    socket.leave(idFilm);
    stanzaCorrente = null;
  });

  socket.on("disconnect", () => {
    // Se il client si disconnette mentre è su un film, lo scala dal contatore
    if (stanzaCorrente && visualizzatoriFilm[stanzaCorrente]) {
      visualizzatoriFilm[stanzaCorrente]--;

      if (visualizzatoriFilm[stanzaCorrente] < 0) {
        visualizzatoriFilm[stanzaCorrente] = 0;
      }
      io.to(stanzaCorrente).emit(
        "aggiorna_contatore",
        visualizzatoriFilm[stanzaCorrente],
      );
    }
  });
});

// Middlewares
app.use(
  cors({
    // Abilita le richieste dal frontend (porta diversa) e lo scambio dei cookie di sessione
    origin: [
      import.meta.env.FRONTEND_URL,
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Registrati sulla mia applicazione!");
});

app.use("/user-api", userRouter);
app.use("/favorite-api", favoriteRouter);

// Avvia 'server' (non 'app') così rotte Express e WebSocket partono insieme sulla stessa porta
server.listen(PORT, () => {
  connectToDB();
  console.log(`Il server è in ascolto sulla porta: ${PORT}`);
});

// Documentazione API generata automaticamente dai commenti @swagger nei router
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MovieTrack API Docs",
      version: "1.0.0",
      description: "Documentazione delle API di MovieTrack",
    },
  },
  apis: ["./routers/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Espone la documentazione su /api-docs
