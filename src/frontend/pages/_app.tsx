import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { CarrinhoProvider } from '@/context/CarrinhoContext';
import { AuthProvider } from '@/context/AuthContext';
import { FavoritosProvider } from '@/context/FavoritosContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CarrinhoProvider>
        <FavoritosProvider>
          <Component {...pageProps} />
        </FavoritosProvider>
      </CarrinhoProvider>
    </AuthProvider>
  )
}