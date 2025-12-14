export type PhoneType = 'celular' | 'fixo';
export type DestinationType = 'nacional' | 'internacional';

// Novo: Item da Declaração
export interface DeclarationItem {
  descricao: string;
  quantidade: number;
  valor: number;
}

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
  tipoDestino: DestinationType;
  pais: string;
  // Novo: Lista de itens para a declaração
  itensDeclaracao: DeclarationItem[]; 
}

export type AddressType = 'remetente' | 'destinatario';

// Novo: Configurações de Impressão
export type ShippingMode = 'encomenda' | 'carta';
export interface PrintSettings {
  mode: ShippingMode;
  hasAR: boolean;
}