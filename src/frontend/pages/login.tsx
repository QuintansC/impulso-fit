import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode chamar sua API de autenticação
    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    setErro('');
    // Exemplo: await login(email, senha)
    alert('Login simulado!');
  };

  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-[#f7f5f2] py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-[#4e2e0e] mb-6 text-center">Acesse sua conta</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#4e2e0e]">E-mail</span>
              <input
                type="email"
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ecd8bb]"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#4e2e0e]">Senha</span>
              <input
                type="password"
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ecd8bb]"
                placeholder="Digite sua senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
            </label>
            {erro && <div className="text-red-600 text-sm">{erro}</div>}
            <button
              type="submit"
              className="bg-[#4e2e0e] text-white font-semibold rounded px-4 py-2 mt-2 hover:bg-[#6b3f17] transition"
            >
              Entrar
            </button>
          </form>
          <div className="flex flex-col items-center mt-6 gap-2">
            <a href="#" className="text-sm text-[#4e2e0e] hover:underline">
              Esqueci minha senha
            </a>
            <span className="text-gray-400">ou</span>
            <a
              href="/cadastro"
              className="text-sm text-[#4e2e0e] font-semibold hover:underline"
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