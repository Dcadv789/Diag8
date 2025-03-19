import React, { useState } from 'react';
import { BarChart3, TrendingUp, Award, ChevronDown, ChevronUp, Trash2, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';
import { useDiagnosticCalculation } from '../hooks/useDiagnosticCalculation';
import { supabase } from '../lib/supabase';
import ExportPDF from '../components/ExportPDF';
import type { DiagnosticResult, PillarScore } from '../types/diagnostic';

function DiagnosticCard({ result, onDelete }: { result: DiagnosticResult; onDelete: (id: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maturityLevel = getMaturityLevel(Math.round(result.totalScore));
  const { best, worst } = getBestAndWorstPillars(result.pillarScores);
  const recommendation = getRecommendation(Math.round(result.totalScore));

  return (
    <div className="bg-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-grow">
          <p className="text-white">{result.companyData.nome}</p>
          <span className="text-gray-400">•</span>
          <p className="text-white">{result.companyData.empresa}</p>
          <span className="text-gray-400">•</span>
          <p className="text-gray-400">CNPJ: {result.companyData.cnpj}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-400">Pontuação</p>
            <p className="text-xl font-bold text-white">{Math.round(result.totalScore)} pontos</p>
          </div>
          <ExportPDF result={result} />
          <button
            onClick={() => onDelete(result.id)}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors text-red-500 hover:text-red-400"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="text-gray-400" />
            ) : (
              <ChevronDown className="text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Informações da Empresa</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-gray-400">Nome do Responsável:</span>{' '}
                  <span className="text-white">{result.companyData.nome}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-400">Tem Sócios:</span>{' '}
                  <span className="text-white">{result.companyData.temSocios === 'sim' ? 'Sim' : 'Não'}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-400">Funcionários:</span>{' '}
                  <span className="text-white">{result.companyData.numeroFuncionarios}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-400">Faturamento:</span>{' '}
                  <span className="text-white">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(result.companyData.faturamento)}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Dados Adicionais</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-gray-400">Tempo de Atividade:</span>{' '}
                  <span className="text-white">{result.companyData.tempoAtividade}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-400">Localização:</span>{' '}
                  <span className="text-white">{result.companyData.localizacao}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-400">Forma Jurídica:</span>{' '}
                  <span className="text-white">{result.companyData.formaJuridica}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-zinc-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <ThumbsUp size={24} className="text-green-500" />
                <h3 className="text-lg font-medium text-white">Melhor Desempenho</h3>
              </div>
              <p className="text-2xl font-bold text-white mb-2">{best.pillarName}</p>
              <p className="text-gray-400">{Math.round(best.score)} pontos</p>
              <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden mt-4">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${best.percentageScore}%` }}
                />
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <ThumbsDown size={24} className="text-red-500" />
                <h3 className="text-lg font-medium text-white">Precisa de Atenção</h3>
              </div>
              <p className="text-2xl font-bold text-white mb-2">{worst.pillarName}</p>
              <p className="text-gray-400">{Math.round(worst.score)} pontos</p>
              <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden mt-4">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-300"
                  style={{ width: `${worst.percentageScore}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-4">Pontuação por Pilar</h4>
            <div className="space-y-3">
              {result.pillarScores.map((pillar) => (
                <div key={pillar.pillarId} className="bg-zinc-900 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-white">{pillar.pillarName}</h3>
                    <p className="text-xs font-medium text-gray-400">
                      {Math.round(pillar.score)} / {pillar.maxPossibleScore} pontos
                    </p>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${pillar.percentageScore}%` }}
                    />
                  </div>
                  <p className="text-right text-xs text-gray-400 mt-1">
                    {Math.round(pillar.score)} pontos
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <TrendingUp size={24} className="text-green-500 mx-auto mb-2" />
              <p className="text-base font-medium text-white mb-1">
                {Math.round(result.maxPossibleScore)} pontos
              </p>
              <p className="text-xs text-gray-400">Pontuação Máxima</p>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <BarChart3 size={24} className="text-blue-500 mx-auto mb-2" />
              <p className="text-base font-medium text-white mb-1">
                75 pontos
              </p>
              <p className="text-xs text-gray-400">Pontuação Recomendada</p>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <Award size={24} className="text-yellow-500 mx-auto mb-2" />
              <p className="text-base font-medium text-white mb-1">
                {Math.round(result.totalScore)} pontos
              </p>
              <p className="text-xs text-gray-400">Pontuação Final</p>
            </div>
          </div>

          <div className="bg-zinc-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Maturidade do Negócio</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className={`p-6 rounded-lg border-2 ${
                maturityLevel.level === 'Inicial' 
                  ? 'border-blue-500 bg-blue-500/20' 
                  : 'border-zinc-700 bg-zinc-700/50'
              }`}>
                <h4 className="text-lg font-medium text-white mb-2">Inicial</h4>
                <p className="text-gray-400 text-sm">
                  O negócio está começando ou ainda não possui processos bem definidos.
                </p>
              </div>
              <div className={`p-6 rounded-lg border-2 ${
                maturityLevel.level === 'Em Desenvolvimento'
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-zinc-700 bg-zinc-700/50'
              }`}>
                <h4 className="text-lg font-medium text-white mb-2">Em Desenvolvimento</h4>
                <p className="text-gray-400 text-sm">
                  O negócio já possui alguns processos organizados, mas ainda enfrenta desafios.
                </p>
              </div>
              <div className={`p-6 rounded-lg border-2 ${
                maturityLevel.level === 'Consolidado'
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-zinc-700 bg-zinc-700/50'
              }`}>
                <h4 className="text-lg font-medium text-white mb-2">Consolidado</h4>
                <p className="text-gray-400 text-sm">
                  O negócio tem processos bem estabelecidos e está em fase de expansão.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb size={24} className="text-yellow-500" />
              <h3 className="text-xl font-semibold text-white">Recomendações</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function getBestAndWorstPillars(pillarScores: PillarScore[]): { best: PillarScore; worst: PillarScore } {
  const sortedPillars = [...pillarScores].sort((a, b) => b.percentageScore - a.percentageScore);
  return {
    best: sortedPillars[0],
    worst: sortedPillars[sortedPillars.length - 1]
  };
}

function getMaturityLevel(score: number): {
  level: string;
  description: string;
} {
  if (score <= 40) {
    return {
      level: 'Inicial',
      description: 'O negócio está começando ou ainda não possui processos bem definidos. Planejamento e estruturação são prioridades.'
    };
  } else if (score <= 70) {
    return {
      level: 'Em Desenvolvimento',
      description: 'O negócio já possui alguns processos organizados, mas ainda enfrenta desafios para alcançar estabilidade e crescimento consistente.'
    };
  } else {
    return {
      level: 'Consolidado',
      description: 'O negócio tem processos bem estabelecidos, boa gestão e está em um estágio de expansão ou consolidação no mercado.'
    };
  }
}

function getRecommendation(score: number): string {
  if (score <= 40) {
    return "Priorize a criação de um planejamento estratégico básico, organize as finanças e defina processos essenciais para o funcionamento do negócio. Considere buscar orientação de um consultor para acelerar essa estruturação.";
  } else if (score <= 70) {
    return "Foco em otimizar os processos existentes, investir em capacitação da equipe e melhorar a gestão financeira. Avalie ferramentas que possam automatizar operações e aumentar a eficiência.";
  } else {
    return "Concentre-se na inovação, expansão de mercado e diversificação de produtos/serviços. Invista em estratégias de marketing e mantenha um controle financeiro rigoroso para sustentar o crescimento.";
  }
}

function Resultados() {
  const { results, loading } = useDiagnosticCalculation();
  const [isLatestExpanded, setIsLatestExpanded] = useState(false);
  const latestResult = results[0];

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('diagnostic_results')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Atualiza a lista removendo o resultado deletado
      const updatedResults = results.filter(result => result.id !== id);
      setResults(updatedResults);
    } catch (error) {
      console.error('Erro ao deletar resultado:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Carregando resultados...</div>
      </div>
    );
  }

  if (!latestResult) {
    return (
      <div>
        <div className="bg-zinc-900 rounded-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-white mb-3">Resultados</h1>
          <p className="text-gray-400">Visualize e analise os resultados detalhados do seu diagnóstico de maturidade digital.</p>
        </div>

        <div className="bg-zinc-900 rounded-lg p-8">
          <div className="text-center py-12">
            <TrendingUp size={48} className="text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              Nenhum diagnóstico realizado ainda. Complete um diagnóstico para ver seus resultados aqui.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const { best, worst } = getBestAndWorstPillars(latestResult.pillarScores);
  const maturityLevel = getMaturityLevel(Math.round(latestResult.totalScore));
  const recommendation = getRecommendation(Math.round(latestResult.totalScore));

  return (
    <div>
      <div className="bg-zinc-900 rounded-lg p-8 mb-6">
        <h1 className="text-3xl font-bold text-white mb-3">Resultados</h1>
        <p className="text-gray-400">Visualize e analise os resultados detalhados do seu diagnóstico de maturidade digital.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900 rounded-lg p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">Último Diagnóstico</h2>
                <p className="text-gray-400">Realizado em {formatDate(latestResult.date)}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Pontuação Geral</p>
                  <p className="text-3xl font-bold text-white">
                    {Math.round(latestResult.totalScore)} pontos
                  </p>
                </div>
                <ExportPDF result={latestResult} />
                <button
                  onClick={() => handleDelete(latestResult.id)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-red-500 hover:text-red-400"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-grow">
                  <p className="text-white">{latestResult.companyData.nome}</p>
                  <span className="text-gray-400">•</span>
                  <p className="text-white">{latestResult.companyData.empresa}</p>
                  <span className="text-gray-400">•</span>
                  <p className="text-gray-400">CNPJ: {latestResult.companyData.cnpj}</p>
                </div>
                <button
                  onClick={() => setIsLatestExpanded(!isLatestExpanded)}
                  className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  {isLatestExpanded ? (
                    <ChevronUp className="text-gray-400" />
                  ) : (
                    <ChevronDown className="text-gray-400" />
                  )}
                </button>
              </div>

              {isLatestExpanded && (
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Informações da Empresa</h4>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="text-gray-400">Nome do Responsável:</span>{' '}
                          <span className="text-white">{latestResult.companyData.nome}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Tem Sócios:</span>{' '}
                          <span className="text-white">{latestResult.companyData.temSocios === 'sim' ? 'Sim' : 'Não'}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Funcionários:</span>{' '}
                          <span className="text-white">{latestResult.companyData.numeroFuncionarios}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Faturamento:</span>{' '}
                          <span className="text-white">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(latestResult.companyData.faturamento)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Dados Adicionais</h4>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="text-gray-400">Tempo de Atividade:</span>{' '}
                          <span className="text-white">{latestResult.companyData.tempoAtividade}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Localização:</span>{' '}
                          <span className="text-white">{latestResult.companyData.localizacao}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Forma Jurídica:</span>{' '}
                          <span className="text-white">{latestResult.companyData.formaJuridica}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className="bg-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ThumbsUp size={24} className="text-green-500" />
                  <h3 className="text-lg font-medium text-white">Melhor Desempenho</h3>
                </div>
                <p className="text-2xl font-bold text-white mb-2">{best.pillarName}</p>
                <p className="text-gray-400">{Math.round(best.score)} pontos</p>
                <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden mt-4">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${best.percentageScore}%` }}
                  />
                </div>
              </div>

              <div className="bg-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ThumbsDown size={24} className="text-red-500" />
                  <h3 className="text-lg font-medium text-white">Precisa de Atenção</h3>
                </div>
                <p className="text-2xl font-bold text-white mb-2">{worst.pillarName}</p>
                <p className="text-gray-400">{Math.round(worst.score)} pontos</p>
                <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden mt-4">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-300"
                    style={{ width: `${worst.percentageScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {latestResult.pillarScores.map((pillar) => (
                <div key={pillar.pillarId} className="bg-zinc-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-white">{pillar.pillarName}</h3>
                    <p className="text-sm font-medium text-gray-400">
                      {Math.round(pillar.score)} / {pillar.maxPossibleScore} pontos
                    </p>
                  </div>
                  <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${pillar.percentageScore}%` }}
                    />
                  </div>
                  <p className="text-right text-sm text-gray-400 mt-1">
                    {Math.round(pillar.score)} pontos
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="bg-zinc-800 rounded-lg p-6 text-center">
                <TrendingUp size={32} className="text-green-500 mx-auto mb-3" />
                <p className="text-lg font-medium text-white mb-1">
                  {Math.round(latestResult.maxPossibleScore)} pontos
                </p>
                <p className="text-sm text-gray-400">Pontuação Máxima</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-6 text-center">
                <BarChart3 size={32} className="text-blue-500 mx-auto mb-3" />
                <p className="text-lg font-medium text-white mb-1">
                  75 pontos
                </p>
                <p className="text-sm text-gray-400">Pontuação Recomendada</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-6 text-center">
                <Award size={32} className="text-yellow-500 mx-auto mb-3" />
                <p className="text-lg font-medium text-white mb-1">
                  {Math.round(latestResult.totalScore)} pontos
                </p>
                <p className="text-sm text-gray-400">Pontuação Final</p>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6 mt-6">
              <h3 className="text-xl font-semibold text-white mb-6">Maturidade do Negócio</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className={`p-6 rounded-lg border-2 ${
                  maturityLevel.level === 'Inicial' 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-zinc-700 bg-zinc-700/50'
                }`}>
                  <h4 className="text-lg font-medium text-white mb-2">Inicial</h4>
                  <p className="text-gray-400 text-sm">
                    O negócio está começando ou ainda não possui processos bem definidos. Planejamento e estruturação são prioridades.
                  </p>
                </div>
                <div className={`p-6 rounded-lg border-2 ${
                  maturityLevel.level === 'Em Desenvolvimento'
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-zinc-700 bg-zinc-700/50'
                }`}>
                  <h4 className="text-lg font-medium text-white mb-2">Em Desenvolvimento</h4>
                  <p className="text-gray-400 text-sm">
                    O negócio já possui alguns processos organizados, mas ainda enfrenta desafios para alcançar estabilidade e crescimento consistente.
                  </p>
                </div>
                <div className={`p-6 rounded-lg border-2 ${
                  maturityLevel.level === 'Consolidado'
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-zinc-700 bg-zinc-700/50'
                }`}>
                  <h4 className="text-lg font-medium text-white mb-2">Consolidado</h4>
                  <p className="text-gray-400 text-sm">
                    O negócio tem processos bem estabelecidos, boa gestão e está em um estágio de expansão ou consolidação no mercado.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb size={24} className="text-yellow-500" />
                <h3 className="text-xl font-semibold text-white">Recomendações</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {recommendation}
              </p>
            </div>
          </div>
        </div>

        {results.length > 1 && (
          <div className="bg-zinc-900 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Histórico de Diagnósticos</h2>
            <div className="space-y-4">
              {results.slice(1).map((result) => (
                <DiagnosticCard key={result.id} result={result} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Resultados;