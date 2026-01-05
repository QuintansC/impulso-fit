import express from 'express';
import cors from 'cors';
import produtosRouter from './routes/produtos';
import categoriasRouter from './routes/categorias';
import pagamentosRouter from './routes/pagamentos';

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
  ],
  credentials: true
}));
app.use(express.json());

// Aqui você conecta as rotas
app.use('/api/produtos', produtosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/pagamentos', pagamentosRouter);

app.listen(3333, () => console.log('🚀 Backend rodando na porta 3333'));