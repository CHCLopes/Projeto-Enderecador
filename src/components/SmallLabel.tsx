import React from 'react';
import type { AddressData } from '../types';

interface Props {
  data: AddressData;
  label?: "REMETENTE" | "DESTINATÁRIO";
  compact?: boolean;
  isAR?: boolean;
  className?: string;
}

export const SmallLabel: React.FC<Props> = ({ data, label, compact = false, isAR = false, className = "" }) => {
  
  // Definição de estilos baseados no modo
  let containerClass = "border border-gray-300 print:border-black bg-white flex flex-col justify-center font-sans relative box-border";
  let titleClass = "font-bold uppercase mb-0.5 shrink-0";
  let nameClass = "font-bold uppercase leading-tight mb-0.5"; 
  let textClass = "leading-tight";
  let phoneClass = "font-bold uppercase mb-0.5"; 

  if (compact) {
    // MODO CARTA (Expansível)
    // Alterações: 
    // 1. min-h-[36mm] h-auto: Garante tamanho mínimo mas cresce se precisar.
    // 2. w-full: Ocupa a largura da célula do grid.
    // 3. Removido overflow-hidden.
    containerClass += " w-full min-h-[36mm] h-auto p-2 border-gray-200 print:border-none items-center text-center";
    titleClass += " text-[10px] text-gray-500";
    
    nameClass += " text-sm"; 
    phoneClass += " text-[10px] text-gray-800";
    textClass += " text-sm w-full"; 

  } else if (isAR) {
    // MODO AR (Compacto Fixo)
    const defaultDimensions = className.includes('h-') ? "" : "h-[55mm]";
    // AR mantém overflow-hidden e tamanho fixo pois o espaço físico do formulário é rígido
    containerClass += ` w-[105mm] ${defaultDimensions} p-0.5 text-[9px] items-center text-center leading-none overflow-hidden`; 
    titleClass += " text-[9px] mb-0";
    nameClass += " text-[11px] line-clamp-1";
    phoneClass += " text-[9px]";
    textClass += " text-[9px] w-full leading-none"; 
    
  } else {
    // MODO PADRÃO
    containerClass += " w-[105mm] h-[74mm] p-3 text-xs overflow-hidden";
    titleClass += " text-sm";
    nameClass += " text-base line-clamp-1";
    textClass += " text-sm";
  }

  return (
    <div className={`${containerClass} ${className}`}>
      {label && <h3 className={titleClass}>{label} {isAR && "(AR)"}</h3>}
      
      <div className="w-full">
        <p className={nameClass}>{data.nome}</p>
        
        {data.telefone && (
            <p className={phoneClass}>FONE: {data.telefone}</p>
        )}
        
        <div className={textClass}>
           {/* Removido classes de limitação de linha no modo carta implicitamente */}
           <p className="break-words">
             {data.logradouro}, {data.numero} {data.complemento}
           </p>
           <p className="break-words">
             {data.bairro} - {data.localidade}/{data.uf}
           </p>
           
           <div className={`flex items-end mt-0.5 ${compact || isAR ? 'justify-center' : 'justify-between'}`}>
              <p className="font-bold text-sm">{data.cep}</p>
              {data.pais && data.pais !== 'BR' && !isAR && !compact && (
                  <p className="font-bold uppercase text-[10px]">{data.pais}</p>
              )}
           </div>
           
           {(compact || isAR) && data.pais && data.pais !== 'BR' && (
               <p className="font-bold uppercase text-[8px] mt-0.5">{data.pais}</p>
           )}
        </div>
      </div>
    </div>
  );
};