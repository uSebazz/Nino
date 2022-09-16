# Install the following packages:
FROM node:18.6.0-bullseye-slim as base

WORKDIR /usr/src/app

# Environment variables
ENV CI=true
ENV LOG_LEVEL=info
ENV FORCE_COLOR=true

# Update packages and install dependencies for the build process
RUN apt-get update && \
	apt-get upgrade -y --no-install-recommends && \
	apt-get install -y --no-install-recommends build-essential python3 dumb-init && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/* && \
	apt-get autoremove

# Copy the lock files 
COPY --chown=node:node yarn.lock .
COPY --chown=node:node package.json .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn/ .yarn/

ENTRYPOINT ["dumb-init", "--"]

###############
# Build Stage #
###############
FROM base as build

ENV NODE_ENV="development"

# Copy the source files to the build context
COPY --chown=node:node tsconfig.json .
COPY --chown=node:node tsup.config.ts .
COPY --chown=node:node .env .
COPY --chown=node:node src/ src/
COPY --chown=node:node scripts/ scripts/
COPY --chown=node:node prisma/ prisma/

# Run the build process
RUN yarn install --immutable
RUN yarn run prisma
RUN yarn run build

##############
# Run Stage #
#############
FROM base as runner

# Environment variables
ENV NODE_ENV="production"
ENV NODE_OPTIONS="--enable-source-maps --preserve-symlinks"

WORKDIR /usr/src/app

# Copy the environment variables to the container and language folder including the dist folder 
COPY --chown=node:node src/.env src/.env
COPY --chown=node:node --from=builder /usr/src/app/dist dist
COPY --chown=node:node --from=builder /usr/src/app/src/languages src/languages

# Patch .prisma with the built files
COPY --chown=node:node --from=builder /usr/src/app/node_modules/.prisma node_modules/.prisma
COPY --chown=node:node --from=builder /usr/src/app/.env .env

USER node

CMD ["yarn", "run", "start"]
