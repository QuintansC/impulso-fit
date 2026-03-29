import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

type Props = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

export default function ProtectedRoute({ children, requireAdmin = false }: Props) {
  const { usuario, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!usuario) {
      router.push(`/login?redirect=${encodeURIComponent(router.pathname)}`);
      return;
    }
    if (requireAdmin && !isAdmin) {
      router.push('/');
    }
  }, [loading, usuario, isAdmin, requireAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Verificando acesso...</span>
        </div>
      </div>
    );
  }

  if (!usuario || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
