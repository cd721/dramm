FROM node:20-slim

ARG REDIS_HOST
ARG REDIS_PORT

ENV REDIS_HOST=127.0.0.1
ENV REDIS_PORT=6379

# location for node app code
WORKDIR /usr/src/app 

COPY package*.json ./

RUN npm install

#copy source files
COPY . .

EXPOSE 3001

CMD ["npm", "start"]
