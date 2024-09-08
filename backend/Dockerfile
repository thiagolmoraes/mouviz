FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

COPY . .

ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/movies?schema=public"

EXPOSE 8000

CMD ["bash", "-c", "npx prisma migrate deploy && npx prisma generate && npm run dev"]