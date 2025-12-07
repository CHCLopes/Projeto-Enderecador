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

  // Helper para encontrar os dados do país selecionado
  const getCountryDisplay = () => {
    if (recipient.tipoDestino === 'nacional') return null;
    const country = COUNTRIES.find(c => c.code === recipient.pais);
    if (!country) return recipient.pais; // Fallback se o código não for achado
    return (
        <div className="mt-3 border-t-2 border-black pt-1">
            <p className="font-bold uppercase text-base">{country.pt}</p>
            <p className="font-bold uppercase text-sm text-gray-600">{country.en}</p>
        </div>
    );
  };

  return (
    <div ref={ref} className="bg-white text-black font-sans overflow-hidden relative print:break-inside-avoid">
      <div className="w-[105mm] h-[148mm] border-2 border-dashed border-gray-300 print:border-black p-4 flex flex-col justify-between mx-auto bg-white box-border">
        
        {/* --- DESTINATÁRIO --- */}
        <div className="flex-1 flex flex-col mt-1">
          <div className="flex justify-between items-end border-b-2 border-black mb-3 pb-1">
            <h1 className="text-xl font-bold uppercase">Destinatário</h1>
            {recipient.tipoDestino === 'internacional' && (
                <span className="text-xs font-bold border border-black px-1 rounded bg-black text-white">
                    INTL ✈
                </span>
            )}
          </div>
          
          <div className="text-base leading-relaxed pl-2">
            
            <div className="mb-2">
                <p className="uppercase font-bold text-lg leading-tight">
                    {recipient.nome || "NOME DO DESTINATÁRIO"}
                </p>
                
                {recipient.telefone && (
                    <div className="flex items-center gap-1 mt-1">
                        <span className="uppercase font-bold text-lg leading-tight">
                            FONE: {recipient.telefone}
                        </span>
                    </div>
                )}
            </div>

            <p className="text-sm">{recipient.logradouro}, {recipient.numero}</p>
            <p className="text-sm">{recipient.complemento}</p>
            <p className="text-sm font-medium">{recipient.bairro}</p>
            <p className="text-sm">{recipient.localidade} / {recipient.uf}</p>
            
            <div className="mt-4">
                <span className="font-bold text-xl tracking-widest block mb-1">
                    {recipient.cep || "00000-000"}
                </span>
                
                {barcodeValue && barcodeValue.length >= 5 && (
                    <div className="-ml-2"> 
                        <Barcode 
                            value={barcodeValue} 
                            width={1.8} 
                            height={35} 
                            fontSize={12}
                            displayValue={false} 
                            margin={0}
                            textAlign="left"
                        />
                    </div>
                )}
            </div>

            {/* PAÍS INTERNACIONAL */}
            {getCountryDisplay()}

          </div>
        </div>

        {/* Separador */}
        <div className="border-t-4 border-black my-3"></div>

        {/* --- REMETENTE --- */}
        <div className="text-xs text-gray-800 pb-1">
          <h2 className="font-bold uppercase mb-1 text-black text-sm">Remetente</h2>
          <div className="leading-tight pl-1">
            <p className="uppercase font-bold">
                {sender.nome || "NOME DO REMETENTE"}
            </p>
            
            {sender.telefone && (
                <p className="uppercase font-bold mb-1">
                    FONE: {sender.telefone}
                </p>
            )}

            <p>{sender.logradouro}, {sender.numero} {sender.complemento}</p>
            <p>{sender.bairro} - {sender.localidade} / {sender.uf}</p>
            <p className="font-bold mt-1">
                {sender.cep} <span className="text-[10px] font-normal uppercase ml-2">BRASIL</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
});

ShippingLabel.displayName = 'ShippingLabel';