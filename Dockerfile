FROM node:23.1-alpine3.20 AS builder

WORKDIR /app

# Install dependencies
COPY --chown=node:node package.json package-lock.json ./
RUN npm install

# Copy files
COPY --chown=node:node . .

# Build app
RUN npm run build

# Run in a slimmer image
FROM node:23.1-alpine3.20

WORKDIR /home/node/app
RUN mkdir -p /home/node/app/node_modules && \
    chown -R node:node /home/node/app

# Imposta directory e permessi
RUN mkdir -p /var/run/tailscale /var/cache/tailscale /var/lib/tailscale /home/node/.local/share/tailscale && \
    chown -R node:node /home/node/app /var/run/tailscale /home/node/.local/share/tailscale

# Aggiorna il sistema e installa le dipendenze
RUN apk update && \
    apk upgrade && \
    apk add openrc bash ca-certificates iptables ip6tables && rm -rf /var/cache/apk/*

# Copy binary to production image.
COPY --from=builder /app/start.sh /app/start.sh

# Copy Tailscale binaries from the tailscale image on Docker Hub.
COPY --from=docker.io/tailscale/tailscale:stable /usr/local/bin/tailscaled /app/tailscaled
COPY --from=docker.io/tailscale/tailscale:stable /usr/local/bin/tailscale /app/tailscale

# Copia l'applicazione dall'immagine builder
COPY --chown=node:node package.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist

USER node
# Esegui l'app e Tailscale tramite start.sh
CMD [ "node", "--es-module-specifier-resolution=node", "dist/app.js", "/app/start.sh" ]
