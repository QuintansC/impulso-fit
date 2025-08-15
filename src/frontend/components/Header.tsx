import Link from 'next/link';
import { ShoppingCart, User, Heart, Menu, X } from 'lucide-react';
import { useCarrinho } from '@/context/CarrinhoContext';
import { useState } from 'react';

export default function Header() {
  const { carrinho } = useCarrinho();
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="bg-[#111111] border-b border-[#b71c1c] shadow">
      {/* Barra principal */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img src="/LogoImpulsoFit.png" alt="Impulso Fit" className="h-14 md:h-16" />
          <span className="font-bold text-2xl hidden md:inline tracking-wide">
            <span className="text-[#b71c1c]">Impulso</span> <span className="text-white">Fit</span>
          </span>
        </Link>
        {/* Busca (esconde no mobile) */}
        <div className="flex-1 flex justify-center my-2 md:my-0 w-full md:w-auto">
          <input
            type="text"
            placeholder="Busque por suplementos, equipamentos..."
            className="w-full max-w-md px-4 py-2 border border-[#b71c1c] rounded focus:outline-none focus:ring-2 focus:ring-[#b71c1c] bg-[#222] text-white placeholder:text-[#b71c1c] hidden sm:block"
          />
        </div>
        {/* Ícones à direita (desktop) */}
        <div className="items-center space-x-6 hidden md:flex">
          <Link href="/login" className="flex items-center gap-1 text-white hover:text-[#b71c1c]">
            <User size={24} />
            <span className="hidden md:inline font-semibold">Entrar</span>
          </Link>
          <Link href="#" className="flex items-center gap-1 text-white hover:text-[#b71c1c]">
            <Heart size={24} />
            <span className="hidden md:inline font-semibold">Favoritos</span>
          </Link>
          <Link href="/carrinho" className="relative flex items-center group text-white hover:text-[#b71c1c]">
            <ShoppingCart size={28} />
            <span className="absolute -top-2 -right-2 text-xs bg-[#b71c1c] text-white rounded-full px-2 py-0.5 font-bold">
              {carrinho.length}
            </span>
            <span className="ml-2 text-white font-semibold hidden md:inline">Carrinho</span>
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
      <div className="bg-[#181818] border-b border-[#b71c1c] hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center px-4 py-2 space-x-4 relative">
          <div
            className="flex items-center gap-2 text-white font-semibold hover:text-[#b71c1c] cursor-pointer select-none relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            tabIndex={0}
          >
            <Menu size={20} />
            Todos os Departamentos
            {/* Submenu */}
            {open && (
              <div
                className="absolute left-0 top-full mt-2 w-56 bg-[#222] border border-[#b71c1c] rounded shadow-lg z-20"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <Link href="#" className="block px-4 py-2 hover:bg-[#b71c1c] text-white">Suplementos</Link>
                <Link href="#" className="block px-4 py-2 hover:bg-[#b71c1c] text-white">Equipamentos</Link>
                <Link href="#" className="block px-4 py-2 hover:bg-[#b71c1c] text-white">Roupas Fitness</Link>
                <Link href="#" className="block px-4 py-2 hover:bg-[#b71c1c] text-white">Acessórios</Link>
                <Link href="#" className="block px-4 py-2 hover:bg-[#b71c1c] text-white">Presentes Fit</Link>
              </div>
            )}
          </div>
          <Link href="#" className="text-white hover:text-[#b71c1c] text-sm">Suplementos</Link>
          <Link href="#" className="text-white hover:text-[#b71c1c] text-sm">Equipamentos</Link>
          <Link href="#" className="text-white hover:text-[#b71c1c] text-sm">Roupas Fitness</Link>
          <Link href="#" className="text-white hover:text-[#b71c1c] text-sm">Acessórios</Link>
          <Link href="#" className="text-white hover:text-[#b71c1c] text-sm">Presentes Fit</Link>
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
          <nav className="relative bg-white w-72 max-w-full h-full shadow-lg z-50 p-6 flex flex-col">
            <button
              className="absolute top-4 right-4 text-gray-700"
              onClick={() => setMobileMenu(false)}
              aria-label="Fechar menu"
            >
              <X size={28} />
            </button>
            <Link href="/" className="flex items-center space-x-2 mb-8" onClick={() => setMobileMenu(false)}>
              <img src="/logo.jpg" alt="Café América" className="h-12" />
              <span className="font-bold text-xl text-gray-800">Café América</span>
            </Link>
            <input
              type="text"
              placeholder="O que você procura?"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white mb-6"
            />
            <Link href="/login" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 py-2" onClick={() => setMobileMenu(false)}>
              <User size={22} />
              <span className="font-semibold">Entrar</span>
            </Link>
            <Link href="#" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 py-2" onClick={() => setMobileMenu(false)}>
              <Heart size={22} />
              <span className="font-semibold">Favoritos</span>
            </Link>
            <Link href="/carrinho" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 py-2" onClick={() => setMobileMenu(false)}>
              <ShoppingCart size={22} />
              <span className="font-semibold">Carrinho</span>
              {carrinho.length > 0 && (
                <span className="ml-2 text-xs bg-gray-800 text-white rounded-full px-2 py-0.5 font-bold">
                  {carrinho.length}
                </span>
              )}
            </Link>
            <hr className="my-4" />
            <span className="text-gray-500 font-semibold mb-2">Departamentos</span>
            <Link href="#" className="block py-2 text-gray-700 hover:text-gray-900" onClick={() => setMobileMenu(false)}>Cafés Tradicionais</Link>
            <Link href="#" className="block py-2 text-gray-700 hover:text-gray-900" onClick={() => setMobileMenu(false)}>Cafés Especiais</Link>
            <Link href="#" className="block py-2 text-gray-700 hover:text-gray-900" onClick={() => setMobileMenu(false)}>Cápsulas</Link>
            <Link href="#" className="block py-2 text-gray-700 hover:text-gray-900" onClick={() => setMobileMenu(false)}>Acessórios</Link>
            <Link href="#" className="block py-2 text-gray-700 hover:text-gray-900" onClick={() => setMobileMenu(false)}>Promoções</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
