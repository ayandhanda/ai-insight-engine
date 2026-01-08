// Quality Evaluator
// Decides if Tier 1 (Fast Search) result is sufficient or if we need to upgrade to Tier 2 (Deep Search)

import { QueryComplexity } from './query-complexity-analyzer';

export interface EnrichmentResult {
  answer: string;
  confidence?: number;
  sources?: string[];
  tierUsed: 'tier1_fast' | 'tier2_deep';
  cost: number;
  upgradeReason?: string;
}

export interface QualityEvaluationResult {
  isSufficient: boolean;
  score: number; // 0-1 quality score
  reasons: string[];
  recommendation: 'keep_tier1' | 'upgrade_to_tier2';
}

/**
 * Evaluates if Tier 1 (Fast Search) result is good enough
 * @param query - Original user query
 * @param tier1Result - Result from Tier 1 (AI Signals)
 * @param complexity - Query complexity analysis
 * @returns Quality evaluation with recommendation
 */
export async function evaluateTier1Quality(
  query: string,
  tier1Result: EnrichmentResult,
  complexity: QueryComplexity
): Promise<QualityEvaluationResult> {
  const reasons: string[] = [];
  let qualityScore = 1.0; // Start with perfect score

  // Check 1: Confidence score
  if (tier1Result.confidence !== undefined) {
    if (tier1Result.confidence < 0.5) {
      qualityScore -= 0.4;
      reasons.push('Low confidence score');
    } else if (tier1Result.confidence < 0.7) {
      qualityScore -= 0.2;
      reasons.push('Medium confidence');
    }
  }

  // Check 2: Answer completeness
  const answerLength = tier1Result.answer?.length || 0;
  if (answerLength < 10) {
    qualityScore -= 0.5;
    reasons.push('Answer too short');
  } else if (answerLength < 30) {
    qualityScore -= 0.2;
    reasons.push('Answer could be more detailed');
  }

  // Check 3: Generic or error responses
  const genericPhrases = [
    'not found',
    'no information available',
    'unable to determine',
    'data not available',
    'unclear',
    'no results',
    'cannot find',
    'insufficient data',
    'not enough information'
  ];

  const hasGenericResponse = genericPhrases.some(phrase =>
    tier1Result.answer?.toLowerCase().includes(phrase)
  );

  if (hasGenericResponse) {
    qualityScore -= 0.5;
    reasons.push('Generic or insufficient response');
  }

  // Check 4: Sources quality
  if (!tier1Result.sources || tier1Result.sources.length === 0) {
    qualityScore -= 0.1;
    reasons.push('No sources provided');
  }

  // Check 5: Query complexity vs result quality
  // For complex queries, be more stringent
  if (complexity.level === 'complex' && qualityScore < 0.8) {
    qualityScore -= 0.2;
    reasons.push('Complex query needs deeper analysis');
  }

  // Determine if sufficient
  const threshold = complexity.level === 'complex' ? 0.7 : 0.6;
  const isSufficient = qualityScore >= threshold;

  return {
    isSufficient,
    score: Math.max(0, Math.min(1, qualityScore)),
    reasons: reasons.length > 0 ? reasons : ['Good quality response'],
    recommendation: isSufficient ? 'keep_tier1' : 'upgrade_to_tier2'
  };
}

/**
 * Gets a human-readable explanation for why upgrade was needed
 */
export function getUpgradeReason(evaluation: QualityEvaluationResult): string {
  if (evaluation.isSufficient) {
    return '';
  }

  const primaryReason = evaluation.reasons[0] || 'Quality insufficient';

  const reasonMap: Record<string, string> = {
    'Low confidence score': 'Fast search found limited information',
    'Medium confidence': 'Fast search result needs verification',
    'Answer too short': 'Insufficient detail in initial results',
    'Answer could be more detailed': 'Query needs more comprehensive analysis',
    'Generic or insufficient response': 'Fast search couldn\'t find specific information',
    'No sources provided': 'No reliable sources found in fast search',
    'Complex query needs deeper analysis': 'Query requires AI-powered reasoning'
  };

  return reasonMap[primaryReason] || 'Upgrading for better quality results';
}

/**
 * Simulates quality check for preview (mock implementation)
 * In real implementation, this would call a lightweight LLM
 */
export async function quickQualityCheck(
  query: string,
  answer: string
): Promise<{ isSufficient: boolean; reason: string }> {
  // Mock implementation for prototype
  // In production, this would call GPT-4o-mini or similar for quick evaluation

  const lowerAnswer = answer.toLowerCase();

  // Quick heuristics
  if (answer.length < 20) {
    return {
      isSufficient: false,
      reason: 'Answer too brief'
    };
  }

  if (lowerAnswer.includes('not found') || lowerAnswer.includes('no information')) {
    return {
      isSufficient: false,
      reason: 'Insufficient information found'
    };
  }

  if (query.toLowerCase().includes('analyze') || query.toLowerCase().includes('compare')) {
    // Analytical queries likely need Deep Search
    if (answer.length < 100) {
      return {
        isSufficient: false,
        reason: 'Analysis needs more depth'
      };
    }
  }

  return {
    isSufficient: true,
    reason: 'Good quality'
  };
}

/**
 * Calculates a simple quality score based on heuristics
 */
export function calculateSimpleQualityScore(
  answer: string,
  confidence?: number
): number {
  let score = 0.5; // Base score

  // Length contribution (up to 0.3)
  const lengthScore = Math.min(answer.length / 200, 0.3);
  score += lengthScore;

  // Confidence contribution (up to 0.2)
  if (confidence !== undefined) {
    score += confidence * 0.2;
  }

  // Check for negative indicators
  const negativeIndicators = ['not found', 'unclear', 'no information', 'unable to'];
  const hasNegative = negativeIndicators.some(indicator =>
    answer.toLowerCase().includes(indicator)
  );

  if (hasNegative) {
    score -= 0.3;
  }

  return Math.max(0, Math.min(1, score));
}
