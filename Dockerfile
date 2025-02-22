FROM node:22-alpine

WORKDIR /reoserv.net

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

RUN rm -rf node_modules

RUN npm install --omit=dev

EXPOSE 3030

CMD ["npm", "run", "start"]
