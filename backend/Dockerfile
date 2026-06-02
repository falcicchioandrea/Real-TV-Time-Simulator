# 1. Specifichiamo l'immagine di base da usare
FROM node:20-alpine
# Utilizziamo l'immagine ufficiale di Node.js versione 20 basata su Alpine Linux, 
# che è leggera e adatta per eseguire applicazioni Node.js in produzione. 
# Questa immagine include già Node.js e npm, semplificando il processo di configurazione del nostro ambiente di sviluppo.

# 2. Definiamo la cartella di lavoro all'interno del container
WORKDIR /app
# Impostiamo la directory di lavoro su /app, il che significa che tutte le operazioni successive 
# (come la copia dei file, l'installazione delle dipendenze e l'esecuzione dei comandi) avverranno all'interno di questa cartella.

# 3. Copiamo i file di configurazione delle dipendenze
COPY package*.json ./
# Copiamo i file package.json e package-lock.json (se presente) nella directory di lavoro del container.

# 4. Installiamo le dipendenze del progetto
RUN npm install
# Eseguiamo il comando npm install per installare tutte le dipendenze elencate in package.json.

# 5. Copiamo il resto del codice sorgente
COPY . .
# Copiamo tutto il resto del codice sorgente del progetto nella directory di lavoro del container.

# 6. Esponiamo la porta su cui ascolta Express
EXPOSE 5000
# Esponiamo la porta 5000, che è quella su cui il nostro server Express ascolta le richieste in arrivo.

# 7. Definiamo il comando per avviare l'applicazione in modalità sviluppo
CMD ["npm", "run", "dev"]
# Utilizziamo il comando npm run dev per avviare l'applicazione in modalità sviluppo, 
# che consente di vedere le modifiche in tempo reale senza dover ricostruire l'immagine ogni volta.