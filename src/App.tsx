import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Plus, Trash2, Users } from 'lucide-react';
import { AddressForm } from './components/AddressForm';
import { ShippingLabel } from './components/ShippingLabel';
import { Footer } from './components/Footer';
import type { AddressData, AddressType } from './types';
import clsx from 'clsx';

const initialAddress: AddressData = {
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  localidade: '',
  uf: '',
  nome: '',
  telefone: '',
  tipoTelefone: 'celular',
  tipoDestino: 'nacional',
  pais: ''
};

// CORREÇÃO: O componente HelpMessage foi movido para fora da função App
const HelpMessage = () => (
  <div className="bg-blue-100 p-4 rounded-lg border border-blue-400-200 text-[#07426B] text-sm text-center mb-6">
      <p>
        <strong className="text-red-600 font-medium text-2xl"> 
          Como usar este endereçador
        </strong><br />
        Siga os passos abaixo para criar e imprimir suas etiquetas de envio:
      </p>
      <ol className="list-inside text-left mt-3 space-y-2">
        <li>1. Preencha os dados do remetente e do destinatário.
          <br /> 🔶 Você pode pesquisar os CEPs, mas não é obrigatório, a etiqueta será gerada com os dados preenchidos.
          <br /> 🔶 Números de Telefone podem ser preenchidos livremente, então sempre confira após a digitação.
        </li>
        <li>2. Clique em "Adicionar à Fila de Impressão".</li>
        <li>3. Para mais etiquetas basta digitar os novos destinatários se o remetente for o mesmo. 
          <br /> 🔶 Não existe limite na quantidade de etiquetas, elas serão impressas 4 por Página.
        </li>
        <li>4. Clique em "Imprimir Rótulos" para gerar o PDF ou Imprimir.</li>
      </ol>
      <p className="mt-2 text-red-600 font-medium text-left">Para mais de etiquetas, basta mudar o destinatário e clicar em "Adicionar" novamente.</p>
  </div>
);

