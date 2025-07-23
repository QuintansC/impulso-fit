import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { CarrinhoProvider } from '@/context/CarrinhoContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CarrinhoProvider>
      <Component {...pageProps} />
    </CarrinhoProvider>
  )
}