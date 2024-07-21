FROM ghcr.io/hazmi35/node:21-dev-alpine as build-stage

# Prepare pnpm with corepack (experimental feature)
RUN corepack enable && corepack prepare pnpm@latest

# Copy package.json, lockfile and npm config files
COPY package.json pnpm-lock.yaml *.npmrc  ./

# Fetch dependencies to virtual store
RUN pnpm fetch

# Install dependencies
RUN pnpm install --offline --frozen-lockfile

# Copy Project files
COPY . .

# Copy .env file
COPY .env.production .env

# Build TypeScript Project
RUN pnpm run build

# Prune devDependencies
RUN pnpm prune --production

# Get ready for production
FROM ghcr.io/hazmi35/node:21-alpine

LABEL name "bandrek"
LABEL maintainer "Stegripe Development <support@stegripe.org>"

# Copy needed files
COPY --from=build-stage /tmp/build/package.json .
COPY --from=build-stage /tmp/build/.next/ ./.next
COPY --from=build-stage /tmp/build/node_modules ./node_modules
COPY --from=build-stage /tmp/build/next.config.js ./

# Additional Environment Variables
ENV NODE_ENV production

# Expose the port the app runs on
EXPOSE 3000

# Start the app with node
CMD ["npm", "run", "start"]
