import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import DiagnosticModal from '../components/DiagnosticModal';

function Diagnostico() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="bg-zinc-900 rounded-lg p-8 mb-6">
        <h1 className="text-3xl font-bold text-white mb-3">Diagnóstico</h1>
        <p className="text-gray-400">Avalie a maturidade digital da sua empresa através de um diagnóstico completo e personalizado.</p>
      </div>

      <div className="bg-zinc-900 rounded-lg p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-4">Bem-vindo ao Diagnóstico de Maturidade Digital</h2>
          <p className="text-gray-300 mb-6">
            Nosso diagnóstico foi desenvolvido para ajudar sua empresa a entender seu nível atual de maturidade digital e identificar oportunidades de melhoria. 
            Através de uma série de perguntas cuidadosamente elaboradas, avaliaremos diferentes aspectos da sua organização, incluindo:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-8 space-y-2">
            <li>Estratégia digital</li>
            <li>Processos e operações</li>
            <li>Tecnologia e infraestrutura</li>
            <li>Cultura e pessoas</li>
            <li>Experiência do cliente</li>
          </ul>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
          >
            <PlayCircle size={20} />
            Iniciar Diagnóstico
          </button>
        </div>
      </div>

      <DiagnosticModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Diagnostico;