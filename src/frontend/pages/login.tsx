import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    setErro('');
    alert('Login simulado!');
  };

  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-[#111111] to-[#b71c1c] py-12 w-full">
        <div className="w-full max-w-md bg-[#111111] rounded-xl shadow-lg p-8 border border-[#b71c1c]">
          <h1 className="text-2xl font-bold text-[#b71c1c] mb-6 text-center">Impulso Fit - Acesse sua conta</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-white">E-mail</span>
              <input
                type="email"
                className="border border-[#b71c1c] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b71c1c] bg-[#222] text-white placeholder:text-[#b71c1c]"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-white">Senha</span>
              <input
                type="password"
                className="border border-[#b71c1c] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b71c1c] bg-[#222] text-white placeholder:text-[#b71c1c]"
                placeholder="Digite sua senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
            </label>
            {erro && <div className="text-[#b71c1c] text-sm">{erro}</div>}
            <button
              type="submit"
              className="bg-[#b71c1c] text-white font-semibold rounded px-4 py-2 mt-2 hover:bg-white hover:text-[#b71c1c] border border-[#b71c1c] transition"
            >
              Entrar
            </button>
          </form>
          <div className="flex flex-col items-center mt-6 gap-2">
            <a href="#" className="text-sm text-white hover:text-[#b71c1c] hover:underline">
              Esqueci minha senha
            </a>
            <span className="text-white">ou</span>
            <a
              href="/cadastro"
              className="text-sm text-white font-semibold hover:text-[#b71c1c] hover:underline"
            >
              Criar conta
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}