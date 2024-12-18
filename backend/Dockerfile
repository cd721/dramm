FROM node:20-slim

ARG REDIS_PORT
ARG MONGO_INITDB_ROOT_PASSWORD

ENV REDIS_PORT=6379
ENV MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}

# location for node app code
WORKDIR /usr/src/app 

COPY package*.json ./

RUN npm install

#copy source files
COPY . .

EXPOSE 3001

CMD ["npm", "start"]
