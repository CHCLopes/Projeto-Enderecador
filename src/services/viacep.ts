// AQUI: Adicione a palavra 'type' antes das chaves
import type { AddressData } from "../types";

export const fetchAddressByCep = async (cep: string): Promise<Partial<AddressData> | null> => {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    if (data.erro) return null;

    return {
      logradouro: data.logradouro,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
      cep: data.cep,
    };
  } catch (error) {
    console.error("Erro ao buscar CEP", error);
    return null;
  }
};