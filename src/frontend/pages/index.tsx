import { useEffect, useState } from 'react';
import { Produto } from '@/types';
import { getProdutos } from '@/lib/api';
import ProdutoCard from '@/components/ProdutoCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const banners = [
  { src: '/banner1.jpeg', alt: 'Promoção Café América' },
  { src: '/banner2.png', alt: 'Cápsulas Especiais' },
  { src: '/banner3.png', alt: 'Acessórios para Café' },
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
      <Header />

      {/* Carrossel de banners */}
      <section className="w-full bg-gray-100 flex justify-center items-center">
        <div className="relative w-full max-w-7xl h-56 md:h-96 overflow-hidden rounded-none shadow mb-8">
          {banners.map((banner, idx) => (
            <img
              key={banner.src}
              src={banner.src}
              alt={banner.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === bannerIdx ? 'opacity-100' : 'opacity-0'}`}
              style={{ zIndex: idx === bannerIdx ? 1 : 0 }}
            />
          ))}
          {/* Botões do carrossel */}
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white"
            onClick={() => setBannerIdx((bannerIdx - 1 + banners.length) % banners.length)}
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white"
            onClick={() => setBannerIdx((bannerIdx + 1) % banners.length)}
            aria-label="Próximo"
          >
            ›
          </button>
          {/* Indicadores */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, idx) => (
              <span
                key={idx}
                className={`w-3 h-3 rounded-full ${idx === bannerIdx ? 'bg-yellow-800' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Seção de benefícios */}

      <section className="w-full bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-4">
          {/* Frete Grátis */}
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            {/* Caminhão */}
            <svg width="48" height="48" fill="none" stroke="#4e2e0e" strokeWidth="2.2" viewBox="0 0 48 48">
              <rect x="4" y="16" width="24" height="16" rx="2" />
              <path d="M28 20h8l4 6v6h-4" />
              <circle cx="10" cy="36" r="3" />
              <circle cx="34" cy="36" r="3" />
              <path d="M7 36h27" />
            </svg>
            <div>
              <div className="font-bold text-[#4e2e0e]">Frete Grátis acima de 250,00</div>
              <div className="text-gray-700 text-sm">Para as regiões Sul e Sudeste.</div>
            </div>
          </div>
          {/* Parcele */}
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            {/* Carteira */}
            <svg width="48" height="48" fill="none" stroke="#4e2e0e" strokeWidth="2.2" viewBox="0 0 48 48">
              <rect x="8" y="16" width="32" height="16" rx="3" />
              <circle cx="34" cy="24" r="2" fill="#4e2e0e" />
            </svg>
            <div>
              <div className="font-bold text-[#4e2e0e]">Parcele</div>
              <div className="text-gray-700 text-sm">Parcele em até 5x sem juros</div>
            </div>
          </div>
          {/* Compra Segura */}
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            {/* Escudo */}
            <svg width="48" height="48" fill="none" stroke="#4e2e0e" strokeWidth="2.2" viewBox="0 0 48 48">
              <path d="M24 6l14 6v10c0 10-8 16-14 20-6-4-14-10-14-20V12z" />
              <path d="M18 24l4 4 8-8" />
            </svg>
            <div>
              <div className="font-bold text-[#4e2e0e]">Compra Segura</div>
              <div className="text-gray-700 text-sm">Loja com SSL e proteção de dados</div>
            </div>
          </div>
          {/* Desconto no PIX */}
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            {/* PIX */}
            <svg width="48" height="48" fill="none" stroke="#4e2e0e" strokeWidth="2.2" viewBox="0 0 48 48">
              <rect x="12" y="12" width="24" height="24" rx="8" />
              <path d="M16 24h16M24 16v16" />
            </svg>
            <div>
              <div className="font-bold text-[#4e2e0e]">Desconto no PIX</div>
              <div className="text-gray-700 text-sm">5% de desconto</div>
            </div>
          </div>
        </div>
      </section>     

    
      {/* Produtos em destaque */}
      <section className="w-full bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-500 mb-8">Categorias em destaque</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {/* Categoria 1 */}
            <div className="flex flex-col items-center group cursor-pointer transition-all">
              <div className="w-40 h-40 rounded-full bg-[#ecd8bb] flex items-center justify-center mb-3 shadow transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                {/* Xícara de café */}
                <svg width="72" height="72" fill="none" stroke="#4e2e0e" strokeWidth="2.5" viewBox="0 0 72 72">
                  <ellipse cx="36" cy="50" rx="22" ry="6" />
                  <path d="M18 50V32a2 2 0 0 1 2-2h32a2 2 0 0 1 2 2v18" />
                  <path d="M54 38c6 0 8 8 2 10" />
                  <path d="M32 26c-2-2-2-6 0-8" />
                  <path d="M40 26c-2-2-2-6 0-8" />
                </svg>
              </div>
              <span className="mt-1 text-base font-bold text-[#4e2e0e] group-hover:underline group-hover:text-[#4e2e0e] transition">Café Torrado em Grãos</span>
            </div>
            {/* Categoria 2 */}
            <div className="flex flex-col items-center group cursor-pointer transition-all">
              <div className="w-40 h-40 rounded-full bg-[#ecd8bb] flex items-center justify-center mb-3 shadow transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                {/* Moedor */}
                <svg width="72" height="72" fill="none" stroke="#4e2e0e" strokeWidth="2.5" viewBox="0 0 72 72">
                  <rect x="18" y="38" width="36" height="14" rx="3" />
                  <rect x="26" y="24" width="20" height="14" rx="3" />
                  <path d="M36 24V18" />
                  <circle cx="36" cy="18" r="2" fill="#4e2e0e" />
                </svg>
              </div>
              <span className="mt-1 text-base font-semibold text-gray-500 group-hover:text-[#4e2e0e] group-hover:font-bold transition">Café Torrado em Pó</span>
            </div>
            {/* Categoria 3 */}
            <div className="flex flex-col items-center group cursor-pointer transition-all">
              <div className="w-40 h-40 rounded-full bg-[#ecd8bb] flex items-center justify-center mb-3 shadow transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                {/* Cápsula */}
                <svg width="72" height="72" fill="none" stroke="#4e2e0e" strokeWidth="2.5" viewBox="0 0 72 72">
                  <ellipse cx="36" cy="44" rx="16" ry="8" />
                  <ellipse cx="36" cy="32" rx="16" ry="8" />
                  <ellipse cx="36" cy="32" rx="8" ry="4" />
                </svg>
              </div>
              <span className="mt-1 text-base font-semibold text-gray-500 group-hover:text-[#4e2e0e] group-hover:font-bold transition">Cápsulas de Café</span>
            </div>
            {/* Categoria 4 */}
            <div className="flex flex-col items-center group cursor-pointer transition-all">
              <div className="w-40 h-40 rounded-full bg-[#ecd8bb] flex items-center justify-center mb-3 shadow transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                {/* Cappuccino */}
                <svg width="72" height="72" fill="none" stroke="#4e2e0e" strokeWidth="2.5" viewBox="0 0 72 72">
                  <ellipse cx="36" cy="50" rx="22" ry="6" />
                  <rect x="18" y="32" width="36" height="18" rx="9" />
                  <path d="M54 38c6 0 8 8 2 10" />
                  <path d="M36 32c0-4 8-8 8-12" />
                </svg>
              </div>
              <span className="mt-1 text-base font-semibold text-gray-500 group-hover:text-[#4e2e0e] group-hover:font-bold transition">Cappuccinos</span>
            </div>
            {/* Categoria 5 */}
            <div className="flex flex-col items-center group cursor-pointer transition-all">
              <div className="w-40 h-40 rounded-full bg-[#ecd8bb] flex items-center justify-center mb-3 shadow transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                {/* Solúvel */}
                <svg width="72" height="72" fill="none" stroke="#4e2e0e" strokeWidth="2.5" viewBox="0 0 72 72">
                  <ellipse cx="36" cy="50" rx="22" ry="6" />
                  <path d="M28 32c0-4 8-8 8-12" />
                  <path d="M36 32c0-4-8-8-8-12" />
                  <circle cx="36" cy="32" r="4" />
                  <path d="M36 36v8" />
                </svg>
              </div>
              <span className="mt-1 text-base font-semibold text-gray-500 group-hover:text-[#4e2e0e] group-hover:font-bold transition">Café Solúvel</span>
            </div>
            {/* Categoria 6 */}
            <div className="flex flex-col items-center group cursor-pointer transition-all">
              <div className="w-40 h-40 rounded-full bg-[#ecd8bb] flex items-center justify-center mb-3 shadow transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                {/* Presente */}
                <svg width="72" height="72" fill="none" stroke="#4e2e0e" strokeWidth="2.5" viewBox="0 0 72 72">
                  <rect x="18" y="32" width="36" height="18" rx="4" />
                  <path d="M36 32V50" />
                  <path d="M28 32c0-4 8-8 8-12" />
                  <path d="M44 32c0-4-8-8-8-12" />
                </svg>
              </div>
              <span className="mt-1 text-base font-semibold text-gray-500 group-hover:text-[#4e2e0e] group-hover:font-bold transition">Acessórios para Café</span>
            </div>
          </div>
        </div>
      </section>
      {/* Seção de destaques */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Destaques</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {produtos.slice(0, 3).map(prod => (
            <ProdutoCard key={prod.id} produto={prod} />
          ))}
        </div>
      </section>

      {/* Seção de todos os produtos */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Todos os Produtos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {produtos.map(prod => (
            <ProdutoCard key={prod.id} produto={prod} />
          ))}
        </div>
      </section>

      {/* Seção institucional */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Café América: Tradição e Qualidade</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Há gerações levando o melhor café para sua mesa. Conheça nossa história, nossos produtos e descubra o sabor que conquista o Brasil.
          </p>
        </div>
      </section>

      {/* Kits Especiais */}
      <section className="w-full bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kits Especiais */}
          <div className="relative rounded-xl overflow-hidden shadow flex flex-col justify-end min-h-[340px] bg-gradient-to-br from-[#5a2d0c] to-[#a86c2c]">
            
            <div className="relative z-10 p-8 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-3xl font-bold text-[#ff9800] mb-2">Kits especiais</h3>
                <p className="text-white text-lg mb-6">
                  Surpreenda-se com combinações irresistíveis e aproveite ofertas imperdíveis!
                </p>
                <a
                  href="#"
                  className="inline-block border border-white text-white rounded-full px-6 py-2 font-semibold hover:bg-white hover:text-[#5a2d0c] transition"
                >
                  Garanta já o seu!
                </a>
              </div>
            </div>
          </div>

          {/* Cappuccinos América */}
          <div className="flex flex-col gap-6">
            <div className="relative rounded-xl overflow-hidden shadow min-h-[160px] bg-gradient-to-br from-[#a86c2c] to-[#a86c2c] flex flex-col justify-end">
              <div className="relative z-10 p-6">
                <h4 className="text-xl font-bold text-white mb-1">Cappuccinos América</h4>
                <p className="text-white text-sm mb-4">Perfeitos para quem busca mais sabor e cremosidade.</p>
                <a
                  href="#"
                  className="inline-block border border-white text-white rounded-full px-4 py-1 font-semibold hover:bg-white hover:text-[#a86c2c] transition"
                >
                  Experimente agora!
                </a>
              </div>
            </div>
            {/* Café Expresso */}
            <div className="relative rounded-xl overflow-hidden shadow min-h-[160px] bg-gray-900 flex flex-col justify-end">
              <div className="relative z-10 p-6 flex items-center">
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">Máquina de Café Expresso Spidem Trevi</h4>
                  <p className="text-white text-sm mb-3">
                    O equilíbrio perfeito entre aroma e sabor em cada xícara.
                  </p>
                  <a
                    href="#"
                    className="inline-block bg-white text-gray-900 rounded-full px-4 py-1 font-semibold hover:bg-gray-200 transition"
                  >
                    Compre a sua!
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Café América em cápsulas */}
          <div className="relative rounded-xl overflow-hidden shadow min-h-[160px] bg-gradient-to-br from-[#ecd8bb] to-[#fff3e0] flex flex-col justify-end">
            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
              <div>
                <h4 className="text-xl font-bold text-[#5a2d0c] mb-1">Café América em cápsulas</h4>
                <p className="text-[#5a2d0c] text-sm mb-4">Facilite e dê mais sabor à sua rotina!</p>
                <a
                  href="#"
                  className="inline-block border border-[#5a2d0c] text-[#5a2d0c] rounded-full px-4 py-1 font-semibold hover:bg-[#5a2d0c] hover:text-white transition"
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
