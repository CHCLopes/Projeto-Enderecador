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
  let nameClass = "font-bold uppercase leading-none line-clamp-1 mb-0.5"; // leading-none para AR
  let textClass = "leading-tight";

  if (compact) {
    // Modo Carta
    containerClass += " w-[102mm] h-[36mm] p-2 text-[10px] border-gray-200 print:border-none";
    titleClass += " text-[9px] text-gray-500";
    nameClass += " text-sm";
    textClass += " text-[11px]";
  } else if (isAR) {
    // Modo AR (Super Compacto)
    const defaultDimensions = className.includes('h-') ? "" : "h-[55mm]";
    // Alterado: p-0.5 para padding mínimo
    containerClass += ` w-[105mm] ${defaultDimensions} p-0.5 text-[9px] items-center text-center leading-none`; 
    titleClass += " text-[9px] mb-0"; // Título menor e sem margem
    nameClass += " text-[11px]"; // Nome um pouco menor
    textClass += " text-[9px] w-full leading-none"; // Texto bem compacto
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
           <p className="truncate">
             {data.logradouro}, {data.numero} {data.complemento}
           </p>
           <p className="truncate">
             {data.bairro} - {data.localidade}/{data.uf}
           </p>
           
           <div className={`flex items-end mt-0.5 ${isAR ? 'justify-center' : 'justify-between'}`}>
              <p className="font-bold text-sm">{data.cep}</p>
              {data.pais && data.pais !== 'BR' && !isAR && (
                  <p className="font-bold uppercase text-[10px]">{data.pais}</p>
              )}
           </div>
           {data.pais && data.pais !== 'BR' && isAR && (
               <p className="font-bold uppercase text-[8px]">{data.pais}</p>
           )}
        </div>
      </div>
    </div>
  );
};