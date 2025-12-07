export type PhoneType = 'celular' | 'fixo';
export type DestinationType = 'nacional' | 'internacional';

export interface AddressData {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  nome: string;
  telefone: string;
  tipoTelefone: PhoneType;
  // Novos campos
  tipoDestino: DestinationType;
  pais: string; // Guardaremos o código do país (ex: 'US')
}

export type AddressType = 'remetente' | 'destinatario';