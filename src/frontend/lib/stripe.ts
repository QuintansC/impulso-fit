import { loadStripe } from '@stripe/stripe-js';

// Chave pública do Stripe (usar variável de ambiente)
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Fallback para chave de teste caso a variável não esteja definida
const testKey = 'pk_test_51HdSGJA1gJf8JqGhC3KZJ1qJgRwJhJgRwJhJgRwJhJgRwJhJgRwJhJgRwJhJgRwJhJgRwJhJgRwJhJgRwJhJgRwJhJgRwJhJgRwJhJgRwJhJgRwJhJgRwJhJgRwJhJgRw';

// Criar a instância do Stripe
const stripePromise = loadStripe(stripePublishableKey || testKey);

console.log('Stripe key configurada:', !!stripePublishableKey);

export default stripePromise;
