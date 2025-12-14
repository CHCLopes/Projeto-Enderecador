import React from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print:hidden">
      {/* Container do Modal */}
      <div className="bg-[#EBF5FF] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative border border-blue-200 flex flex-col">
        
        {/* Botão Fechar */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-red-500 transition-colors bg-white/50 rounded-full p-1 z-10"
          title="Fechar Ajuda"
        >
          <X size={24} />
        </button>

        {/* Conteúdo (Scrollável) */}
        <div className="p-6 md:p-8 font-sans flex-1">
          
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#07426B] mb-2">Como usar este endereçador</h2>
            <p className="text-[#07426B] font-medium text-lg">
              Guia rápido para gerar etiquetas, declarações e ARs.
            </p>
          </div>

          {/* Lista de Passos */}
          <div className="space-y-6 text-base">
            
            {/* Passo 1 - Configuração */}
            <div>
              <p className="font-bold text-[#07426B] text-lg mb-1">
                1. Configure o Tipo de Envio.
              </p>
              <ul className="pl-4 space-y-1">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-orange-500 text-xl leading-none">◆</span>
                  <span><strong>Encomenda:</strong> Gera etiqueta de envio + declaração de conteúdo (2 por página).</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-orange-500 text-xl leading-none">◆</span>
                  <span><strong>Carta:</strong> Gera grade de etiquetas pequenas (até 16 por página).</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-orange-500 text-xl leading-none">◆</span>
                  <span>Marque <strong>Aviso de Recebimento (AR)</strong> para gerar etiquetas extras para colar no cartão de AR.</span>
                </li>
              </ul>
            </div>

            {/* Passo 2 - Preenchimento */}
            <div>
              <p className="font-bold text-[#07426B] text-lg mb-1">
                2. Preencha os dados (Remetente e Destinatário).
              </p>
              <ul className="pl-4 space-y-1">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-orange-500 text-xl leading-none">◆</span>
                  <span>O CEP busca o endereço automaticamente. Para envios ao exterior, selecione <strong>Internacional</strong> e busque o país.</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-orange-500 text-xl leading-none">◆</span>
                  <span>Se for Encomenda, adicione os <strong>Itens da Declaração</strong>. O sistema calcula totais e cria páginas extras se houver muitos itens.</span>
                </li>
              </ul>
            </div>

            {/* Passo 3 - Fila (Vermelho/Destaque) */}
            <div>
              <p className="font-bold text-[#C0392B] text-lg mb-1 leading-tight">
                3. Clique em "Adicionar à Fila de Impressão".
              </p>
              <ul className="pl-4">
                <li className="flex items-start gap-2 text-[#C0392B] font-medium">
                  <span className="text-orange-500 text-xl leading-none">◆</span>
                  <span>O Remetente permanece fixo. Basta alterar o Destinatário e adicionar novamente para criar um lote.</span>
                </li>
                <li className="flex items-start gap-2 text-[#C0392B] font-medium">
                  <span className="text-orange-500 text-xl leading-none">◆</span>
                  <span>Não há limite de etiquetas. O layout se organiza automaticamente na folha A4.</span>
                </li>
              </ul>
            </div>

            {/* Passo 4 - Impressão */}
            <div>
              <p className="font-bold text-[#07426B] text-lg">
                4. Clique em "Imprimir Rótulos" para gerar o PDF.
              </p>
              <p className="pl-6 text-sm text-gray-600 mt-1">
                * No celular, certifique-se de que o tamanho do papel esteja configurado como A4 na hora de salvar o PDF.
              </p>
            </div>

          </div>
        </div>

        {/* Rodapé do Modal - CORRIGIDO (Removida a cor duplicada) */}
        <div className="p-4 flex justify-center sticky bottom-0 bg-white/95 backdrop-blur border-t border-blue-100">
            <button 
                onClick={onClose}
                className="bg-[#07426B] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#095285] transition-colors shadow-md"
            >
                Entendi
            </button>
        </div>
      </div>
    </div>
  );
};