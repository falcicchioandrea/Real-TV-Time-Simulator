# 1. Immagine di base (uguale al backend)
FROM node:20-alpine
# Come nel backend

# 2. Cartella di lavoro nel container
WORKDIR /app
# Come nel backend

# 3. Copiamo i file delle dipendenze
COPY package*.json ./
# Come nel backend 

# 4. Installiamo le dipendenze del frontend
RUN npm install
# Come nel backend

# 5. Copiamo il codice di React/Vite
COPY . .
# Come nel backend

# 6. Esponiamo la porta tipica di Vite
EXPOSE 5173
# Esponiamo la porta 5173, che è quella su cui Vite serve l'applicazione React in modalità sviluppo.

# 7. Avviamo il server di sviluppo di Vite
CMD ["npm", "run", "dev"]
# Come nel backend