// Componente de teste simples para debug
import React from 'react';

interface TestProps {
  total: number;
  itens: any[];
  onSuccess: () => void;
}

export default function TestStripeCheckout({ total, itens, onSuccess }: TestProps) {
  return (
    <div className="bg-[#333] border border-[#444] p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Checkout de Teste</h2>
      <p className="mb-2 text-[#ccc]">Total: R$ {total.toFixed(2)}</p>
      <p className="mb-4 text-[#ccc]">Itens: {itens.length}</p>
      
      <div className="space-y-2 mb-4">
        {itens.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-[#222] border border-[#444] rounded">
            <span className="text-white">{item.nome || 'Produto'}</span>
            <span className="text-[#b71c1c] font-bold">R$ {(item.preco || 0).toFixed(2)}</span>
          </div>
        ))}
      </div>
      
      <button
        onClick={onSuccess}
        className="w-full bg-gradient-to-r from-[#4caf50] to-[#2e7d32] text-white py-2 px-4 rounded hover:from-[#2e7d32] hover:to-[#1b5e20] transition-all"
      >
        Simular Pagamento Aprovado
      </button>
      
      <div className="mt-4 p-3 bg-[#1a1a1a] border border-[#333] rounded text-sm text-[#999]">
        ⚠️ Este é um componente de teste. Para usar o Stripe real, configure as variáveis de ambiente.
      </div>
    </div>
  );
}
