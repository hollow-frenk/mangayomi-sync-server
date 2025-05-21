FROM node:24.0-alpine3.21 AS builder

WORKDIR /app

# Install dependencies
COPY --chown=node:node package.json package-lock.json ./
RUN npm install

# Copy files
COPY --chown=node:node . .

# Build app
RUN npm run build

# Run in a slimmer image
FROM node:24.0-alpine3.21

WORKDIR /home/node/app

# Imposta directory e permessi
RUN mkdir -p /home/node/app/node_modules && \
    chown -R node:node /home/node/app

# Aggiorna il sistema e installa le dipendenze
RUN apk update && \
    apk upgrade && \
    apk add openrc bash ca-certificates iptables ip6tables && rm -rf /var/cache/apk/*

# Copia l'applicazione dall'immagine builder
COPY --chown=node:node package.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist

USER node
# Esegui l'app
CMD [ "node", "--es-module-specifier-resolution=node", "dist/app.js"]
