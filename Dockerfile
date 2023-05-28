FROM node:19-alpine  as dev

EXPOSE 8080
WORKDIR /backend

COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node tsconfig.json .
COPY --chown=node:node tsconfig.build.json .
COPY --chown=node:node nest-cli.json .
COPY --chown=node:node src ./src
COPY --chown=node:node prisma ./prisma

RUN yarn install
RUN yarn build
RUN yarn prisma:generate
# RUN echo 'DB_URL=postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?schema=public&connect_timeout=300' >> .env

CMD ["/bin/sh", "-c", "yarn prisma:deploy;node dist/main.js"]

FROM node:19-alpine As build

EXPOSE 8080
WORKDIR /backend

COPY --from=dev --chown=node:node /backend/dist ./dist
COPY --from=dev --chown=node:node /backend/prisma ./prisma
COPY --from=dev --chown=node:node /backend/package.json .
COPY --from=dev --chown=node:node /backend/yarn.lock .

RUN yarn install --prod --frozen-lockfile
RUN yarn cache clean --all

CMD ["/bin/sh", "-c", "npx prisma migrate deploy;node dist/main.js"]

FROM node:19-alpine as prod

EXPOSE 8080
WORKDIR /backend

COPY --from=dev   --chown=node:node /backend/prisma ./prisma
COPY --from=build --chown=node:node /backend/node_modules ./node_modules
COPY --from=build --chown=node:node /backend/dist ./dist

# ENV NODE_ENV=prod
CMD ["/bin/sh", "-c", "npx prisma migrate deploy;node dist/main.js"]
