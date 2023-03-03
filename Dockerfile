FROM node:14 AS base

WORKDIR /user/src/app

COPY . .

### Seed data is migrate only once, when the image is built 

### dev stage
FROM base AS dev
RUN npm install --omit=dev
EXPOSE 3000
CMD npm run migration:run && npm run start:dev 

### unit-test stage
FROM base AS unit-test
RUN npm install --omit=dev
EXPOSE 3000
CMD npm run migration:run && npm run test

### integration-test stage 
FROM base AS integration-test
RUN npm install --omit=dev
EXPOSE 3000
CMD npm run migration:run && npm run test:e2e
