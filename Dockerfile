# Base Stage
FROM node:18.4.0-bullseye-slim as base

WORKDIR /usr/src/app

ENV CI=true
ENV LOG_LEVEL=info
ENV FORCE_COLOR=true

RUN apt-get update && \
	apt-get upgrade -y --no-install-recommends && \
	apt-get install -y --no-install-recommends build-essential python3 && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/*

COPY --chown=node:node yarn.lock .
COPY --chown=node:node package.json .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn/ .yarn/

# Build Stage
FROM base as builder

ENV NODE_ENV="development"

COPY --chown=node:node tsconfig.json .
COPY --chown=node:node tsup.config.ts .
COPY --chown=node:node .env .
COPY --chown=node:node src/ src/
COPY --chown=node:node scripts/ scripts/
COPY --chown=node:node prisma/ prisma/

RUN yarn install --immutable
RUN yarn run prisma
RUN yarn run build

# Run Stage
FROM base as runner

ENV NODE_ENV="production"
ENV NODE_OPTIONS="--enable-source-maps --preserve-symlinks"

WORKDIR /usr/src/app

COPY --chown=node:node src/.env src/.env
COPY --chown=node:node --from=builder /usr/src/app/dist dist
COPY --chown=node:node --from=builder /usr/src/app/src/languages src/languages

RUN yarn workspaces focus --all --production

# Patch .prisma with the built files
COPY --chown=node:node --from=builder /usr/src/app/node_modules/.prisma node_modules/.prisma
COPY --chown=node:node --from=builder /usr/src/app/.env .env

USER node

CMD ["yarn", "run", "start"]
