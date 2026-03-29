import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import produtosRouter from './routes/produtos';
import categoriasRouter from './routes/categorias';
import pagamentosRouter from './routes/pagamentos';
import authRouter from './routes/auth';
import adminProdutosRouter from './routes/admin/produtos';
import adminCategoriasRouter from './routes/admin/categorias';
import adminPedidosRouter from './routes/admin/pedidos';
import adminUsuariosRouter from './routes/admin/usuarios';

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
  ],
  credentials: true
}));
app.use(express.json());

// Aqui você conecta as rotas
app.use('/api/auth', authRouter);
app.use('/api/admin/produtos', adminProdutosRouter);
app.use('/api/admin/categorias', adminCategoriasRouter);
app.use('/api/admin/pedidos', adminPedidosRouter);
app.use('/api/admin/usuarios', adminUsuariosRouter);
app.use('/api/produtos', produtosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/pagamentos', pagamentosRouter);

app.listen(3333, () => console.log('🚀 Backend rodando na porta 3333'));