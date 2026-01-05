import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark-card border-t border-primary/10 mt-10 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm relative z-10">
        {/* Logo e missão */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src="/LogoImpulsoFit.png" alt="Impulso Fit" className="h-12" />
            <span className="font-display font-bold text-xl">
              <span className="text-gradient">Impulso</span> <span className="text-white">Fit</span>
            </span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            <span className="text-primary font-semibold">Impulso Fit</span> é energia, força e resultado.<br />
            Sua loja hardcore fitness para treinar sem limites!
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-display font-semibold mb-4 text-white text-base">Institucional</h4>
          <ul className="space-y-2">
            <li><Link href="/sobre" className="text-gray-500 hover:text-primary transition-colors">Sobre nós</Link></li>
            <li><Link href="/contato" className="text-gray-500 hover:text-primary transition-colors">Contato</Link></li>
            <li><Link href="/politica-de-privacidade" className="text-gray-500 hover:text-primary transition-colors">Política de Privacidade</Link></li>
          </ul>
        </div>

        {/* Ajuda */}
        <div>
          <h4 className="font-display font-semibold mb-4 text-white text-base">Ajuda</h4>
          <ul className="space-y-2">
            <li><Link href="/faq" className="text-gray-500 hover:text-secondary transition-colors">Dúvidas Frequentes</Link></li>
            <li><Link href="/envio" className="text-gray-500 hover:text-secondary transition-colors">Formas de Envio</Link></li>
            <li><Link href="/pagamento" className="text-gray-500 hover:text-secondary transition-colors">Formas de Pagamento</Link></li>
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h4 className="font-display font-semibold mb-4 text-white text-base">Atendimento</h4>
          <p className="text-gray-400 leading-relaxed mb-4">
            <span className="text-primary font-semibold">(11) 1234-5678</span><br />
            <a href="mailto:contato@impulsofit.com.br" className="text-secondary hover:underline">contato@impulsofit.com.br</a><br />
            <span className="text-gray-500 text-xs">Segunda a Sexta, das 8h às 18h</span>
          </p>
          <div className="flex space-x-3">
            <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-dark-light flex items-center justify-center hover:bg-primary/20 transition-colors group">
              <svg width="20" height="20" fill="currentColor" className="text-white group-hover:text-primary transition-colors">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-dark-light flex items-center justify-center hover:bg-primary/20 transition-colors group">
              <svg width="20" height="20" fill="currentColor" className="text-white group-hover:text-primary transition-colors">
                <path d="M18 0h-16c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-16c0-1.1-.9-2-2-2zm-1 9h-2v8h-3v-8h-2v-3h2v-1.5c0-1.4.6-2.5 2.5-2.5h2v3h-2v1.5h2v3z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="text-center border-t border-primary/10 text-gray-500 py-6 text-xs bg-dark relative z-10">
        <p>© {new Date().getFullYear()} <span className="text-primary font-semibold">Impulso Fit</span>. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
