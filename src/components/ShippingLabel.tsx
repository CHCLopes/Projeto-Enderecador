import React from 'react';
import Barcode from 'react-barcode';
import type { AddressData } from '../types';
import { COUNTRIES } from '../constants/countries';

interface Props {
  sender: AddressData;
  recipient: AddressData;
}

export const ShippingLabel = React.forwardRef<HTMLDivElement, Props>(({ sender, recipient }, ref) => {
  const barcodeValue = recipient.cep.replace(/\D/g, '');

  const getCountryDisplay = () => {
    if (recipient.tipoDestino === 'nacional') return null;
    const country = COUNTRIES.find(c => c.code === recipient.pais);
    if (!country) return recipient.pais;
    return (
        <div className="mt-2 border-t border-black pt-1">
            <p className="font-bold uppercase text-sm">{country.pt}</p>
            <p className="font-bold uppercase text-xs text-gray-600">{country.en}</p>
        </div>
    );
  };

  return (
    <div ref={ref} className="w-full h-full bg-white text-black font-sans relative print:break-inside-avoid">
      <div className="w-full h-full border-2 border-dashed border-gray-300 print:border-black p-3 flex flex-col justify-between mx-auto bg-white box-border overflow-hidden">
        
        {/* --- DESTINATÁRIO --- */}
        <div className="flex-1 flex flex-col mt-0 min-h-0">
          <div className="flex justify-between items-end border-b-2 border-black mb-2 pb-1 shrink-0">
            <h1 className="text-lg font-bold uppercase">Destinatário</h1>
            {recipient.tipoDestino === 'internacional' && (
                <span className="text-[10px] font-bold border border-black px-1 rounded bg-black text-white">
                    INTL ✈
                </span>
            )}
          </div>
          
          <div className="text-sm leading-snug pl-1 flex-1 overflow-hidden">
            
            <div className="mb-1">
                {/* Nome: Max 2 linhas */}
                <p className="uppercase font-bold text-base leading-tight mb-0.5 line-clamp-2">
                    {recipient.nome || "NOME DO DESTINATÁRIO"}
                </p>
                
                {recipient.telefone && (
                    <div className="flex items-center gap-1 mt-0.5">
                        <span className="uppercase font-bold text-sm leading-tight">
                            FONE: {recipient.telefone}
                        </span>
                    </div>
                )}
            </div>

            {/* Endereço: Múltiplas linhas permitidas (sem truncate) */}
            <div className="leading-tight">
                <p>{recipient.logradouro}, {recipient.numero}</p>
                <p>{recipient.complemento}</p>
                <p className="font-medium">{recipient.bairro}</p>
                <p>{recipient.localidade} / {recipient.uf}</p>
            </div>
            
            <div className="mt-2">
                <span className="font-bold text-lg tracking-widest block mb-1">
                    {recipient.cep || "00000-000"}
                </span>
                
                {barcodeValue && barcodeValue.length >= 5 && (
                    <div className="-ml-2 overflow-hidden"> 
                        <Barcode 
                            value={barcodeValue} 
                            width={1.5}
                            height={30} 
                            fontSize={10}
                            displayValue={false} 
                            margin={0}
                            textAlign="left"
                        />
                    </div>
                )}
            </div>

            {getCountryDisplay()}

          </div>
        </div>

        {/* Separador */}
        <div className="border-t-4 border-black my-2 shrink-0"></div>

        {/* --- REMETENTE --- */}
        <div className="text-[10px] text-gray-800 pb-0 shrink-0">
          <h2 className="font-bold uppercase mb-0.5 text-black text-xs">Remetente</h2>
          <div className="leading-tight pl-1">
            {/* Nome: Max 2 linhas */}
            <p className="uppercase font-bold mb-0.5 line-clamp-2">
                {sender.nome || "NOME DO REMETENTE"}
            </p>
            
            {sender.telefone && (
                <p className="uppercase font-bold mb-0.5">
                    FONE: {sender.telefone}
                </p>
            )}

            {/* Endereço: Múltiplas linhas permitidas */}
            <p>{sender.logradouro}, {sender.numero} {sender.complemento}</p>
            <p>{sender.bairro} - {sender.localidade} / {sender.uf}</p>
            <p className="font-bold mt-0.5">
                {sender.cep} <span className="text-[9px] font-normal uppercase ml-1">BRASIL</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
});

ShippingLabel.displayName = 'ShippingLabel';