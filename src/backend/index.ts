import express from 'express';
import cors from 'cors';
import produtosRouter from './routes/produtos';
import categoriasRouter from './routes/categorias';

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://cafe-america.up.railway.app'
  ],
  credentials: true
}));
app.use(express.json());

// Aqui você conecta as rotas de produtos
app.use('/api/produtos', produtosRouter);
app.use('/api/categorias', categoriasRouter);

app.listen(3333, () => console.log('🚀 Backend rodando na porta 3333'));