import React, { useMemo } from 'react';
import { ShippingLabel } from './ShippingLabel';
import { DeclarationLabel } from './DeclarationLabel';
import { SmallLabel } from './SmallLabel';
import type { AddressData, PrintSettings } from '../types';

interface Props {
  sender: AddressData;
  recipients: AddressData[];
  settings: PrintSettings;
}

interface LabelItem {
  data: AddressData;
  type: "REMETENTE" | "DESTINATÁRIO";
}

// Limite de itens na declaração para quebrar página
const ITEMS_PER_PAGE_LIMIT = 7;

export const PrintLayout = React.forwardRef<HTMLDivElement, Props>(({ sender, recipients, settings }, ref) => {
  
  // 1. Lógica de Paginação de Itens (Split de Declaração)
  const recipientsToPrint = useMemo(() => {
    if (settings.mode === 'carta') return recipients;

    const processedList: AddressData[] = [];
    recipients.forEach(recipient => {
      if (!recipient.itensDeclaracao || recipient.itensDeclaracao.length <= ITEMS_PER_PAGE_LIMIT) {
        processedList.push(recipient);
        return;
      }
      const allItems = recipient.itensDeclaracao;
      for (let i = 0; i < allItems.length; i += ITEMS_PER_PAGE_LIMIT) {
        const itemsChunk = allItems.slice(i, i + ITEMS_PER_PAGE_LIMIT);
        processedList.push({ ...recipient, itensDeclaracao: itemsChunk });
      }
    });
    return processedList;
  }, [recipients, settings.mode]);


  // ========================================================================
  // MODO CARTA (GRID FLEXÍVEL)
  // ========================================================================
  if (settings.mode === 'carta') {
    const itemsToPrint: LabelItem[] = [];
    recipients.forEach((recipient) => {
      const basePair: LabelItem[] = [
        { data: sender, type: 'REMETENTE' },
        { data: recipient, type: 'DESTINATÁRIO' }
      ];
      itemsToPrint.push(...basePair);
      if (settings.hasAR) itemsToPrint.push(...basePair);
    });

    const chunkArray = (arr: LabelItem[], size: number) => {
      const results = [];
      for (let i = 0; i < arr.length; i += size) results.push(arr.slice(i, i + size));
      return results;
    };
    // Mantemos a divisão lógica de 16, mas visualmente pode ocupar mais de 1 página física
    const pages = chunkArray(itemsToPrint, 16);

    return (
      <div ref={ref} className="print:w-full bg-gray-100 print:bg-white">
        {pages.map((pageItems, pageIndex) => (
          <div 
            key={pageIndex} 
            // Alterado: min-h-[297mm] h-auto (permite crescer) e removido grid-rows-8
            className="w-[210mm] min-h-[297mm] h-auto bg-white grid grid-cols-2 gap-x-1 gap-y-0 p-[5mm] box-border break-after-page mx-auto shadow-md print:shadow-none mb-4 print:mb-0"
          >
            {pageItems.map((item, idx) => (
              <div 
                key={idx} 
                // Adicionado: break-inside-avoid para não cortar etiqueta ao meio
                className="flex items-center justify-center border border-dashed border-gray-100 print:border-none break-inside-avoid"
              >
                <SmallLabel data={item.data} label={item.type} compact={true} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // ========================================================================
  // MODO ENCOMENDA
  // ========================================================================
  
  const chunkRecipients = (arr: AddressData[], size: number) => {
    const results = [];
    for (let i = 0; i < arr.length; i += size) results.push(arr.slice(i, i + size));
    return results;
  };
  const pages = chunkRecipients(recipientsToPrint, 2);

  // --- CASO 1: ENCOMENDA COM AR (NOVO LAYOUT 40/60) ---
  if (settings.hasAR) {
    return (
        <div ref={ref} className="print:w-full bg-gray-100 print:bg-white">
            {pages.map((pageGroup, pageIndex) => (
                <div key={pageIndex} className="w-[210mm] h-[297mm] bg-white flex flex-col p-0 box-border break-after-page mx-auto shadow-md print:shadow-none mb-4 print:mb-0">
                    {pageGroup.map((recipient, idx) => (
                        // Container de 1 Conjunto (Altura ~148.5mm = Metade da folha)
                        <div key={idx} className="flex h-[148.5mm] relative">
                            
                            {/* LINHA DE CORTE ABSOLUTA (Apenas para o primeiro item) */}
                            {idx === 0 && (
                                <div className="absolute bottom-0 left-0 w-full border-b-2 border-dashed border-black z-10 print:border-black"></div>
                            )}

                            {/* COLUNA ESQUERDA (40%): Etiquetas de Endereço */}
                            <div className="w-[40%] flex flex-col border-r border-dashed border-gray-300">
                                
                                {/* Linha 1: AR Remetente (Altura fixa pequena ~25mm) */}
                                <div className="h-[25mm] border-b border-dashed border-gray-300 flex items-center justify-center p-0.5">
                                    <SmallLabel data={sender} label="REMETENTE" isAR={true} className="h-full w-full border-none" />
                                </div>

                                {/* Linha 2: AR Destinatário (Altura fixa pequena ~25mm) */}
                                <div className="h-[25mm] border-b border-dashed border-gray-300 flex items-center justify-center p-0.5">
                                    <SmallLabel data={recipient} label="DESTINATÁRIO" isAR={true} className="h-full w-full border-none" />
                                </div>

                                {/* Linha 3: Etiqueta Principal (Ocupa o resto da altura ~98mm) */}
                                <div className="flex-1 flex items-start justify-center p-0">
                                    <ShippingLabel sender={sender} recipient={recipient} />
                                </div>
                            </div>

                            {/* COLUNA DIREITA (60%): Declaração de Conteúdo (Altura total) */}
                            <div className="w-[60%] flex items-start justify-center p-0">
                                <DeclarationLabel sender={sender} recipient={recipient} />
                            </div>

                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
  }

  // --- CASO 2: ENCOMENDA SEM AR (Layout Padrão 40/60) ---
  return (
    <div ref={ref} className="print:w-full bg-gray-100 print:bg-white">
        {pages.map((pageGroup, pageIndex) => (
            <div key={pageIndex} className="w-[210mm] h-[297mm] bg-white flex flex-col break-after-page mx-auto shadow-md print:shadow-none mb-4 print:mb-0">
                {pageGroup.map((recipient, idx) => (
                    // Adicionado 'relative' e a linha absoluta aqui também para consistência
                    <div key={idx} className="flex h-[148mm] w-full border-b border-dashed border-gray-300 relative">
                        
                        {/* LINHA DE CORTE ABSOLUTA (Apenas para o primeiro item) */}
                        {idx === 0 && (
                            <div className="absolute bottom-0 left-0 w-full border-b-2 border-dashed border-black z-10 print:border-black"></div>
                        )}

                        {/* COLUNA ESQUERDA (40%): Etiqueta */}
                        <div className="w-[40%] flex items-center justify-center p-2 border-r border-dashed border-gray-300">
                             <ShippingLabel sender={sender} recipient={recipient} />
                        </div>
                        
                        {/* COLUNA DIREITA (60%): Declaração */}
                        <div className="w-[60%] flex items-center justify-center p-2">
                             <DeclarationLabel sender={sender} recipient={recipient} />
                        </div>
                    </div>
                ))}
            </div>
        ))}
    </div>
  );
});

PrintLayout.displayName = 'PrintLayout';