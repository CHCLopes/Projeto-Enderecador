import React from 'react';
import type { AddressData } from '../types';

interface Props {
  sender: AddressData;
  recipient: AddressData;
}

export const DeclarationLabel: React.FC<Props> = ({ sender, recipient }) => {
  const totalItens = recipient.itensDeclaracao.reduce((acc, item) => acc + item.quantidade, 0);
  const totalValor = recipient.itensDeclaracao.reduce((acc, item) => acc + (item.valor * item.quantidade), 0);
  
  const currentDate = new Date().toLocaleDateString('pt-BR');

  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const formatDecimal = (val: number) => 
    new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

  return (
    <div className="w-full h-full border-2 border-black p-3 flex flex-col bg-white text-[10px] font-sans leading-tight relative box-border print:border-l-2 print:border-t-2">
      
      {/* Título */}
      <div className="flex items-center justify-between border-b border-black pb-1 mb-1">
        <h2 className="font-bold text-base uppercase">Declaração de Conteúdo</h2>
        <span className="text-[10px] font-bold">CORREIOS</span>
      </div>

      {/* Remetente / Destinatário */}
      <div className="grid grid-cols-2 gap-4 border-b border-black pb-2 mb-2">
        
        {/* Lado Esquerdo: Remetente */}
        <div>
            <span className="font-bold block text-[10px]">REMETENTE:</span>
            
            <span className="block font-bold leading-tight mb-0.5 line-clamp-2 overflow-hidden">
                {sender.nome}
            </span>
            
            {/* NOVO: Telefone Remetente */}
            {sender.telefone && (
                <span className="block font-bold mb-0.5">FONE: {sender.telefone}</span>
            )}
            
            <div className="leading-tight text-[10px]">
                <span className="block">
                    {sender.logradouro}, {sender.numero} {sender.complemento}
                </span>
                <span className="block">
                    {sender.bairro} - {sender.localidade}/{sender.uf}
                </span>
                <span className="block">
                    CEP: {sender.cep}
                </span>
            </div>
        </div>

        {/* Lado Direito: Destinatário */}
        <div>
            <span className="font-bold block text-[10px]">DESTINATÁRIO:</span>
            
            <span className="block font-bold leading-tight mb-0.5 line-clamp-2 overflow-hidden">
                {recipient.nome}
            </span>

            {/* NOVO: Telefone Destinatário */}
            {recipient.telefone && (
                <span className="block font-bold mb-0.5">FONE: {recipient.telefone}</span>
            )}
            
            <div className="leading-tight text-[10px]">
                <span className="block">
                    {recipient.logradouro}, {recipient.numero} {recipient.complemento}
                </span>
                <span className="block">
                    {recipient.bairro} - {recipient.localidade}/{recipient.uf}
                </span>
                <span className="block">
                    CEP: {recipient.cep}
                </span>
            </div>
        </div>
      </div>

      {/* Tabela de Itens */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="grid grid-cols-12 gap-1 font-bold border-b border-black text-center bg-gray-100 text-[9px] py-1">
            <div className="col-span-7 text-left pl-2">ITEM</div>
            <div className="col-span-1">QTD</div>
            <div className="col-span-2 text-right">VALOR UN (R$)</div>
            <div className="col-span-2 text-right pr-2">TOTAL (R$)</div>
        </div>

        <div className="flex-1 overflow-hidden">
            {recipient.itensDeclaracao.length > 0 ? (
                recipient.itensDeclaracao.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-1 border-b border-gray-200 py-1 text-[11px]">
                        <div className="col-span-7 truncate pl-2">{item.descricao}</div>
                        <div className="col-span-1 text-center">{item.quantidade}</div>
                        <div className="col-span-2 text-right">{formatDecimal(item.valor)}</div>
                        <div className="col-span-2 text-right pr-2">{formatDecimal(item.valor * item.quantidade)}</div>
                    </div>
                ))
            ) : (
                <div className="text-center italic text-gray-400 mt-4">Nenhum item declarado</div>
            )}
        </div>
      </div>

      {/* Rodapé */}
      <div className="mt-auto border-t-2 border-black pt-2">
        <div className="flex justify-between font-bold mb-2 text-sm">
            <span>TOTAL DE ITENS: {totalItens}</span>
            <span>VALOR TOTAL: {formatMoney(totalValor)}</span>
        </div>
        
        <div className="text-[8px] text-justify mb-4 leading-[1.2] text-gray-800 font-medium">
            Declaro que não me enquadro no conceito de contribuinte previsto no art. 4º da Lei Complementar nº 87/1996, uma vez que não realizo, com habitualidade ou em volume que caracterize intuito comercial, operações de circulação de mercadoria, ainda que se iniciem no exterior, ou estou dispensado da emissão da nota fiscal por força da legislação tributaria vigente, responsabilizando-me, nos termos da lei e a quem de direito, por informações inverídicas.
            Declaro que não envio objeto que ponha em risco o transporte aéreo, nem objeto proibido no fluxo postal, assumindo responsabilidade pela informação prestada, e ciente de que o descumprimento pode configurar crime, conforme artigo 261 do Código Penal Brasileiro.
            Declaro, ainda, estar ciente da lista de proibições e restrições, disponível no site dos Correios: https://www.correios.com.br/enviar/proibicoes-e-restricoes/proibicoes-e-restricoes
            <br />
            <strong className="block mt-1">
                OBSERVAÇÃO: Constitui crime contra a ordem tributária suprimir ou reduzir tributo, ou contribuição social e qualquer acessório (Lei 8.137/90 Art. 1º, V).
            </strong>
        </div>

        <div className="flex gap-4 items-end mt-2">
            <div className="w-1/4">
                <div className="border-b border-black h-6"></div>
                <div className="text-[9px] font-bold mt-1 text-center">Cidade/UF</div>
            </div>
            
            <div className="w-1/4">
                <div className="border-b border-black h-6 flex items-end justify-center text-[11px]">
                    {currentDate}
                </div>
                <div className="text-[9px] font-bold mt-1 text-center">Data</div>
            </div>

            <div className="flex-1">
                <div className="border-b border-black h-6"></div>
                <div className="text-[9px] font-bold mt-1 text-center">Assinatura do Declarante</div>
            </div>
        </div>
      </div>
    </div>
  );
};