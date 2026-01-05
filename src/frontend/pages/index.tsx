import Head from 'next/head';
import Link from 'next/link';
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

      {/* Hero Section */}
      <section className="w-full relative overflow-hidden">
        <h1 className="sr-only">Impulso Fit - Loja Hardcore Fitness</h1>
        {/* Carrossel de banners */}
        <div className="relative w-full max-w-7xl mx-auto h-64 md:h-[500px] overflow-hidden rounded-2xl m-4 md:m-8 shadow-2xl">
          {banners.map((banner, idx) => (
            <div key={banner.src} className={`absolute inset-0 transition-opacity duration-1000 ${idx === bannerIdx ? 'opacity-100' : 'opacity-0'}`} style={{ zIndex: idx === bannerIdx ? 1 : 0 }}>
              <img
                src={banner.src}
                alt={banner.alt}
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/50 to-transparent"></div>
            </div>
          ))}
          
          {/* Botões do carrossel */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-dark-card/80 backdrop-blur-md rounded-full p-3 shadow-xl hover:bg-primary/80 text-white hover:text-white z-20 border border-primary/20 transition-all hover:scale-110"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setBannerIdx((bannerIdx - 1 + banners.length) % banners.length);
            }}
            tabIndex={0}
            aria-label="Anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-dark-card/80 backdrop-blur-md rounded-full p-3 shadow-xl hover:bg-primary/80 text-white hover:text-white z-20 border border-primary/20 transition-all hover:scale-110"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setBannerIdx((bannerIdx + 1) % banners.length);
            }}
            tabIndex={0}
            aria-label="Próximo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Indicadores */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setBannerIdx(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === bannerIdx 
                    ? 'w-8 bg-gradient-to-r from-primary/80 to-secondary/80' 
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Ir para banner ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Seção de benefícios */}
      <section className="w-full py-8 md:py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {/* Frete Grátis */}
          <div className="card-fitness p-6 rounded-xl text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 mb-4 group-hover:scale-110 transition-transform">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="font-display font-bold text-primary text-lg mb-1">Frete Grátis</div>
            <div className="text-gray-500 text-sm">Acima de R$250 para todo Brasil</div>
          </div>
          
          {/* Parcele */}
          <div className="card-fitness p-6 rounded-xl text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-secondary/15 to-secondary/5 mb-4 group-hover:scale-110 transition-transform">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-secondary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="font-display font-bold text-secondary text-lg mb-1">Parcele em até 5x</div>
            <div className="text-gray-500 text-sm">Sem juros no cartão</div>
          </div>
          
          {/* Compra Segura */}
          <div className="card-fitness p-6 rounded-xl text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent/15 to-accent/5 mb-4 group-hover:scale-110 transition-transform">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-accent">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="font-display font-bold text-accent text-lg mb-1">Compra Segura</div>
            <div className="text-gray-500 text-sm">Site 100% protegido</div>
          </div>
          
          {/* Desconto no PIX */}
          <div className="card-fitness p-6 rounded-xl text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 mb-4 group-hover:scale-110 transition-transform">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div className="font-display font-bold text-gradient text-lg mb-1">5% OFF no PIX</div>
            <div className="text-gray-500 text-sm">Pagamento à vista</div>
          </div>
        </div>
      </section>

    
      {/* Categorias em destaque */}
      <section className="w-full py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              <span className="text-gradient">Categorias</span> em Destaque
            </h2>
            <p className="text-gray-500">Tudo que você precisa para alcançar seus objetivos</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Categoria 1 */}
            <Link href="#" className="flex flex-col items-center group cursor-pointer">
              <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-primary/12 to-primary/5 flex items-center justify-center mb-4 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl border border-primary/15 card-fitness">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <span className="text-sm md:text-base font-semibold text-white group-hover:text-gradient transition text-center">
                Suplementos
              </span>
            </Link>
            {/* Categoria 2 */}
            <Link href="#" className="flex flex-col items-center group cursor-pointer">
              <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-secondary/12 to-secondary/5 flex items-center justify-center mb-4 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl border border-secondary/15 card-fitness">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-secondary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm md:text-base font-semibold text-white group-hover:text-gradient transition text-center">
                Equipamentos
              </span>
            </Link>
            {/* Categoria 3 */}
            <Link href="#" className="flex flex-col items-center group cursor-pointer">
              <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-accent/12 to-accent/5 flex items-center justify-center mb-4 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl border border-accent/15 card-fitness">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-accent">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm md:text-base font-semibold text-white group-hover:text-gradient transition text-center">
                Roupas Fitness
              </span>
            </Link>
            {/* Categoria 4 */}
            <Link href="#" className="flex flex-col items-center group cursor-pointer">
              <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-primary/12 to-accent/12 flex items-center justify-center mb-4 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl border border-primary/15 card-fitness">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <span className="text-sm md:text-base font-semibold text-white group-hover:text-gradient transition text-center">
                Acessórios
              </span>
            </Link>
            {/* Categoria 5 */}
            <Link href="#" className="flex flex-col items-center group cursor-pointer">
              <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-secondary/12 to-primary/12 flex items-center justify-center mb-4 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl border border-secondary/15 card-fitness">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-secondary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <span className="text-sm md:text-base font-semibold text-white group-hover:text-gradient transition text-center">
                Nutrição
              </span>
            </Link>
            {/* Categoria 6 */}
            <Link href="#" className="flex flex-col items-center group cursor-pointer">
              <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-accent/12 to-secondary/12 flex items-center justify-center mb-4 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl border border-accent/15 card-fitness">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-accent">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <span className="text-sm md:text-base font-semibold text-white group-hover:text-gradient transition text-center">
                Presentes Fit
              </span>
            </Link>
          </div>
        </div>
      </section>
      {/* Seção de destaques */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Produtos em <span className="text-gradient">Destaque</span>
          </h2>
            <p className="text-gray-500">Selecionados especialmente para você</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {produtos.slice(0, 4).map(prod => (
            <ProdutoCard key={prod.id} produto={prod} />
          ))}
        </div>
      </section>

      {/* Seção de todos os produtos */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Todos os <span className="text-gradient">Produtos</span>
          </h2>
            <p className="text-gray-500">Explore nossa linha completa</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {produtos.map(prod => (
            <ProdutoCard key={prod.id} produto={prod} />
          ))}
        </div>
      </section>

      {/* Seção institucional */}
      <section className="py-16 bg-gradient-to-br from-dark-card to-dark-light rounded-3xl mx-4 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-gradient">Impulso Fit: Saúde, Energia e Bem-estar</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Transforme sua rotina com produtos, dicas e equipamentos para uma vida mais ativa e saudável. 
            Venha fazer parte do movimento <span className="text-primary font-semibold">Impulso Fit</span>!
          </p>
        </div>
      </section>

      {/* Kits Especiais */}
      <section className="w-full py-12 mb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              <span className="text-gradient">Kits Especiais</span>
            </h2>
            <p className="text-gray-500">Combinações perfeitas para potencializar seus resultados</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kits Especiais - Destaque */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-end min-h-[400px] gradient-primary group cursor-pointer opacity-90">
              <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/20 transition-colors"></div>
              <div className="relative z-10 p-8">
                <h3 className="font-display text-3xl font-bold text-white mb-3">Kits Especiais</h3>
                <p className="text-white/90 text-lg mb-6">
                  Surpreenda-se com combinações irresistíveis e aproveite ofertas imperdíveis!
                </p>
                <a
                  href="#"
                  className="inline-block bg-white text-primary rounded-full px-6 py-3 font-semibold hover:bg-gray-100 transition transform hover:scale-105"
                >
                  Garanta já o seu! →
                </a>
              </div>
            </div>

            {/* Suplementos em Destaque */}
            <div className="flex flex-col gap-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl min-h-[190px] gradient-secondary flex flex-col justify-end group cursor-pointer opacity-90">
                <div className="absolute inset-0 bg-dark/30 group-hover:bg-dark/15 transition-colors"></div>
                <div className="relative z-10 p-6">
                  <h4 className="font-display text-xl font-bold text-white mb-2">Suplementos Premium</h4>
                  <p className="text-white/90 text-sm mb-4">Alta qualidade para resultados excepcionais.</p>
                  <a
                    href="#"
                    className="inline-block bg-white text-secondary rounded-full px-4 py-2 font-semibold hover:bg-gray-100 transition transform hover:scale-105 text-sm"
                  >
                    Experimente agora! →
                  </a>
                </div>
              </div>
              {/* Equipamentos */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl min-h-[190px] card-fitness flex flex-col justify-end group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-secondary/8 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 p-6">
                  <h4 className="font-display text-xl font-bold text-white mb-2">Equipamentos Profissionais</h4>
                  <p className="text-gray-300 text-sm mb-4">
                    Transforme seu treino com equipamentos de alta performance.
                  </p>
                  <a
                    href="#"
                    className="inline-block btn-primary text-white rounded-full px-4 py-2 font-semibold text-sm"
                  >
                    Compre a sua! →
                  </a>
                </div>
              </div>
            </div>

            {/* Acessórios Fitness */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl min-h-[400px] bg-gradient-to-br from-accent/70 to-accent/50 flex flex-col justify-end group cursor-pointer opacity-90">
              <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/20 transition-colors"></div>
              <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                <div>
                  <h4 className="font-display text-2xl font-bold text-dark mb-2">Acessórios Fitness</h4>
                  <p className="text-dark/80 text-base mb-6">Complete seu treino com os melhores acessórios!</p>
                  <a
                    href="#"
                    className="inline-block bg-dark text-accent rounded-full px-6 py-3 font-semibold hover:bg-dark-light transition transform hover:scale-105"
                  >
                    Peça já! →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
