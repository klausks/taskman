FROM node:18.8-alpine3.15 as builder


ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci


COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production




FROM node:18.8-alpine3.15


ENV NODE_ENV production
ENV JWT_SECRET DAF34D880E666B2848HDHDJF998FD497C83F8AF506695A5E428D5DA96387B1082D9A
ENV JWT_EXPIRATION_TIME 7d
ENV DATABASE_URL file:./dev.db

USER node
WORKDIR /home/node
COPY --from=builder --chown=node:node /home/node/prisma/ ./prisma/
COPY --from=builder --chown=node:node /home/node/entrypoint.sh ./entrypoint.sh
COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
RUN npx prisma migrate dev --name init
RUN ["chmod", "+x", "entrypoint.sh"]

EXPOSE 8080

ENTRYPOINT ["./entrypoint.sh"]