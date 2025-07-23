import Link from 'next/link';
import { ShoppingCart, User, Heart, Menu } from 'lucide-react';
import { useCarrinho } from '@/context/CarrinhoContext';
import { useState } from 'react';

export default function Header() {
  const { carrinho } = useCarrinho();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 shadow">
      {/* Barra principal */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.jpg" alt="Café América" className="h-14 md:h-16" />
          <span className="font-bold text-2xl text-gray-800 hidden md:inline">Café América</span>
        </Link>
        {/* Busca */}
        <div className="flex-1 flex justify-center my-2 md:my-0">
          <input
            type="text"
            placeholder="O que você procura?"
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
          />
        </div>
        {/* Ícones à direita */}
        <div className="flex items-center space-x-6">
          <Link href="#" className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
            <User size={24} />
            <span className="hidden md:inline font-semibold">Entrar</span>
          </Link>
          <Link href="#" className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
            <Heart size={24} />
            <span className="hidden md:inline font-semibold">Favoritos</span>
          </Link>
          <Link href="/carrinho" className="relative flex items-center group text-gray-700 hover:text-gray-900">
            <ShoppingCart size={28} />
            <span className="absolute -top-2 -right-2 text-xs bg-gray-800 text-white rounded-full px-2 py-0.5 font-bold">
              {carrinho.length}
            </span>
            <span className="ml-2 text-gray-800 font-semibold hidden md:inline">Carrinho</span>
          </Link>
        </div>
      </div>

      {/* Todos os Departamentos com submenu */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center px-4 py-2 space-x-4 relative">
          <div
            className="flex items-center gap-2 text-gray-800 font-semibold hover:text-gray-900 cursor-pointer select-none relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onClick={() => setOpen((v) => !v)}
            tabIndex={0}
          >
            <Menu size={20} />
            Todos os Departamentos
            {/* Submenu */}
            {open && (
              <div
                className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-20"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <Link href="#" className="block px-4 py-2 hover:bg-gray-100 text-gray-800">Cafés Tradicionais</Link>
                <Link href="#" className="block px-4 py-2 hover:bg-gray-100 text-gray-800">Cafés Especiais</Link>
                <Link href="#" className="block px-4 py-2 hover:bg-gray-100 text-gray-800">Cápsulas</Link>
                <Link href="#" className="block px-4 py-2 hover:bg-gray-100 text-gray-800">Acessórios</Link>
                <Link href="#" className="block px-4 py-2 hover:bg-gray-100 text-gray-800">Promoções</Link>
              </div>
            )}
          </div>
          {/* Categorias rápidas ao lado, se quiser manter */}
          <Link href="#" className="text-gray-700 hover:text-gray-900 text-sm">Cafés</Link>
          <Link href="#" className="text-gray-700 hover:text-gray-900 text-sm">Capsulas</Link>
          <Link href="#" className="text-gray-700 hover:text-gray-900 text-sm">Acessórios</Link>
          <Link href="#" className="text-gray-700 hover:text-gray-900 text-sm">Promoções</Link>
        </div>
      </div>
    </header>
  );
}
