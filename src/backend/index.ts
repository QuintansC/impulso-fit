import 'dotenv/config';
import app from './app';

const PORT = parseInt(process.env.PORT ?? '3333');

const server = app.listen(PORT, () =>
  console.log(`🚀 Backend rodando na porta ${PORT}`),
);

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso. Finalize o processo anterior antes de iniciar.`);
    process.exit(1);
  }
  console.error('Erro ao iniciar servidor:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled rejection:', reason);
});
