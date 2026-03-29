import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/categorias', label: 'Categorias', icon: Tag },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { href: '/admin/usuarios', label: 'Usuários', icon: Users },
];

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function AdminLayout({ title, children }: Props) {
  const { usuario, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return router.pathname === '/admin';
    return router.pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/LogoImpulsoFit.png" alt="Impulso Fit" className="h-9" />
          <div>
            <span className="font-bold text-white text-sm block leading-tight">Impulso Fit</span>
            <span className="text-xs text-primary font-medium">Painel Admin</span>
          </div>
        </Link>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
              isActive(href)
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon size={18} className={isActive(href) ? 'text-primary' : 'text-gray-500 group-hover:text-white'} />
            {label}
            {isActive(href) && <ChevronRight size={14} className="ml-auto text-primary" />}
          </Link>
        ))}
      </nav>

      {/* Usuário + Sair */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
            {usuario?.nome?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{usuario?.nome}</p>
            <p className="text-gray-500 text-xs truncate">{usuario?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-dark-card border-r border-white/5 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Sidebar mobile — drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-60 bg-dark-card border-r border-white/5 z-50">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="bg-dark-card border-b border-white/5 px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <h1 className="text-white font-bold text-lg">{title}</h1>
          <Link href="/" className="ml-auto text-xs text-gray-500 hover:text-primary transition-colors">
            ← Ver loja
          </Link>
        </header>

        {/* Página */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
