import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import CartItem from '@/components/CartItem';
import { useCarrinho } from '@/context/CarrinhoContext';
import { Produto } from '@/types';

export default function CarrinhoPage() {
  const { carrinho, removerProduto } = useCarrinho();

  const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <>
      <Header />
      <section className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">
            Seu <span className="text-gradient">Carrinho</span>
          </h1>
          <p className="text-gray-500">Revise seus produtos antes de finalizar</p>
        </div>
        {carrinho.length === 0 ? (
          <p className="text-gray-400">Seu carrinho está vazio.</p>
        ) : (
          <>
            <div className="space-y-4">
              {carrinho.map((item) => {
                const produto: Produto = {
                  id: item.id,
                  nome: item.nome,
                  preco: item.preco,
                  imagemUrl: item.imagemUrl ?? '',
                  descricao: item.descricao ?? '',
                  categoriaId: 0,
                  estoque: 0,
                };
                return (
                  <CartItem
                    key={item.id}
                    produto={produto}
                    quantidade={item.quantidade}
                    onRemove={() => removerProduto(item.id)}
                  />
                );
              })}
            </div>
            <div className="mt-8 p-6 card-fitness rounded-xl">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <span className="text-gray-500 text-sm">Total</span>
                  <div className="font-display font-bold text-3xl text-gradient">
                    R$ {total.toFixed(2)}
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="btn-primary text-white px-8 py-4 rounded-lg font-semibold text-lg w-full sm:w-auto text-center"
                >
                  Finalizar Compra →
                </Link>
              </div>
            </div>
          </>
        )}
      </section>
      <Footer />
    </>
  );
}
