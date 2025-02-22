FROM node:22

WORKDIR /reoserv.net

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3030

CMD ["npm", "run", "start"]
