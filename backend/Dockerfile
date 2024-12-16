FROM node:20-slim

# location for node app code
WORKDIR /usr/src/app 

COPY package*.json ./

RUN npm install

#copy source files
COPY . .

EXPOSE 3001

CMD ["npm", "start"]