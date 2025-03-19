import React from 'react';
import { FileDown, TrendingUp, BarChart3, Award, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { DiagnosticResult, PillarScore } from '../types/diagnostic';

interface ExportPDFProps {
  result: DiagnosticResult;
}

function getBestAndWorstPillars(pillarScores: PillarScore[]): { best: PillarScore; worst: PillarScore } {
  const sortedPillars = [...pillarScores].sort((a, b) => b.percentageScore - a.percentageScore);
  return {
    best: sortedPillars[0],
    worst: sortedPillars[sortedPillars.length - 1]
  };
}

function ExportPDF({ result }: ExportPDFProps) {
  const handleExport = async () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [210, 470],
      compress: false,
      precision: 4
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const { best, worst } = getBestAndWorstPillars(result.pillarScores);

    const content = document.createElement('div');
    content.style.width = `${pageWidth * 3.779527559}px`;
    content.style.height = `${pageHeight * 3.779527559}px`;
    content.innerHTML = `
      <div style="background-color: #0030b9; padding: 0; font-family: Arial, sans-serif; height: 100%; position: relative; display: flex; flex-direction: column;">
        <div style="padding: 32px 40px; border-bottom: 2px solid rgba(255, 255, 255, 0.1);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="display: flex; align-items: flex-start; gap: 150px;">
              <div style="display: flex; flex-direction: column; justify-content: space-between; height: 80px;">
                <h1 style="color: white; font-size: 28px; font-weight: bold; margin: 0;">Diagnóstico Financeiro Empresarial</h1>
                <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 0;">
                  Emitido em ${new Date().toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <clipPath id="logo-clip">
                    <path d="M 1.207031 7.21875 L 58.957031 7.21875 L 58.957031 52.96875 L 1.207031 52.96875 Z M 1.207031 7.21875" clip-rule="nonzero"/>
                  </clipPath>
                </defs>
                <g clip-path="url(#logo-clip)">
                  <path fill="#ffffff" d="M 58.625 15.542969 C 57.542969 13.085938 55.605469 9.53125 54.019531 7.21875 C 52.308594 9.972656 49.816406 13.933594 48.246094 16.449219 C 44.011719 23.226562 39.804688 30.019531 35.550781 36.777344 C 33.320312 40.324219 30.179688 42.554688 25.960938 43.203125 C 19.546875 44.1875 13.242188 40.433594 11.1875 34.339844 C 9.050781 28.007812 11.71875 21.121094 17.507812 18.023438 C 23.902344 14.601562 31.660156 16.738281 35.539062 22.996094 C 35.96875 23.691406 36.390625 23.703125 36.808594 23.039062 C 38.042969 21.066406 39.277344 19.09375 40.519531 17.121094 C 41.394531 15.734375 41.417969 15.695312 40.222656 14.488281 C 34.941406 9.164062 28.554688 6.792969 21.101562 7.675781 C 8.878906 9.117188 0.0625 20.542969 1.683594 32.769531 C 3.238281 44.453125 13.320312 52.46875 23.871094 52.246094 C 31.03125 52.175781 36.945312 49.433594 41.453125 43.84375 C 43.527344 41.273438 45.066406 38.332031 46.820312 35.542969 C 50.667969 29.417969 54.488281 23.269531 58.335938 17.136719 C 58.652344 16.632812 58.898438 16.167969 58.625 15.546875 Z M 58.625 15.542969" fill-opacity="1" fill-rule="nonzero"/>
                </g>
                <path fill="#f47400" d="M 23.9375 21.996094 C 19.980469 21.707031 15.953125 25.128906 15.894531 29.914062 C 15.84375 34.269531 19.585938 37.960938 23.925781 37.960938 C 28.273438 37.960938 32.035156 34.273438 31.96875 29.921875 C 31.898438 25.113281 27.917969 21.722656 23.9375 21.996094 Z M 23.9375 21.996094" fill-opacity="1" fill-rule="nonzero"/>
              </svg>
            </div>
          </div>
        </div>

        <div style="flex: 1; padding: 40px; display: flex; flex-direction: column;">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;">
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; display: flex; flex-direction: column; justify-content: center;">
              <h3 style="font-size: 20px; font-weight: bold; color: white; margin: 0 0 12px 0; transform: translateY(-8px);">Informações da Empresa</h3>
              <div style="display: grid; gap: 12px; font-size: 15px; transform: translateY(-8px);">
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Empresa:</strong> ${result.companyData.empresa}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">CNPJ:</strong> ${result.companyData.cnpj}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Responsável:</strong> ${result.companyData.nome}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Funcionários:</strong> ${result.companyData.numeroFuncionarios}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Faturamento:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.companyData.faturamento)}</p>
              </div>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; display: flex; flex-direction: column; justify-content: center;">
              <h3 style="font-size: 20px; font-weight: bold; color: white; margin: 0 0 12px 0; transform: translateY(-8px);">Dados do Negócio</h3>
              <div style="display: grid; gap: 12px; font-size: 15px; transform: translateY(-8px);">
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Segmento:</strong> ${result.companyData.segmento}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Localização:</strong> ${result.companyData.localizacao}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Tempo de Atividade:</strong> ${result.companyData.tempoAtividade}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Forma Jurídica:</strong> ${result.companyData.formaJuridica}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Tem Sócios:</strong> ${result.companyData.temSocios === 'sim' ? 'Sim' : 'Não'}</p>
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
              <path d="M3 3v18h18"/>
              <path d="m19 9-5 5-4-4-3 3"/>
            </svg>
            <h3 style="font-size: 22px; font-weight: bold; color: white; margin: 0; transform: translateY(-10px);">Pontuação Geral</h3>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center; margin-bottom: 24px;">
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
              <p style="font-size: 22px; font-weight: bold; color: white; margin: 0 0 4px 0; transform: translateY(-6px);">${Math.round(result.totalScore)}</p>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 15px; margin: 0; transform: translateY(-6px);">Pontuação Total</p>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
              <p style="font-size: 22px; font-weight: bold; color: white; margin: 0 0 4px 0; transform: translateY(-6px);">${Math.round(result.maxPossibleScore)}</p>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 15px; margin: 0; transform: translateY(-6px);">Pontuação Máxima</p>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
              <p style="font-size: 22px; font-weight: bold; color: white; margin: 0 0 4px 0; transform: translateY(-6px);">${Math.round(result.percentageScore)}%</p>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 15px; margin: 0; transform: translateY(-6px);">Percentual Atingido</p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px;">
              <div style="display: flex; items-center; gap: 8px; margin-bottom: 12px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                  <path d="M7 10l5 5 5-5"/>
                  <path d="M2 20h20"/>
                </svg>
                <h4 style="font-size: 18px; font-weight: bold; color: white; margin: 0; transform: translateY(-8px);">Melhor Desempenho</h4>
              </div>
              <p style="font-size: 22px; font-weight: bold; color: white; margin: 0 0 8px 0; transform: translateY(-8px);">${best.pillarName}</p>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 15px; margin: 0; transform: translateY(-8px);">${Math.round(best.score)} pontos</p>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px;">
              <div style="display: flex; items-center; gap: 8px; margin-bottom: 12px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                  <path d="M7 14l5-5 5 5"/>
                  <path d="M2 20h20"/>
                </svg>
                <h4 style="font-size: 18px; font-weight: bold; color: white; margin: 0; transform: translateY(-8px);">Precisa de Atenção</h4>
              </div>
              <p style="font-size: 22px; font-weight: bold; color: white; margin: 0 0 8px 0; transform: translateY(-8px);">${worst.pillarName}</p>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 15px; margin: 0; transform: translateY(-8px);">${Math.round(worst.score)} pontos</p>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <h3 style="font-size: 22px; font-weight: bold; color: white; margin: 0; transform: translateY(-12px);">Pontuação por Pilar</h3>
          </div>

          <div style="display: grid; gap: 12px; margin-bottom: 24px;">
            ${result.pillarScores.map(pillar => `
              <div style="background-color: rgba(255, 255, 255, 0.1); padding: 16px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <h4 style="font-size: 15px; font-weight: bold; color: white; margin: 0; transform: translateY(-8px);">${pillar.pillarName}</h4>
                  <p style="color: rgba(255, 255, 255, 0.8); font-size: 15px; margin: 0; transform: translateY(-8px);">${Math.round(pillar.score)} / ${pillar.maxPossibleScore} pontos</p>
                </div>
                <div style="width: 100%; height: 8px; background-color: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden;">
                  <div style="width: ${pillar.percentageScore}%; height: 100%; background-color: #F47400;"></div>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
              <path d="M8.21 13.89 7 23l9-9-8.48-2.58"/>
              <path d="m14.92 14.92 2.14 6.99 4.04-4.04"/>
              <path d="m14.92 14.92-8.48-2.58"/>
              <path d="M7 23v-3"/>
              <path d="M3.59 12.51h4.83"/>
              <path d="M17.06 21.92v-3"/>
              <path d="M20.41 18.99h-3.35"/>
            </svg>
            <h3 style="font-size: 22px; font-weight: bold; color: white; margin: 0; transform: translateY(-6px);">Maturidade do Negócio</h3>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; ${result.totalScore <= 40 ? 'border: 2px solid #F47400;' : ''}">
              <h4 style="font-size: 15px; font-weight: bold; color: white; margin: 0 0 8px 0; transform: translateY(-8px);">Inicial</h4>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 0; transform: translateY(-8px);">O negócio está começando ou ainda não possui processos bem definidos.</p>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; ${result.totalScore > 40 && result.totalScore <= 70 ? 'border: 2px solid #F47400;' : ''}">
              <h4 style="font-size: 15px; font-weight: bold; color: white; margin: 0 0 8px 0; transform: translateY(-8px);">Em Desenvolvimento</h4>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 0; transform: translateY(-8px);">O negócio já possui alguns processos organizados, mas ainda enfrenta desafios.</p>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; ${result.totalScore > 70 ? 'border: 2px solid #F47400;' : ''}">
              <h4 style="font-size: 15px; font-weight: bold; color: white; margin: 0 0 8px 0; transform: translateY(-8px);">Consolidado</h4>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 0; transform: translateY(-8px);">O negócio tem processos bem estabelecidos e está em fase de expansão.</p>
            </div>
          </div>

          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                <line x1="9" y1="18" x2="15" y2="18"/>
                <line x1="10" y1="22" x2="14" y2="22"/>
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
              </svg>
              <h3 style="font-size: 22px; font-weight: bold; color: white; margin: 0; transform: translateY(-10px);">Recomendações</h3>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px;">
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 15px; line-height: 1.6; margin: 0; transform: translateY(-8px);">
                ${result.totalScore <= 40
                  ? "Priorize a criação de um planejamento estratégico básico, organize as finanças e defina processos essenciais para o funcionamento do negócio. Considere buscar orientação de um consultor para acelerar essa estruturação."
                  : result.totalScore <= 70
                    ? "Foco em otimizar os processos existentes, investir em capacitação da equipe e melhorar a gestão financeira. Avalie ferramentas que possam automatizar operações e aumentar a eficiência."
                    : "Concentre-se na inovação, expansão de mercado e diversificação de produtos/serviços. Invista em estratégias de marketing e mantenha um controle financeiro rigoroso para sustentar o crescimento."
                }
              </p>
            </div>
          </div>
        </div>

        <div style="padding: 16px 40px 32px; border-top: 2px solid rgba(255, 255, 255, 0.1); margin-top: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 0;">© ${new Date().getFullYear()} DC ADVISORS. Todos os direitos reservados.</p>
            <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 0;">Relatório gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(content);

    try {
      const canvas = await html2canvas(content, {
        scale: 4,
        useCORS: true,
        logging: false,
        windowWidth: content.scrollWidth,
        windowHeight: content.scrollHeight,
        allowTaint: true,
        backgroundColor: null,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          const element = clonedDoc.querySelector('div');
          if (element) {
            element.style.transform = 'scale(1)';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, '', 'FAST');
      pdf.save(`diagnostico-${result.companyData.empresa.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      document.body.removeChild(content);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
    >
      <FileDown size={20} />
      Exportar PDF
    </button>
  );
}

export default ExportPDF;