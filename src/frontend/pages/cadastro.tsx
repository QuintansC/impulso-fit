import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !senha || !confirmarSenha) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }
    setErro('');
    // Exemplo: await cadastrar(nome, email, senha)
    alert('Cadastro simulado!');
  };

  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-[#f7f5f2] py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-[#4e2e0e] mb-6 text-center">Criar conta</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#4e2e0e]">Nome completo</span>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ecd8bb]"
                placeholder="Digite seu nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
              />
            </label>
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
                placeholder="Crie uma senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#4e2e0e]">Confirmar senha</span>
              <input
                type="password"
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ecd8bb]"
                placeholder="Repita a senha"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                required
              />
            </label>
            {erro && <div className="text-red-600 text-sm">{erro}</div>}
            <button
              type="submit"
              className="bg-[#4e2e0e] text-white font-semibold rounded px-4 py-2 mt-2 hover:bg-[#6b3f17] transition"
            >
              Criar conta
            </button>
          </form>
          <div className="flex flex-col items-center mt-6 gap-2">
            <span className="text-gray-400">Já tem conta?</span>
            <a
              href="/login"
              className="text-sm text-[#4e2e0e] font-semibold hover:underline"
            >
              Entrar
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}