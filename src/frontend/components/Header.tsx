import Link from 'next/link';
import { ShoppingCart, User, Heart, Menu, X } from 'lucide-react';
import { useCarrinho } from '@/context/CarrinhoContext';
import { useState } from 'react';

export default function Header() {
  const { carrinho } = useCarrinho();
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="bg-dark-card border-b border-primary/10 shadow-lg sticky top-0 z-50 glass-effect">
      {/* Barra principal */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
            <img src="/LogoImpulsoFit.png" alt="Impulso Fit" className="h-14 md:h-16 transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-10 rounded-full blur-xl transition-opacity"></div>
          </div>
          <span className="font-display font-bold text-2xl hidden md:inline tracking-wide">
            <span className="text-gradient">Impulso</span> <span className="text-white">Fit</span>
          </span>
        </Link>
        {/* Busca (esconde no mobile) */}
        <div className="flex-1 flex justify-center my-2 md:my-0 w-full md:w-auto">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Busque por suplementos, equipamentos..."
              className="w-full px-4 py-2.5 pl-10 border border-primary/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-dark-light text-white placeholder:text-gray-500 hidden sm:block transition-all"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        {/* Ícones à direita (desktop) */}
        <div className="items-center space-x-4 hidden md:flex">
          <Link href="/login" className="flex items-center gap-2 text-white hover:text-primary transition-colors group">
            <div className="p-2 rounded-lg bg-dark-light group-hover:bg-primary/10 transition-colors">
              <User size={20} />
            </div>
            <span className="hidden lg:inline font-semibold">Entrar</span>
          </Link>
          <Link href="#" className="flex items-center gap-2 text-white hover:text-secondary transition-colors group">
            <div className="p-2 rounded-lg bg-dark-light group-hover:bg-secondary/20 transition-colors">
              <Heart size={20} />
            </div>
            <span className="hidden lg:inline font-semibold">Favoritos</span>
          </Link>
          <Link href="/carrinho" className="relative flex items-center gap-2 text-white hover:text-primary transition-colors group">
            <div className="relative p-2 rounded-lg bg-dark-light group-hover:bg-primary/10 transition-colors">
              <ShoppingCart size={20} />
              {carrinho.length > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-gradient-to-r from-primary to-secondary text-white rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                  {carrinho.length}
                </span>
              )}
            </div>
            <span className="hidden lg:inline font-semibold">Carrinho</span>
          </Link>
        </div>
        {/* Botão menu mobile */}
        <button
          className="md:hidden ml-auto text-white hover:text-[#b71c1c]"
          onClick={() => setMobileMenu(true)}
          aria-label="Abrir menu"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Todos os Departamentos com submenu (desktop) */}
      <div className="bg-dark-light/50 border-b border-primary/10 hidden md:block backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center px-4 py-3 space-x-6 relative">
          <div
            className="flex items-center gap-2 text-white font-semibold hover:text-primary cursor-pointer select-none relative transition-colors group"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            tabIndex={0}
          >
            <div className="p-1.5 rounded bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Menu size={18} />
            </div>
            <span>Todos os Departamentos</span>
            {/* Submenu */}
            {open && (
              <div
                className="absolute left-0 top-full mt-2 w-64 bg-dark-card border border-primary/15 rounded-lg shadow-xl z-20 overflow-hidden backdrop-blur-lg"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <Link href="#" className="block px-4 py-3 hover:bg-primary/10 text-white transition-colors border-b border-primary/5 last:border-0">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Suplementos
                  </span>
                </Link>
                <Link href="#" className="block px-4 py-3 hover:bg-primary/10 text-white transition-colors border-b border-primary/5 last:border-0">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Equipamentos
                  </span>
                </Link>
                <Link href="#" className="block px-4 py-3 hover:bg-primary/10 text-white transition-colors border-b border-primary/5 last:border-0">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    Roupas Fitness
                  </span>
                </Link>
                <Link href="#" className="block px-4 py-3 hover:bg-primary/10 text-white transition-colors border-b border-primary/5 last:border-0">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Acessórios
                  </span>
                </Link>
                <Link href="#" className="block px-4 py-3 hover:bg-primary/10 text-white transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Presentes Fit
                  </span>
                </Link>
              </div>
            )}
          </div>
          <Link href="#" className="text-white hover:text-primary text-sm font-medium transition-colors">Suplementos</Link>
          <Link href="#" className="text-white hover:text-primary text-sm font-medium transition-colors">Equipamentos</Link>
          <Link href="#" className="text-white hover:text-primary text-sm font-medium transition-colors">Roupas Fitness</Link>
          <Link href="#" className="text-white hover:text-primary text-sm font-medium transition-colors">Acessórios</Link>
          <Link href="#" className="text-white hover:text-primary text-sm font-medium transition-colors">Presentes Fit</Link>
        </div>
      </div>

      {/* Drawer Mobile */}
      {mobileMenu && (
        <div className="fixed inset-0 z-40 flex">
          {/* Fundo escuro */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={() => setMobileMenu(false)}
          />
          {/* Menu lateral */}
          <nav className="relative bg-[#111111] w-72 max-w-full h-full shadow-lg z-50 p-6 flex flex-col border-r border-[#b71c1c]">
            <button
              className="absolute top-4 right-4 text-white hover:text-[#b71c1c]"
              onClick={() => setMobileMenu(false)}
              aria-label="Fechar menu"
            >
              <X size={28} />
            </button>
            <Link href="/" className="flex items-center space-x-2 mb-8" onClick={() => setMobileMenu(false)}>
              <img src="/LogoImpulsoFit.png" alt="Impulso Fit" className="h-12" />
              <span className="font-bold text-xl">
                <span className="text-[#b71c1c]">Impulso</span> <span className="text-white">Fit</span>
              </span>
            </Link>
            <input
              type="text"
              placeholder="O que você procura?"
              className="w-full px-4 py-2 border border-[#b71c1c] rounded focus:outline-none focus:ring-2 focus:ring-[#b71c1c] bg-[#222] text-white placeholder:text-[#b71c1c] mb-6"
            />
            <Link href="/login" className="flex items-center gap-2 text-white hover:text-[#b71c1c] py-2" onClick={() => setMobileMenu(false)}>
              <User size={22} />
              <span className="font-semibold">Entrar</span>
            </Link>
            <Link href="#" className="flex items-center gap-2 text-white hover:text-[#b71c1c] py-2" onClick={() => setMobileMenu(false)}>
              <Heart size={22} />
              <span className="font-semibold">Favoritos</span>
            </Link>
            <Link href="/carrinho" className="flex items-center gap-2 text-white hover:text-[#b71c1c] py-2" onClick={() => setMobileMenu(false)}>
              <ShoppingCart size={22} />
              <span className="font-semibold">Carrinho</span>
              {carrinho.length > 0 && (
                <span className="ml-2 text-xs bg-[#b71c1c] text-white rounded-full px-2 py-0.5 font-bold">
                  {carrinho.length}
                </span>
              )}
            </Link>
            <hr className="my-4 border-[#b71c1c]" />
            <span className="text-[#b71c1c] font-semibold mb-2">Departamentos</span>
            <Link href="#" className="block py-2 text-white hover:text-[#b71c1c]" onClick={() => setMobileMenu(false)}>Suplementos</Link>
            <Link href="#" className="block py-2 text-white hover:text-[#b71c1c]" onClick={() => setMobileMenu(false)}>Equipamentos</Link>
            <Link href="#" className="block py-2 text-white hover:text-[#b71c1c]" onClick={() => setMobileMenu(false)}>Roupas Fitness</Link>
            <Link href="#" className="block py-2 text-white hover:text-[#b71c1c]" onClick={() => setMobileMenu(false)}>Acessórios</Link>
            <Link href="#" className="block py-2 text-white hover:text-[#b71c1c]" onClick={() => setMobileMenu(false)}>Presentes Fit</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
