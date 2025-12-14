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
  let containerClass = "border border-gray-300 print:border-black bg-white flex flex-col justify-center font-sans relative box-border overflow-hidden";
  let titleClass = "font-bold uppercase mb-0.5 shrink-0";
  let nameClass = "font-bold uppercase leading-tight line-clamp-1 mb-0.5"; // line-clamp-1 no nome para AR economizar espaço
  let textClass = "leading-tight";

  if (compact) {
    // Modo Carta (16 por folha)
    containerClass += " w-[102mm] h-[36mm] p-2 text-[10px] border-gray-200 print:border-none";
    titleClass += " text-[9px] text-gray-500";
    nameClass += " text-sm";
    textClass += " text-[11px]";
  } else if (isAR) {
    // Modo AR (Altura reduzida e padding menor)
    // Se className vier vazio, usa altura padrão, senão obedece o pai
    const defaultDimensions = className.includes('h-') ? "" : "h-[55mm]";
    containerClass += ` w-[105mm] ${defaultDimensions} p-1 text-[9px]`; // Padding p-1 e fonte menor
    titleClass += " text-[10px]";
    nameClass += " text-xs";
    textClass += " text-[9px]";
  } else {
    // Modo Padrão
    containerClass += " w-[105mm] h-[74mm] p-3 text-xs";
    titleClass += " text-sm";
    nameClass += " text-base";
    textClass += " text-sm";
  }

  return (
    <div className={`${containerClass} ${className}`}>
      {label && <h3 className={titleClass}>{label} {isAR && "(AR)"}</h3>}
      
      <div className="w-full">
        <p className={nameClass}>{data.nome}</p>
        
        <div className={textClass}>
           <p className="break-words line-clamp-1">
             {data.logradouro}, {data.numero} {data.complemento}
           </p>
           <p className="break-words line-clamp-1">
             {data.bairro} - {data.localidade}/{data.uf}
           </p>
           
           <div className="flex justify-between items-end mt-0.5">
              <p className="font-bold text-base">{data.cep}</p>
              {data.pais && data.pais !== 'BR' && (
                  <p className="font-bold uppercase text-[9px]">{data.pais}</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};