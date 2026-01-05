# Impulso Fit

E-commerce de produtos fitness - Suplementos, equipamentos e acessórios para treino

## Stack:
- Backend: Express + Prisma (SQLite)
- Frontend: Next.js + Tailwind CSS
- Banco de dados: SQLite com Prisma ORM

## Como rodar:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```