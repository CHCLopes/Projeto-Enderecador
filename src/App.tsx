import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Plus, Trash2, Users, Package, Mail, CheckSquare, Square, CircleHelp } from 'lucide-react';
import { AddressForm } from './components/AddressForm';
import { PrintLayout } from './components/PrintLayout';
import { Footer } from './components/Footer';
import { HelpModal } from './components/HelpModal';
// CORREÇÃO: Removido 'DeclarationItem' da importação abaixo
import type { AddressData, AddressType, PrintSettings } from './types';
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
  pais: '',
  itensDeclaracao: []
};

function App() {
  const [sender, setSender] = useState<AddressData>(initialAddress);
  const [currentRecipient, setCurrentRecipient] = useState<AddressData>(initialAddress);
  const [recipientsList, setRecipientsList] = useState<AddressData[]>([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    mode: 'encomenda',
    hasAR: false
  });

  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemQtd, setNewItemQtd] = useState<number>(1);
  const [newItemVal, setNewItemVal] = useState<string>(''); 

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Etiquetas-${printSettings.mode}-${new Date().toISOString().split('T')[0]}`,
  });

  const handleAddressChange = (type: AddressType, field: keyof AddressData, value: string) => {
    if (type === 'remetente') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSender(prev => ({ ...prev, [field]: value as any }));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCurrentRecipient(prev => ({ ...prev, [field]: value as any }));
    }
  };

  const handleAutoFill = (type: AddressType, data: Partial<AddressData>) => {
    if (type === 'remetente') {
      setSender(prev => ({ ...prev, ...data }));
    } else {
      setCurrentRecipient(prev => ({ ...prev, ...data }));
    }
  };

  const addItemToRecipient = () => {
    if(!newItemDesc) return;
    
    const finalValue = newItemVal === '' ? 0 : parseFloat(newItemVal);

    setCurrentRecipient(prev => ({
        ...prev,
        itensDeclaracao: [...prev.itensDeclaracao, { 
            descricao: newItemDesc, 
            quantidade: newItemQtd, 
            valor: finalValue 
        }]
    }));
    
    setNewItemDesc('');
    setNewItemQtd(1);
    setNewItemVal('');
  };

  const removeItemFromRecipient = (idx: number) => {
    setCurrentRecipient(prev => ({
        ...prev,
        itensDeclaracao: prev.itensDeclaracao.filter((_, i) => i !== idx)
    }));
  };

  const addRecipientToList = () => {
    if (!currentRecipient.nome || !currentRecipient.cep) {
      alert("Preencha pelo menos Nome e CEP do destinatário.");
      return;
    }
    setRecipientsList([...recipientsList, currentRecipient]);
    setCurrentRecipient({ ...initialAddress, itensDeclaracao: [] });
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
          
          <header className="max-w-7xl mx-auto mb-6 print:hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center justify-center gap-4">
                        <img src="/LogoECT.svg" alt="Logo Correios" width={140} className="h-auto" />
                        <div className="border-l border-gray-300 pl-4 text-left">
                            <h1 className="text-2xl font-bold text-[#07426B]">Endereçador</h1>
                            <p className="text-xs text-gray-500">Expedição Completa</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setIsHelpOpen(true)}
                        className="md:ml-4 flex items-center gap-1 text-[#07426B] hover:text-blue-500 transition-colors bg-white px-3 py-1.5 rounded-full shadow-sm border border-blue-100"
                    >
                        <CircleHelp size={20} />
                        <span className="font-bold text-sm">AJUDA</span>
                    </button>
                </div>
                
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
            </div>
          </header>

          <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-4 space-y-6 print:hidden">
              
              <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
                <h3 className="font-bold text-[#07426B] mb-3 flex items-center gap-2">Configuração de Envio</h3>
                
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setPrintSettings(p => ({ ...p, mode: 'encomenda' }))}
                            className={clsx("flex-1 py-2 px-3 rounded border flex items-center justify-center gap-2 text-sm font-medium transition-colors", 
                                printSettings.mode === 'encomenda' 
                                    ? "bg-[#07426B] border-[#07426B] text-white" 
                                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-50")}
                        >
                            <Package size={18} /> Encomenda
                        </button>
                        <button 
                            onClick={() => setPrintSettings(p => ({ ...p, mode: 'carta' }))}
                            className={clsx("flex-1 py-2 px-3 rounded border flex items-center justify-center gap-2 text-sm font-medium transition-colors", 
                                printSettings.mode === 'carta' 
                                    ? "bg-[#07426B] border-[#07426B] text-white" 
                                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-50")}
                        >
                            <Mail size={18} /> Carta
                        </button>
                    </div>

                    <button 
                        onClick={() => setPrintSettings(p => ({ ...p, hasAR: !p.hasAR }))}
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
                    >
                        {printSettings.hasAR ? <CheckSquare className="text-[#07426B]" /> : <Square className="text-gray-400" />}
                        Incluir Aviso de Recebimento (AR)
                    </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg">
                <AddressForm title="1. Remetente" type="remetente" data={sender} onChange={handleAddressChange} onAutoFill={handleAutoFill} />
              </div>

              <div className="relative">
                <AddressForm title="2. Destinatário" type="destinatario" data={currentRecipient} onChange={handleAddressChange} onAutoFill={handleAutoFill} />
                
                {printSettings.mode === 'encomenda' && (
                    <div className="bg-white p-4 rounded-lg shadow border border-blue-200 mt-4">
                        <h4 className="font-bold text-[#07426B] text-sm mb-3 border-b border-blue-100 pb-1">
                            Itens da Declaração de Conteúdo
                        </h4>
                        
                        <div className="flex flex-col md:flex-row gap-2 items-stretch">
                            <div className="flex-1 flex flex-col gap-2">
                                <div>
                                    <label className="block text-xs font-bold text-[#07426B] mb-1 pl-1">Descrição do Item</label>
                                    <input 
                                        placeholder="Ex: Camiseta" 
                                        value={newItemDesc}
                                        onChange={e => setNewItemDesc(e.target.value)}
                                        className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#07426B] outline-none"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-1/3">
                                        <label className="block text-xs font-bold text-[#07426B] mb-1 text-center">Qtd.</label>
                                        <input 
                                            type="number" 
                                            placeholder="1" 
                                            value={newItemQtd}
                                            onChange={e => setNewItemQtd(parseInt(e.target.value) || 0)}
                                            className="w-full p-2 text-sm border border-gray-300 rounded text-center focus:ring-1 focus:ring-[#07426B] outline-none"
                                        />
                                    </div>
                                    <div className="w-2/3">
                                        <label className="block text-xs font-bold text-[#07426B] mb-1 text-right pr-1">Valor (R$)</label>
                                        <input 
                                            type="number" 
                                            placeholder="0,00" 
                                            value={newItemVal}
                                            onChange={e => setNewItemVal(e.target.value)}
                                            className="w-full p-2 text-sm border border-gray-300 rounded text-right focus:ring-1 focus:ring-[#07426B] outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-24 flex items-end">
                                <button 
                                    onClick={addItemToRecipient} 
                                    className="w-full bg-[#07426B] text-white rounded hover:bg-[#095285] transition-colors flex items-center justify-center text-xs font-bold leading-tight text-center shadow-sm p-3 md:p-2 md:h-[calc(100%-4px)]"
                                    title="Adicionar Item"
                                >
                                    Adicionar<br className="hidden md:inline"/> Item
                                </button>
                            </div>
                        </div>

                        {currentRecipient.itensDeclaracao.length > 0 && (
                            <ul className="bg-gray-50 rounded border border-gray-200 text-xs divide-y divide-gray-200 mt-2">
                                {currentRecipient.itensDeclaracao.map((item, idx) => (
                                    <li key={idx} className="p-2 flex justify-between items-center hover:bg-gray-100 transition-colors">
                                        <span className="text-gray-700">
                                            <strong>{item.quantidade}x</strong> {item.descricao} (R$ {item.valor.toFixed(2)})
                                        </span>
                                        <button 
                                            onClick={() => removeItemFromRecipient(idx)} 
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"
                                            title="Remover Item"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                <button 
                    onClick={addRecipientToList}
                    className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-bold shadow flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
                >
                    <Plus size={20} />
                    Adicionar à Fila de Impressão
                </button>
                
                <div className="lg:hidden mt-3 flex justify-center">
                    <div className="bg-white px-4 py-2 rounded-full shadow border border-gray-200 text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Users size={16} />
                        {recipientsList.length} na fila
                    </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
                
                <div className="print:hidden">
                    {hasLabels ? (
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
                             <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                    <Users size={18} /> Fila: {printSettings.mode.toUpperCase()} {printSettings.hasAR ? '+ AR' : ''}
                                </h3>
                                <button 
                                    onClick={() => setRecipientsList([])} 
                                    className="text-xs text-red-500 hover:underline"
                                    title="Limpar toda a fila"
                                >
                                    Limpar tudo
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                                {recipientsList.map((rec, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200 text-sm">
                                        <div>
                                            <p className="font-bold">{rec.nome}</p>
                                            <p className="text-gray-500">{rec.localidade}/{rec.uf}</p>
                                            {rec.itensDeclaracao.length > 0 && <span className="text-xs text-[#07426B] font-medium">{rec.itensDeclaracao.length} itens declarados</span>}
                                        </div>
                                        <button 
                                            onClick={() => removeRecipient(idx)} 
                                            className="text-red-500 hover:bg-red-50 p-2 rounded"
                                            title="Remover Destinatário"
                                            aria-label="Remover Destinatário"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        null
                    )}
                </div>

                <div className="lg:hidden mb-4 print:hidden">
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

                <div className="bg-gray-300 p-8 rounded-lg min-h-[500px] flex justify-center items-start overflow-hidden print:bg-white print:p-0 print:block print:overflow-visible print:min-h-0">
                    
                    <div className="transform scale-[0.45] sm:scale-[0.6] md:scale-[0.75] lg:scale-100 origin-top lg:origin-center transition-transform">
                        <PrintLayout 
                            ref={componentRef}
                            sender={sender}
                            recipients={recipientsList.length > 0 ? recipientsList : [currentRecipient]}
                            settings={printSettings}
                        />
                    </div>
                </div>

            </div>
          </main>
      </div>
      
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <Footer />
    </div>
  );
}

export default App;