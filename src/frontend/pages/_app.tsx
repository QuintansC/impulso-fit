import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { CarrinhoProvider } from '@/context/CarrinhoContext';
import { AuthProvider } from '@/context/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CarrinhoProvider>
        <Component {...pageProps} />
      </CarrinhoProvider>
    </AuthProvider>
  )
}