import React from 'react';
import { Github, Linkedin, Code } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#07426B] text-white mt-12 py-8 print:hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Lado Esquerdo: Propriedade Intelectual */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-1">Endereçador de Encomendas e Correspondências</h3>
            <p className="text-sm opacity-80">
              © {currentYear} Todos os direitos reservados.
            </p>
            <p className="text-xs opacity-60 mt-1">
              Desenvolvido para otimização logística e uso comum.
            </p>
          </div>

          {/* Lado Direito: Contato e Créditos */}
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center gap-2 mb-2 text-sm font-medium">
              <Code size={16} />
              <span>Desenvolvido por Carlos Lopes "Sk8"</span>
            </div>
            
            <div className="flex gap-4">
              <a 
                href="https://www.linkedin.com/in/carlos-lopes-b445aa201" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition-colors flex items-center gap-1 text-sm"
                title="LinkedIn"
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </a>
              
              <a 
                href="https://github.com/CHCLopes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition-colors flex items-center gap-1 text-sm"
                title="GitHub"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
            </div>
          </div>

        </div>
        
        {/* Linha Divisória Sutil */}
        <div className="border-t border-white/20 mt-6 pt-4 text-center text-xs opacity-50">
            Projeto construído com React, Tailwind CSS e TypeScript.
        </div>
      </div>
    </footer>
  );
};