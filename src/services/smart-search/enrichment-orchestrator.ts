// Enrichment Orchestrator
// Main controller that manages the two-tier intelligent search system
// Decides which tier to use and handles automatic upgrades

import { analyzeQueryComplexity, QueryComplexity } from './query-complexity-analyzer';
import { evaluateTier1Quality, EnrichmentResult, getUpgradeReason } from './quality-evaluator';
import { runTier1AISignals, AISignalsConfig } from './tier1-ai-signals';
import { runTier2LLMWeb, LLMWebConfig } from './tier2-llm-web';

export type BudgetMode = 'auto' | 'fast_only' | 'deep_only';

export interface EnrichmentConfig {
  budgetMode: BudgetMode;
  model: string;
  format?: 'paragraph' | 'yes_no' | 'number' | 'bullets';
  dateRange?: '1m' | '3m' | '6m' | '12m' | 'anytime';
  location?: string;
}

export interface EnrichmentContext {
  query: string;
  accountData: Record<string, any>;
  config: EnrichmentConfig;
}

export interface EnrichmentResponse extends EnrichmentResult {
  complexity: QueryComplexity;
  evaluationScore?: number;
  evaluationReasons?: string[];
}

/**
 * Main orchestration function - enriches a single account
 *
 * Logic:
 * 1. Analyze query complexity
 * 2. Check user budget mode preference
 * 3. If auto mode:
 *    a. Try Tier 1 (Fast Search) if complexity is simple/medium
 *    b. Evaluate Tier 1 result quality
 *    c. Upgrade to Tier 2 (Deep Search) if quality insufficient
 * 4. If fast_only: Always use Tier 1
 * 5. If deep_only: Always use Tier 2
 *
 * @param context - Enrichment context with query, account data, and config
 * @returns EnrichmentResponse with result and metadata
 */
export async function enrichAccount(
  context: EnrichmentContext
): Promise<EnrichmentResponse> {
  const { query, accountData, config } = context;

  // Step 1: Analyze query complexity
  const complexity = analyzeQueryComplexity(query);

  // Step 2: Check budget mode
  const { budgetMode } = config;

  // Fast Only Mode - always use Tier 1
  if (budgetMode === 'fast_only') {
    const result = await executeTier1(query, accountData, config);
    return {
      ...result,
      complexity
    };
  }

  // Deep Search Mode - always use Tier 2
  if (budgetMode === 'deep_only') {
    const result = await executeTier2(query, accountData, config);
    return {
      ...result,
      complexity
    };
  }

  // Auto Mode - intelligent tier selection
  return await executeAutoMode(query, accountData, config, complexity);
}

/**
 * Execute Auto Mode - Try Tier 1 first, upgrade if needed
 */
async function executeAutoMode(
  query: string,
  accountData: Record<string, any>,
  config: EnrichmentConfig,
  complexity: QueryComplexity
): Promise<EnrichmentResponse> {
  // If query is complex, skip directly to Tier 2
  if (complexity.level === 'complex' && complexity.recommendation === 'deep_search') {
    const result = await executeTier2(query, accountData, config);
    return {
      ...result,
      complexity,
      upgradeReason: 'Complex query detected - used Deep Search directly'
    };
  }

  // Try Tier 1 first
  const tier1Result = await executeTier1(query, accountData, config);

  // Evaluate Tier 1 quality
  const evaluation = await evaluateTier1Quality(query, tier1Result, complexity);

  // If Tier 1 is sufficient, return it
  if (evaluation.isSufficient) {
    return {
      ...tier1Result,
      complexity,
      evaluationScore: evaluation.score,
      evaluationReasons: evaluation.reasons
    };
  }

  // Tier 1 insufficient - upgrade to Tier 2
  const tier2Result = await executeTier2(query, accountData, config);

  return {
    ...tier2Result,
    complexity,
    evaluationScore: evaluation.score,
    evaluationReasons: evaluation.reasons,
    upgradeReason: getUpgradeReason(evaluation)
  };
}

