import { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import api from '@/lib/api';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !senha || !confirmarSenha) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setErro('');
    setLoading(true);
    try {
      await api.post('/auth/register', { nome, email, senha });
      setSucesso(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      const mensagem = err.response?.data?.erro || 'Erro ao criar conta. Tente novamente.';
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-[#111111] to-[#b71c1c] py-12 w-full">
        <div className="w-full max-w-md bg-[#111111] rounded-xl shadow-lg p-8 border border-[#b71c1c]">
          <h1 className="text-2xl font-bold text-[#b71c1c] mb-6 text-center">Criar conta</h1>

          {sucesso ? (
            <div className="text-center py-6">
              <div className="text-green-400 text-lg font-semibold mb-2">Conta criada com sucesso!</div>
              <p className="text-gray-400 text-sm">Redirecionando para o login...</p>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-white">Nome completo</span>
                <input
                  type="text"
                  className="border border-[#b71c1c] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b71c1c] bg-[#222] text-white placeholder:text-[#b71c1c]"
                  placeholder="Digite seu nome"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  required
                  disabled={loading}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-white">E-mail</span>
                <input
                  type="email"
                  className="border border-[#b71c1c] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b71c1c] bg-[#222] text-white placeholder:text-[#b71c1c]"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-white">Senha</span>
                <input
                  type="password"
                  className="border border-[#b71c1c] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b71c1c] bg-[#222] text-white placeholder:text-[#b71c1c]"
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                  disabled={loading}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-white">Confirmar senha</span>
                <input
                  type="password"
                  className="border border-[#b71c1c] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b71c1c] bg-[#222] text-white placeholder:text-[#b71c1c]"
                  placeholder="Repita a senha"
                  value={confirmarSenha}
                  onChange={e => setConfirmarSenha(e.target.value)}
                  required
                  disabled={loading}
                />
              </label>
              {erro && <div className="text-[#b71c1c] text-sm bg-[#b71c1c]/10 border border-[#b71c1c]/30 rounded px-3 py-2">{erro}</div>}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#b71c1c] text-white font-semibold rounded px-4 py-2 mt-2 hover:bg-white hover:text-[#b71c1c] border border-[#b71c1c] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>
          )}

          <div className="flex flex-col items-center mt-6 gap-2">
            <span className="text-white">Já tem conta?</span>
            <a
              href="/login"
              className="text-sm text-white font-semibold hover:text-[#b71c1c] hover:underline"
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
