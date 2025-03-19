import { useState, useCallback, useEffect } from 'react';
import { DiagnosticResult, CompanyData, Pillar, PillarScore } from '../types/diagnostic';
import { supabase } from '../lib/supabase';

export function useDiagnosticCalculation() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from('diagnostic_results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedResults = data.map(result => ({
        id: result.id,
        date: result.created_at,
        companyData: result.company_data as CompanyData,
        answers: result.answers as Record<string, string>,
        pillarScores: result.pillar_scores as PillarScore[],
        totalScore: result.total_score,
        maxPossibleScore: result.max_possible_score,
        percentageScore: result.percentage_score
      }));

      setResults(formattedResults);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = useCallback((answers: Record<string, string>, pillars: Pillar[]): {
    pillarScores: PillarScore[];
    totalScore: number;
    maxPossibleScore: number;
    percentageScore: number;
  } => {
    let totalScore = 0;
    let maxPossibleScore = 0;

    const pillarScores = pillars.map(pillar => {
      let pillarScore = 0;
      let pillarMaxScore = 0;

      pillar.questions.forEach(question => {
        const answer = answers[question.id];
        pillarMaxScore += question.points;

        if (answer === question.positiveAnswer) {
          pillarScore += question.points;
        } else if (answer === 'PARCIALMENTE') {
          pillarScore += question.points / 2;
        }
      });

      totalScore += pillarScore;
      maxPossibleScore += pillarMaxScore;

      return {
        pillarId: pillar.id,
        pillarName: pillar.name,
        score: pillarScore,
        maxPossibleScore: pillarMaxScore,
        percentageScore: (pillarScore / pillarMaxScore) * 100
      };
    });

    return {
      pillarScores,
      totalScore,
      maxPossibleScore,
      percentageScore: (totalScore / maxPossibleScore) * 100
    };
  }, []);

  const saveDiagnosticResult = useCallback(async (
    companyData: CompanyData,
    answers: Record<string, string>,
    pillars: Pillar[]
  ) => {
    const { pillarScores, totalScore, maxPossibleScore, percentageScore } = calculateScore(answers, pillars);

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const result: DiagnosticResult = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        companyData,
        answers,
        pillarScores,
        totalScore,
        maxPossibleScore,
        percentageScore
      };

      const { error } = await supabase
        .from('diagnostic_results')
        .insert([{
          user_id: user.id, // Explicitly set the user_id
          company_data: companyData,
          answers,
          pillar_scores: pillarScores,
          total_score: totalScore,
          max_possible_score: maxPossibleScore,
          percentage_score: percentageScore
        }]);

      if (error) throw error;

      // Atualiza a lista de resultados após salvar
      await fetchResults();
      
      return result;
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
      throw error;
    }
  }, [calculateScore]);

  return {
    results,
    loading,
    calculateScore,
    saveDiagnosticResult
  };
}