function App() {
  const [sender, setSender] = useState<AddressData>(initialAddress);
  const [currentRecipient, setCurrentRecipient] = useState<AddressData>(initialAddress);
  const [recipientsList, setRecipientsList] = useState<AddressData[]>([]);
  
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Etiquetas-Correios-${new Date().toISOString().split('T')[0]}`,
  });

  const handleAddressChange = (type: AddressType, field: keyof AddressData, value: string) => {
    if (type === 'remetente') {
      setSender(prev => ({ ...prev, [field]: value }));
    } else {
      setCurrentRecipient(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAutoFill = (type: AddressType, data: Partial<AddressData>) => {
    if (type === 'remetente') {
      setSender(prev => ({ ...prev, ...data }));
    } else {
      setCurrentRecipient(prev => ({ ...prev, ...data }));
    }
  };

  const addRecipientToList = () => {
    if (!currentRecipient.nome || !currentRecipient.cep) {
      alert("Preencha pelo menos Nome e CEP do destinatário.");
      return;
    }
    setRecipientsList([...recipientsList, currentRecipient]);
    setCurrentRecipient(initialAddress);
  };

  const removeRecipient = (index: number) => {
    const newList = recipientsList.filter((_, i) => i !== index);
    setRecipientsList(newList);
  };

  const hasLabels = recipientsList.length > 0;
  
  const getPrintButtonText = () => {
    if (!hasLabels) return "Preencha a etiqueta";
    if (recipientsList.length === 1) return "Imprimir Rótulo";
    return "Imprimir Rótulos";
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <div className="flex-1 p-4 md:p-6">
          
          {/* HEADER */}
          <header className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-4">
                {/* LOGO ALTERADO: public/LogoECT.svg com width 140 */}
                <img 
                    src="/LogoECT.svg" 
                    alt="Logo Correios" 
                    width={140}
                    className="h-auto"
                />
                
                <div className="border-l border-gray-300 pl-4">
                  <h1 className="text-2xl font-bold text-[#07426B]">Endereçador</h1>
                  <p className="text-xs text-gray-500">Padrão 1/4 Página (A6) com Código de Barras</p>
                </div>
            </div>
            
            {/* BOTÕES DE AÇÃO (Visíveis APENAS NO DESKTOP) */}
            <div className="hidden lg:flex gap-3">
                <div className="bg-white px-4 py-2 rounded-lg shadow text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Users size={16} />
                    {recipientsList.length} na fila
                </div>
                
                <button
                    onClick={() => handlePrint && handlePrint()}
                    disabled={!hasLabels}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors shadow-lg text-white",
                        !hasLabels ? "bg-red-500 cursor-not-allowed opacity-80" : "bg-teal-600 hover:bg-teal-700"
                    )}
                >
                    <Printer size={20} />
                    {getPrintButtonText()}
                </button>
            </div>
          </header>

          <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* TEXTO DE AJUDA (Visível APENAS NO MOBILE - Topo) */}
            {!hasLabels && (
                <div className="lg:hidden col-span-1 print:hidden">
                    <HelpMessage />
                </div>
            )}

            {/* COLUNA ESQUERDA: FORMULÁRIOS */}
            <div className="lg:col-span-4 space-y-6 print:hidden">
              <div className="bg-blue-50 border border-blue-100 rounded-lg">
                <AddressForm 
                    title="1. Dados do Remetente (Fixo)" 
                    type="remetente"
                    data={sender}
                    onChange={handleAddressChange}
                    onAutoFill={handleAutoFill}
                />
              </div>

              <div className="relative">
                <AddressForm 
                    title="2. Novo Destinatário" 
                    type="destinatario"
                    data={currentRecipient}
                    onChange={handleAddressChange}
                    onAutoFill={handleAutoFill}
                />
                <button 
                    onClick={addRecipientToList}
                    className="w-full mt-2 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-bold shadow flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                    <Plus size={20} />
                    Adicionar à Fila de Impressão
                </button>
                
                {/* CONTADOR DE FILA (Visível APENAS NO MOBILE - Após o botão adicionar) */}
                <div className="lg:hidden mt-3 flex justify-center">
                    <div className="bg-white px-4 py-2 rounded-full shadow border border-gray-200 text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Users size={16} />
                        {recipientsList.length} na fila de impressão
                    </div>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: PREVIEW E LISTA */}
            <div className="lg:col-span-8">
                
                {/* LISTA DE ITENS NA FILA (Desktop e Mobile) */}
                <div className="print:hidden">
                    {hasLabels ? (
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
                            <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <Users size={18} /> Fila de Impressão
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                                {recipientsList.map((rec, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200 text-sm">
                                        <div>
                                            <p className="font-bold">{rec.nome}</p>
                                            <p className="text-gray-500">{rec.localidade}/{rec.uf}</p>
                                        </div>
                                        <button 
                                            onClick={() => removeRecipient(idx)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded"
                                            title="Remover"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* TEXTO DE AJUDA (Visível APENAS NO DESKTOP - Coluna Direita) */
                        <div className="hidden lg:block">
                             <HelpMessage />
                        </div>
                    )}
                </div>

                {/* ÁREA DE PREVIEW / IMPRESSÃO */}
                <div className="bg-gray-300 p-8 rounded-lg overflow-x-auto min-h-[500px] flex justify-center items-start print:bg-white print:p-0 print:block print:overflow-visible print:min-h-0">
                    <div 
                        ref={componentRef} 
                        className="w-fit bg-white p-0 print:w-full grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-0"
                    >
                        {/* Preview Fantasma */}
                        {!hasLabels && (
                            <div className="opacity-50 pointer-events-none grayscale md:col-span-2 flex justify-center p-4">
                                <ShippingLabel sender={sender} recipient={currentRecipient} />
                            </div>
                        )}

                        {recipientsList.map((recipient, index) => (
                            <div key={index} className="flex justify-center p-2 border border-gray-100 border-dashed print:border-none print:p-0">
                                <ShippingLabel sender={sender} recipient={recipient} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* BOTÃO IMPRIMIR (Visível APENAS NO MOBILE - Fim da Tela) */}
                <div className="lg:hidden mt-8 mb-4 print:hidden">
                    <button
                        onClick={() => handlePrint && handlePrint()}
                        disabled={!hasLabels}
                        className={clsx(
                            "w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg text-white",
                            !hasLabels ? "bg-red-500 cursor-not-allowed opacity-80" : "bg-teal-600 hover:bg-teal-700 animate-pulse"
                        )}
                    >
                        <Printer size={24} />
                        {getPrintButtonText()}
                    </button>
                </div>

            </div>
          </main>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;