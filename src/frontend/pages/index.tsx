import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Produto } from '@/types';
import { getProdutos } from '@/lib/api';
import ProdutoCard from '@/components/ProdutoCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const banners = [
  { src: '/banner1.jpeg', alt: 'Treine com Impulso Fit' },
  { src: '/banner2.png', alt: 'Suplementos e Saúde' },
  { src: '/banner3.png', alt: 'Equipamentos Fitness' },
];

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    getProdutos().then(setProdutos);
  }, []);

  // Carrossel simples automático
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIdx((idx) => (idx + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Impulso Fit | Loja Hardcore Fitness</title>
        <meta name="description" content="Impulso Fit - Suplementos, equipamentos, acessórios e tudo para seu treino hardcore. Energia, força e resultado!" />
        <meta property="og:title" content="Impulso Fit | Loja Hardcore Fitness" />
        <meta property="og:description" content="Impulso Fit - Suplementos, equipamentos, acessórios e tudo para seu treino hardcore." />
        <meta property="og:image" content="/LogoImpulsoFit.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Impulso Fit | Loja Hardcore Fitness" />
        <meta name="twitter:description" content="Impulso Fit - Suplementos, equipamentos, acessórios e tudo para seu treino hardcore." />
        <meta name="twitter:image" content="/LogoImpulsoFit.png" />
        <link rel="canonical" href="https://impulso-fit.up.railway.app/" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      {/* Use <h1> para o título principal */}
      <section className="w-full bg-[#111111] flex justify-center items-center">
        <h1 className="sr-only">Impulso Fit - Loja Hardcore Fitness</h1>
        {/* Carrossel de banners */}
        <div className="relative w-full max-w-7xl h-56 md:h-96 overflow-hidden rounded-none shadow mb-8">
          {banners.map((banner, idx) => (
            <img
              key={banner.src}
              src={banner.src}
              alt={banner.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === bannerIdx ? 'opacity-100' : 'opacity-0'}`}
              style={{ zIndex: idx === bannerIdx ? 1 : 0 }}
              draggable={false}
            />
          ))}
          {/* Botões do carrossel */}
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#b71c1c] rounded-full p-2 shadow hover:bg-white text-white hover:text-[#b71c1c] z-10 border border-[#b71c1c]"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setBannerIdx((bannerIdx - 1 + banners.length) % banners.length);
            }}
            tabIndex={0}
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#b71c1c] rounded-full p-2 shadow hover:bg-white text-white hover:text-[#b71c1c] z-10 border border-[#b71c1c]"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setBannerIdx((bannerIdx + 1) % banners.length);
            }}
            tabIndex={0}
            aria-label="Próximo"
          >
            ›
          </button>
          {/* Indicadores */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, idx) => (
              <span
                key={idx}
                className={`w-3 h-3 rounded-full ${idx === bannerIdx ? 'bg-[#b71c1c]' : 'bg-white border border-[#b71c1c]'}`}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Seção de benefícios */}
      <section className="w-full bg-[#111111] py-4 border-b border-[#b71c1c]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-4">
          {/* Frete Grátis */}
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            {/* Caminhão/Entrega */}
            <svg width="48" height="48" fill="none" stroke="#b71c1c" strokeWidth="2.2" viewBox="0 0 48 48">
              <rect x="4" y="16" width="24" height="16" rx="2" />
              <path d="M28 20h8l4 6v6h-4" />
              <circle cx="10" cy="36" r="3" />
              <circle cx="34" cy="36" r="3" />
              <path d="M7 36h27" />
            </svg>
            <div>
              <div className="font-bold text-[#b71c1c]">Frete Grátis acima de R$250</div>
              <div className="text-white text-sm">Para todo Brasil.</div>
            </div>
          </div>
          {/* Parcele */}
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            {/* Carteira */}
            <svg width="48" height="48" fill="none" stroke="#b71c1c" strokeWidth="2.2" viewBox="0 0 48 48">
              <rect x="8" y="16" width="32" height="16" rx="3" />
              <circle cx="34" cy="24" r="2" fill="#b71c1c" />
            </svg>
            <div>
              <div className="font-bold text-[#b71c1c]">Parcele</div>
              <div className="text-white text-sm">Em até 5x sem juros</div>
            </div>
          </div>
          {/* Compra Segura */}
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            {/* Escudo */}
            <svg width="48" height="48" fill="none" stroke="#b71c1c" strokeWidth="2.2" viewBox="0 0 48 48">
              <path d="M24 6l14 6v10c0 10-8 16-14 20-6-4-14-10-14-20V12z" />
              <path d="M18 24l4 4 8-8" />
            </svg>
            <div>
              <div className="font-bold text-[#b71c1c]">Compra Segura</div>
              <div className="text-white text-sm">Site protegido e seguro</div>
            </div>
          </div>
          {/* Desconto no PIX */}
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            {/* PIX */}
            <svg width="48" height="48" fill="none" stroke="#b71c1c" strokeWidth="2.2" viewBox="0 0 48 48">
              <rect x="12" y="12" width="24" height="24" rx="8" />
              <path d="M16 24h16M24 16v16" />
            </svg>
            <div>
              <div className="font-bold text-[#b71c1c]">Desconto no PIX</div>
              <div className="text-white text-sm">5% de desconto</div>
            </div>
          </div>
        </div>
      </section>

    
      {/* Categorias em destaque */}
      <section className="w-full bg-[#111111] py-10 border-b border-[#b71c1c]">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <h2 className="text-lg md:text-2xl font-semibold text-[#b71c1c] mb-6 md:mb-8 text-center md:text-left">
            Categorias em destaque
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap justify-center gap-4 md:gap-8">
            {/* Categoria 1 */}
            <div className="flex flex-col items-center group cursor-pointer transition-all">
              <div className="w-20 h-20 md:w-40 md:h-40 rounded-full bg-[#111111] flex items-center justify-center mb-2 md:mb-3 shadow transition-transform duration-300 group-hover:scale-105 group-active:scale-95 border-2 border-[#b71c1c]">
                {/* Suplementos */}
                <svg width="72" height="72" fill="none" stroke="#b71c1c" strokeWidth="2.5" viewBox="0 0 72 72">
                  <rect x="20" y="20" width="32" height="32" rx="8" />
                  <rect x="28" y="32" width="16" height="8" rx="2" />
                </svg>
              </div>
              <span className="mt-1 text-xs md:text-base font-bold text-white group-hover:underline group-hover:text-[#b71c1c] transition text-center">
                Suplementos
              </span>
            </div>
            {/* Categoria 2 */}
            <div className="flex flex-col items-center group cursor-pointer transition-all">
              <div className="w-20 h-20 md:w-40 md:h-40 rounded-full bg-[#111111] flex items-center justify-center mb-2 md:mb-3 shadow transition-transform duration-300 group-hover:scale-105 group-active:scale-95 border-2 border-[#b71c1c]">
                {/* Equipamentos */}
                <svg width="72" height="72" fill="none" stroke="#b71c1c" strokeWidth="2.5" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="20" />
                  <rect x="32" y="20" width="8" height="32" rx="2" />
                </svg>
              </div>
              <span className="mt-1 text-xs md:text-base font-bold text-white group-hover:underline group-hover:text-[#b71c1c] transition text-center">
                Equipamentos
              </span>
            </div>
            {/* Categoria 3 */}
            <div className="flex flex-col items-center group cursor-pointer transition-all">
              <div className="w-20 h-20 md:w-40 md:h-40 rounded-full bg-[#111111] flex items-center justify-center mb-2 md:mb-3 shadow transition-transform duration-300 group-hover:scale-105 group-active:scale-95 border-2 border-[#b71c1c]">
                {/* Roupas */}
                <svg width="72" height="72" fill="none" stroke="#b71c1c" strokeWidth="2.5" viewBox="0 0 72 72">
                  <rect x="20" y="32" width="32" height="16" rx="4" />
                  <path d="M36 32V20" />
                </svg>
              </div>
              <span className="mt-1 text-xs md:text-base font-bold text-white group-hover:underline group-hover:text-[#b71c1c] transition text-center">
                Roupas Fitness
              </span>
            </div>
            {/* Categoria 4 */}
            <div className="flex flex-col items-center group cursor-pointer transition-all">
              <div className="w-20 h-20 md:w-40 md:h-40 rounded-full bg-[#111111] flex items-center justify-center mb-2 md:mb-3 shadow transition-transform duration-300 group-hover:scale-105 group-active:scale-95 border-2 border-[#b71c1c]">
                {/* Acessórios */}
                <svg width="72" height="72" fill="none" stroke="#b71c1c" strokeWidth="2.5" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="12" />
                  <rect x="32" y="24" width="8" height="24" rx="2" />
                </svg>
              </div>
              <span className="mt-1 text-xs md:text-base font-bold text-white group-hover:underline group-hover:text-[#b71c1c] transition text-center">
                Acessórios
              </span>
            </div>
            {/* Categoria 5 */}
            <div className="flex flex-col items-center group cursor-pointer transition-all">
              <div className="w-20 h-20 md:w-40 md:h-40 rounded-full bg-[#111111] flex items-center justify-center mb-2 md:mb-3 shadow transition-transform duration-300 group-hover:scale-105 group-active:scale-95 border-2 border-[#b71c1c]">
                {/* Nutrição */}
                <svg width="72" height="72" fill="none" stroke="#b71c1c" strokeWidth="2.5" viewBox="0 0 72 72">
                  <ellipse cx="36" cy="50" rx="22" ry="6" />
                  <rect x="18" y="32" width="36" height="18" rx="9" />
                </svg>
              </div>
              <span className="mt-1 text-xs md:text-base font-bold text-white group-hover:underline group-hover:text-[#b71c1c] transition text-center">
                Nutrição
              </span>
            </div>
            {/* Categoria 6 */}
            <div className="flex flex-col items-center group cursor-pointer transition-all">
              <div className="w-20 h-20 md:w-40 md:h-40 rounded-full bg-[#111111] flex items-center justify-center mb-2 md:mb-3 shadow transition-transform duration-300 group-hover:scale-105 group-active:scale-95 border-2 border-[#b71c1c]">
                {/* Presentes */}
                <svg width="72" height="72" fill="none" stroke="#b71c1c" strokeWidth="2.5" viewBox="0 0 72 72">
                  <rect x="18" y="32" width="36" height="18" rx="4" />
                  <path d="M36 32V50" />
                  <path d="M28 32c0-4 8-8 8-12" />
                  <path d="M44 32c0-4-8-8-8-12" />
                </svg>
              </div>
              <span className="mt-1 text-xs md:text-base font-bold text-white group-hover:underline group-hover:text-[#b71c1c] transition text-center">
                Presentes Fit
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* Seção de destaques */}
      <section className="max-w-7xl mx-auto px-4 mb-10 bg-[#111111] rounded-xl border border-[#b71c1c]">
        <h2 className="text-xl font-bold mb-4 text-white bg-[#b71c1c] px-4 py-2 rounded">Destaques</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {produtos.slice(0, 3).map(prod => (
            <ProdutoCard key={prod.id} produto={prod} />
          ))}
        </div>
      </section>

      {/* Seção de todos os produtos */}
      <section className="max-w-7xl mx-auto px-4 mb-10 bg-[#111111] rounded-xl border border-[#b71c1c]">
        <h2 className="text-xl font-bold mb-4 text-white bg-[#111111] px-4 py-2 rounded border border-[#b71c1c]">Todos os Produtos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {produtos.map(prod => (
            <ProdutoCard key={prod.id} produto={prod} />
          ))}
        </div>
      </section>

      {/* Seção institucional */}
      <section className="bg-[#111111] py-10 border-b border-[#b71c1c]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2 text-[#b71c1c]">Impulso Fit: Saúde, Energia e Bem-estar</h2>
          <p className="text-white max-w-2xl mx-auto">
            Transforme sua rotina com produtos, dicas e equipamentos para uma vida mais ativa e saudável. Venha fazer parte do movimento Impulso Fit!
          </p>
        </div>
      </section>

      {/* Kits Especiais */}
      <section className="w-full bg-[#111111] py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kits Especiais */}
          <div className="relative rounded-xl overflow-hidden shadow flex flex-col justify-end min-h-[340px] bg-gradient-to-br from-[#111111] to-[#b71c1c] border border-[#b71c1c]">
            <div className="relative z-10 p-8 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">Kits especiais</h3>
                <p className="text-white text-lg mb-6">
                  Surpreenda-se com combinações irresistíveis e aproveite ofertas imperdíveis!
                </p>
                <a
                  href="#"
                  className="inline-block border border-[#b71c1c] text-white rounded-full px-6 py-2 font-semibold hover:bg-[#b71c1c] hover:text-white transition"
                >
                  Garanta já o seu!
                </a>
              </div>
            </div>
          </div>

          {/* Cappuccinos América */}
          <div className="flex flex-col gap-6">
            <div className="relative rounded-xl overflow-hidden shadow min-h-[160px] bg-gradient-to-br from-[#111111] to-[#b71c1c] flex flex-col justify-end border border-[#b71c1c]">
              <div className="relative z-10 p-6">
                <h4 className="text-xl font-bold text-white mb-1">Cappuccinos América</h4>
                <p className="text-white text-sm mb-4">Perfeitos para quem busca mais sabor e cremosidade.</p>
                <a
                  href="#"
                  className="inline-block border border-[#b71c1c] text-white rounded-full px-4 py-1 font-semibold hover:bg-[#b71c1c] hover:text-white transition"
                >
                  Experimente agora!
                </a>
              </div>
            </div>
            {/* Café Expresso */}
            <div className="relative rounded-xl overflow-hidden shadow min-h-[160px] bg-[#111111] flex flex-col justify-end border border-[#b71c1c]">
              <div className="relative z-10 p-6 flex items-center">
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">Máquina de Café Expresso Spidem Trevi</h4>
                  <p className="text-white text-sm mb-3">
                    O equilíbrio perfeito entre aroma e sabor em cada xícara.
                  </p>
                  <a
                    href="#"
                    className="inline-block bg-[#b71c1c] text-white rounded-full px-4 py-1 font-semibold hover:bg-white hover:text-[#b71c1c] transition border border-[#b71c1c]"
                  >
                    Compre a sua!
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Café América em cápsulas */}
          <div className="relative rounded-xl overflow-hidden shadow min-h-[160px] bg-gradient-to-br from-[#111111] to-[#b71c1c] flex flex-col justify-end border border-[#b71c1c]">
            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
              <div>
                <h4 className="text-xl font-bold text-white mb-1">Café América em cápsulas</h4>
                <p className="text-white text-sm mb-4">Facilite e dê mais sabor à sua rotina!</p>
                <a
                  href="#"
                  className="inline-block border border-[#b71c1c] text-white rounded-full px-4 py-1 font-semibold hover:bg-[#b71c1c] hover:text-white transition"
                >
                  Peça já!
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
