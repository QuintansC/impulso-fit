import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#4e2e0e] border-t border-[#3a210a] mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-[#f5e9da]">
        {/* Logo e missão */}
        <div>
          <img src="/logo.jpg" alt="Café América" className="h-12 mb-4" />
          <p className="text-[#e0c9a6]">
            Café América é tradição e qualidade em cada xícara.<br />
            Experimente o sabor que conquista gerações.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold mb-2 text-[#f5e9da]">Institucional</h4>
          <ul className="space-y-1">
            <li><Link href="/sobre" className="hover:underline hover:text-[#ffe6b0]">Sobre nós</Link></li>
            <li><Link href="/contato" className="hover:underline hover:text-[#ffe6b0]">Contato</Link></li>
            <li><Link href="/politica-de-privacidade" className="hover:underline hover:text-[#ffe6b0]">Política de Privacidade</Link></li>
          </ul>
        </div>

        {/* Ajuda */}
        <div>
          <h4 className="font-semibold mb-2 text-[#f5e9da]">Ajuda</h4>
          <ul className="space-y-1">
            <li><Link href="/faq" className="hover:underline hover:text-[#ffe6b0]">Dúvidas Frequentes</Link></li>
            <li><Link href="/envio" className="hover:underline hover:text-[#ffe6b0]">Formas de Envio</Link></li>
            <li><Link href="/pagamento" className="hover:underline hover:text-[#ffe6b0]">Formas de Pagamento</Link></li>
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h4 className="font-semibold mb-2 text-[#f5e9da]">Atendimento</h4>
          <p className="text-[#e0c9a6]">
            (11) 1234-5678<br />
            atendimento@cafeamerica.com.br<br />
            Segunda a Sexta, das 8h às 18h
          </p>
          <div className="flex space-x-3 mt-3">
            <a href="#" aria-label="Instagram" className="hover:text-[#ffe6b0]">
              <svg width="20" height="20" fill="currentColor" className="text-[#e0c9a6] hover:text-[#ffe6b0]"><path d="M7.5 2A5.5 5.5 0 0 0 2 7.5v5A5.5 5.5 0 0 0 7.5 18h5a5.5 5.5 0 0 0 5.5-5.5v-5A5.5 5.5 0 0 0 12.5 2h-5zm0 1.5h5A4 4 0 0 1 16.5 7.5v5a4 4 0 0 1-4 4h-5a4 4 0 0 1-4-4v-5A4 4 0 0 1 7.5 3.5zm7.25 1.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-5.25 1A4.25 4.25 0 1 0 13.75 10 4.25 4.25 0 0 0 9.5 6.25zm0 1.5A2.75 2.75 0 1 1 6.75 10a2.75 2.75 0 0 1 2.75-2.75z"/></svg>
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-[#ffe6b0]">
              <svg width="20" height="20" fill="currentColor" className="text-[#e0c9a6] hover:text-[#ffe6b0]"><path d="M17 2.5A2.5 2.5 0 0 1 19.5 5v10A2.5 2.5 0 0 1 17 17.5H3A2.5 2.5 0 0 1 .5 15V5A2.5 2.5 0 0 1 3 2.5h14zm-2.25 2.25h-2.25a.25.25 0 0 0-.25.25v1.5h2.5a.25.25 0 0 1 .25.25v2a.25.25 0 0 1-.25.25h-2.5v6.25a.25.25 0 0 1-.25.25h-2a.25.25 0 0 1-.25-.25V8.75h-1.25a.25.25 0 0 1-.25-.25v-2a.25.25 0 0 1 .25-.25H9.5v-1.5A2.25 2.25 0 0 1 11.75 2.5h2a.25.25 0 0 1 .25.25v2a.25.25 0 0 1-.25.25z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="text-center border-t border-[#3a210a] text-[#e0c9a6] py-4 text-xs bg-[#3a210a]">
        © {new Date().getFullYear()} Café América. Todos os direitos reservados.
      </div>
    </footer>
  );
}
