import { useState } from 'react';
import Head from 'next/head';

export default function CheckoutPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [finalizado, setFinalizado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você enviaria para um backend real
    setFinalizado(true);
    localStorage.removeItem('carrinho');
  };

  return (
    <>
      <Head>
        <title>Checkout | Café América</title>
      </Head>

      <section className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>

        {finalizado ? (
          <div className="text-green-600 font-medium">
            Pedido realizado com sucesso! Obrigado pela sua compra. ☕
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full border p-2 rounded"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Endereço de entrega"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            ></textarea>
            <button
              type="submit"
              className="bg-yellow-800 text-white w-full py-2 rounded hover:bg-yellow-900"
            >
              Confirmar Pedido
            </button>
          </form>
        )}
      </section>
    </>
  );
}
