FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generamos el cliente de Prisma para el entorno de Linux de Railway
RUN npx prisma generate

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]