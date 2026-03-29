import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import produtosRouter from './routes/produtos';
import categoriasRouter from './routes/categorias';
import pagamentosRouter from './routes/pagamentos';
import pedidosRouter from './routes/pedidos';
import favoritosRouter from './routes/favoritos';
import adminProdutosRouter from './routes/admin/produtos';
import adminCategoriasRouter from './routes/admin/categorias';
import adminPedidosRouter from './routes/admin/pedidos';
import adminUsuariosRouter from './routes/admin/usuarios';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/produtos', produtosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/pagamentos', pagamentosRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/favoritos', favoritosRouter);
app.use('/api/admin/produtos', adminProdutosRouter);
app.use('/api/admin/categorias', adminCategoriasRouter);
app.use('/api/admin/pedidos', adminPedidosRouter);
app.use('/api/admin/usuarios', adminUsuariosRouter);

app.use(errorHandler);

app.listen(3333, () => console.log('🚀 Backend rodando na porta 3333'));
