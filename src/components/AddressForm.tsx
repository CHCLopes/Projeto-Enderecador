import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { AddressData, AddressType, PhoneType } from '../types';
import { fetchAddressByCep } from '../services/viacep';
import { COUNTRIES } from '../constants/countries';

interface Props {
  title: string;
  type: AddressType;
  data: AddressData;
  onChange: (type: AddressType, field: keyof AddressData, value: string) => void;
  onAutoFill: (type: AddressType, data: Partial<AddressData>) => void;
}

export const AddressForm: React.FC<Props> = ({ title, type, data, onChange, onAutoFill }) => {
  const [loading, setLoading] = useState(false);

  const handleCepBlur = async () => {
    if (!data.cep) return;
    setLoading(true);
    const address = await fetchAddressByCep(data.cep);
    if (address) {
      onAutoFill(type, address);
    }
    setLoading(false);
  };

  const fieldId = (field: string) => `${field}-${type}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        {title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* NOVIDADE: SELETOR NACIONAL/INTERNACIONAL (Só aparece para destinatário) */}
        {type === 'destinatario' && (
             <div className="md:col-span-2 bg-blue-50 p-3 rounded-md border border-blue-100 mb-2">
                <label className="block text-sm font-bold text-[#07426B] mb-2">
                    Tipo de Envio
                </label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="radio" 
                            name="destino" 
                            checked={data.tipoDestino === 'nacional'}
                            onChange={() => onChange(type, 'tipoDestino', 'nacional')}
                            className="text-[#07426B] focus:ring-[#07426B]"
                        />
                        <span>Nacional 🇧🇷</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="radio" 
                            name="destino" 
                            checked={data.tipoDestino === 'internacional'}
                            onChange={() => onChange(type, 'tipoDestino', 'internacional')}
                            className="text-[#07426B] focus:ring-[#07426B]"
                        />
                        <span>Internacional 🌎</span>
                    </label>
                </div>
             </div>
        )}

        {/* NOME */}
        <div className="md:col-span-2">
          <label htmlFor={fieldId('nome')} className="block text-sm font-medium text-gray-700">
            Nome Completo / Razão Social
          </label>
          <input
            id={fieldId('nome')}
            type="text"
            value={data.nome}
            onChange={(e) => onChange(type, 'nome', e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ex: João Silva"
          />
        </div>

        {/* TELEFONE */}
        <div className="md:col-span-2">
          <label htmlFor={fieldId('telefone')} className="block text-sm font-medium text-gray-700">
            Telefone / Contato
          </label>
          <div className="flex mt-1 gap-2">
            <select
                id={fieldId('tipoTelefone')}
                value={data.tipoTelefone}
                onChange={(e) => onChange(type, 'tipoTelefone', e.target.value as PhoneType)}
                className="w-1/3 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 cursor-pointer text-gray-700"
            >
                <option value="celular">Celular 📱</option>
                <option value="fixo">Fixo ☎️</option>
            </select>

            <input
                id={fieldId('telefone')}
                type="text"
                value={data.telefone}
                onChange={(e) => onChange(type, 'telefone', e.target.value)}
                className="w-2/3 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="(00) 00000-0000"
            />
          </div>
        </div>

        {/* CEP */}
        <div className="relative">
          <label htmlFor={fieldId('cep')} className="block text-sm font-medium text-gray-700">
            CEP / ZIP Code
          </label>
          <div className="relative mt-1">
            <input
              id={fieldId('cep')}
              type="text"
              value={data.cep}
              onChange={(e) => onChange(type, 'cep', e.target.value)}
              onBlur={handleCepBlur}
              className="w-full p-2 pr-12 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={data.tipoDestino === 'internacional' ? "ZIP Code" : "00000-000"}
              maxLength={data.tipoDestino === 'internacional' ? 20 : 9}
            />
            <button 
                onClick={handleCepBlur}
                className="absolute right-1 top-1 bottom-1 aspect-square bg-[#07426B] text-white rounded flex items-center justify-center hover:opacity-90 transition-opacity"
                title="Buscar CEP (Brasil)" 
                type="button" 
            >
                {loading ? '...' : <Search size={20} />}
            </button>
          </div>
        </div>

        {/* UF */}
        <div>
          <label htmlFor={fieldId('uf')} className="block text-sm font-medium text-gray-700">
            UF / State
          </label>
          <input
            id={fieldId('uf')}
            type="text"
            value={data.uf}
            onChange={(e) => onChange(type, 'uf', e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded bg-gray-50"
            placeholder="UF"
          />
        </div>

        {/* CIDADE */}
        <div className="md:col-span-2">
            <label htmlFor={fieldId('localidade')} className="block text-sm font-medium text-gray-700">
              Cidade / City
            </label>
            <input
                id={fieldId('localidade')}
                type="text"
                value={data.localidade}
                onChange={(e) => onChange(type, 'localidade', e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded bg-gray-50"
                placeholder="Cidade"
            />
        </div>

        {/* LOGRADOURO */}
        <div className="md:col-span-2">
          <label htmlFor={fieldId('logradouro')} className="block text-sm font-medium text-gray-700">
            Logradouro / Address
          </label>
          <input
            id={fieldId('logradouro')}
            type="text"
            value={data.logradouro}
            onChange={(e) => onChange(type, 'logradouro', e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            placeholder="Rua, Avenida, etc."
          />
        </div>

        {/* NÚMERO */}
        <div>
          <label htmlFor={fieldId('numero')} className="block text-sm font-medium text-gray-700">
            Número
          </label>
          <input
            id={fieldId('numero')}
            type="text"
            value={data.numero}
            onChange={(e) => onChange(type, 'numero', e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            placeholder="Nº"
          />
        </div>

        {/* COMPLEMENTO */}
        <div>
          <label htmlFor={fieldId('complemento')} className="block text-sm font-medium text-gray-700">
            Complemento
          </label>
          <input
            id={fieldId('complemento')}
            type="text"
            value={data.complemento}
            onChange={(e) => onChange(type, 'complemento', e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            placeholder="Apto, Bloco"
          />
        </div>
        
        {/* BAIRRO */}
        <div className="md:col-span-2">
          <label htmlFor={fieldId('bairro')} className="block text-sm font-medium text-gray-700">
            Bairro / District
          </label>
          <input
            id={fieldId('bairro')}
            type="text"
            value={data.bairro}
            onChange={(e) => onChange(type, 'bairro', e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            placeholder="Bairro"
          />
        </div>

        {/* NOVIDADE: PESQUISA DE PAÍS (Só se for Internacional e Destinatário) */}
        {type === 'destinatario' && data.tipoDestino === 'internacional' && (
            <div className="md:col-span-2 mt-2 bg-yellow-50 p-4 rounded border border-yellow-200">
                <label htmlFor={fieldId('pais')} className="block text-sm font-bold text-gray-800 mb-1">
                    País de Destino (Pesquisar)
                </label>
                <input
                    id={fieldId('pais')}
                    list="paises-list"
                    value={data.pais}
                    onChange={(e) => onChange(type, 'pais', e.target.value)}
                    className="w-full p-3 border border-gray-400 rounded focus:ring-2 focus:ring-yellow-500 font-bold"
                    placeholder="Digite para pesquisar o país..."
                    autoComplete="off"
                />
                <datalist id="paises-list">
                    {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                            {c.pt} / {c.en}
                        </option>
                    ))}
                </datalist>
                <p className="text-xs text-gray-500 mt-1">
                    * Selecione na lista. O nome aparecerá em Português e Inglês na etiqueta.
                </p>
            </div>
        )}

      </div>
    </div>
  );
};