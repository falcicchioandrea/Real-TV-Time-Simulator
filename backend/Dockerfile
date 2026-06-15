# Specifichiamo l'immagine di base da usare
FROM node:20-alpine

# Definiamo la cartella di lavoro all'interno del container
WORKDIR /app
# Copiamo i file di configurazione delle dipendenze
COPY package*.json ./

# Installiamo le dipendenze del progetto
RUN npm install

# Copiamo il resto del codice sorgente
COPY . .

# Esponiamo la porta su cui ascolta Express
EXPOSE 5000

# Definiamo il comando per avviare l'applicazione in modalità sviluppo
CMD ["npm", "run", "dev"]