import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import { TOKEN_KEY, AUTH_UNAUTHORIZED_EVENT } from '@/lib/constants';
import { Usuario } from '@/types';

type AuthContextType = {
  usuario: Usuario | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUsuario(null);
    setToken(null);
  };

  useEffect(() => {
    const tokenSalvo = localStorage.getItem(TOKEN_KEY);
    if (!tokenSalvo) {
      setLoading(false);
      return;
    }
    setToken(tokenSalvo);
    api.get('/auth/me')
      .then(({ data }) => setUsuario(data))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, logout);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, logout);
  }, []);

  const login = async (email: string, senha: string) => {
    const { data } = await api.post('/auth/login', { email, senha });
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUsuario(data.usuario);
  };

  return (
    <AuthContext.Provider value={{
      usuario, token, loading,
      isAdmin: usuario?.role === 'admin',
      login, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};