/**
 * Execute Tier 1 (Fast Search) with AI Signals
 */
async function executeTier1(
  query: string,
  accountData: Record<string, any>,
  config: EnrichmentConfig
): Promise<EnrichmentResult> {
  const aiSignalsConfig: AISignalsConfig = {
    dateRange: config.dateRange,
    location: config.location,
    format: config.format,
    model: config.model
  };

  return await runTier1AISignals(query, accountData, aiSignalsConfig);
}

/**
 * Execute Tier 2 (Deep Search) with LLM + Web Tool
 */
async function executeTier2(
  query: string,
  accountData: Record<string, any>,
  config: EnrichmentConfig
): Promise<EnrichmentResult> {
  const llmWebConfig: LLMWebConfig = {
    model: config.model,
    format: config.format,
    temperature: 0
  };

  return await runTier2LLMWeb(query, accountData, llmWebConfig);
}

/**
 * Batch enrichment for multiple accounts
 * Processes accounts in parallel with concurrency limit
 *
 * @param contexts - Array of enrichment contexts
 * @param concurrency - Max parallel requests (default: 5)
 * @returns Array of enrichment responses
 */
export async function enrichAccountsBatch(
  contexts: EnrichmentContext[],
  concurrency: number = 5
): Promise<EnrichmentResponse[]> {
  const results: EnrichmentResponse[] = [];

  // Process in batches for concurrency control
  for (let i = 0; i < contexts.length; i += concurrency) {
    const batch = contexts.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(context => enrichAccount(context))
    );
    results.push(...batchResults);
  }

  return results;
}

/**
 * Calculate cost statistics for a batch of results
 */
export function calculateCostStats(results: EnrichmentResponse[]): {
  totalCost: number;
  averageCost: number;
  tier1Count: number;
  tier2Count: number;
  tier1Percentage: number;
  tier2Percentage: number;
} {
  const totalCost = results.reduce((sum, r) => sum + r.cost, 0);
  const tier1Count = results.filter(r => r.tierUsed === 'tier1_fast').length;
  const tier2Count = results.filter(r => r.tierUsed === 'tier2_deep').length;

  return {
    totalCost,
    averageCost: totalCost / results.length,
    tier1Count,
    tier2Count,
    tier1Percentage: (tier1Count / results.length) * 100,
    tier2Percentage: (tier2Count / results.length) * 100
  };
}

/**
 * Preview enrichment on sample accounts
 * Used to estimate costs before running on full dataset
 *
 * @param contexts - Sample contexts (typically 5)
 * @returns Preview results with cost estimates
 */
export async function previewEnrichment(
  contexts: EnrichmentContext[]
): Promise<{
  results: EnrichmentResponse[];
  costStats: ReturnType<typeof calculateCostStats>;
  estimatedFullCost: (accountCount: number) => {
    min: number;
    expected: number;
    max: number;
  };
}> {
  const results = await enrichAccountsBatch(contexts);
  const costStats = calculateCostStats(results);

  return {
    results,
    costStats,
    estimatedFullCost: (accountCount: number) => {
      const avgCost = costStats.averageCost;
      return {
        min: accountCount * 1, // All Fast Search
        expected: Math.round(accountCount * avgCost),
        max: accountCount * 6 // All Deep Search
      };
    }
  };
}

/**
 * Get human-readable tier name
 */
export function getTierDisplayName(tierUsed: 'tier1_fast' | 'tier2_deep'): string {
  return tierUsed === 'tier1_fast' ? 'Fast Search' : 'Deep Search';
}

/**
 * Get tier badge emoji
 */
export function getTierEmoji(tierUsed: 'tier1_fast' | 'tier2_deep'): string {
  return tierUsed === 'tier1_fast' ? '⚡' : '🔍';
}
