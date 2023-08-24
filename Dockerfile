FROM node:18.4.0-alpine
 
WORKDIR /app

COPY . .

RUN npm install

# RUN npm install pm2 -g

RUN npm run build

EXPOSE 8000

CMD ["node", "dist/index.js"]