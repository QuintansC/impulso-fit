import path from 'path';

// Aponta para o banco de testes antes de qualquer módulo ser carregado
process.env.DATABASE_URL = `file:${path.join(__dirname, 'prisma', 'test.db')}`;
process.env.JWT_SECRET = 'test_secret_impulsofit';
process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_dummy';
process.env.EMAIL_FROM = 'test@impulsofit.com';
