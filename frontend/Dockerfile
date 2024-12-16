FROM node:20 as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

#EXPOSE 5173

FROM nginx:stable-alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

#CMD ["npm", "run", "dev"]