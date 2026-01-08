// Query Complexity Analyzer
// Analyzes user queries to determine if they need Fast Search (Tier 1) or Deep Search (Tier 2)

export interface QueryComplexity {
  level: 'simple' | 'medium' | 'complex';
  shouldStartWithTier1: boolean;
  estimatedTier1Success: number; // 0-1 probability of Tier 1 being sufficient
  reasoning: string;
  recommendation: 'fast_only' | 'try_fast_first' | 'deep_search';
}

/**
 * Analyzes query complexity to determine the best search strategy
 * @param query - User's natural language query
 * @returns QueryComplexity with recommendations
 */
export function analyzeQueryComplexity(query: string): QueryComplexity {
  const lowerQuery = query.toLowerCase();

  // Simple queries - Tier 1 (Fast Search) likely sufficient
  const simplePatterns = [
    /^(did|does|is|was|has|have)\s+.*\?$/i,      // Yes/No questions
    /who\s+(is|are)\s+the\s+(ceo|founder|head)/i, // Basic "who is" questions
    /raise[d]?\s+(funding|money|capital)/i,        // Funding questions
    /recent\s+news\s+about/i,                      // News queries
    /contact\s+(email|phone|info)/i,               // Contact info
    /headquarter|location|office|address/i,        // Location queries
    /when\s+(did|was|were)/i,                      // Temporal "when" questions
    /how\s+much|how\s+many/i,                      // Quantitative questions
  ];

  // Complex queries - likely need Tier 2 (Deep Search) for reasoning
  const complexPatterns = [
    /(compare|analyze|evaluate|assess)/i,          // Analysis requests
    /(how\s+(does|do|did).*compare)/i,             // Comparisons
    /(what.*strategy|approach|plan|roadmap)/i,     // Strategic questions
    /(why|explain|describe\s+in\s+detail)/i,       // Explanatory questions
    /(likely|probability|predict|forecast)/i,      // Predictive questions
    /(multiple|several|various|all)\s+/i,          // Multi-part questions
    /\band\b.*\band\b/i,                           // Multiple conditions (X and Y)
    /(relationship|correlation|impact|effect)/i,   // Analytical relationships
    /(trend|pattern|insight)/i,                    // Pattern analysis
  ];

  // Check for simple patterns
  const isSimple = simplePatterns.some(pattern => pattern.test(query));

  // Check for complex patterns
  const isComplex = complexPatterns.some(pattern => pattern.test(query));

  // Complex query detected - recommend Deep Search
  if (isComplex) {
    return {
      level: 'complex',
      shouldStartWithTier1: false, // Skip directly to Tier 2
      estimatedTier1Success: 0.3,
      reasoning: 'Query requires analysis, reasoning, or comparison',
      recommendation: 'deep_search'
    };
  }

  // Simple query detected - Fast Search should work
  if (isSimple) {
    return {
      level: 'simple',
      shouldStartWithTier1: true, // Start with Tier 1
      estimatedTier1Success: 0.9,
      reasoning: 'Straightforward information retrieval',
      recommendation: 'try_fast_first'
    };
  }

  // Medium complexity - try Fast Search first, be ready to upgrade
  return {
    level: 'medium',
    shouldStartWithTier1: true, // Try Tier 1 first
    estimatedTier1Success: 0.6,
    reasoning: 'Moderate complexity, may need deeper analysis',
    recommendation: 'try_fast_first'
  };
}

/**
 * Gets a human-readable recommendation message based on complexity
 */
export function getComplexityMessage(complexity: QueryComplexity): string {
  switch (complexity.recommendation) {
    case 'fast_only':
      return 'This query is simple - Fast Search should provide good results.';
    case 'try_fast_first':
      return 'We\'ll try Fast Search first, and upgrade to Deep Search if needed for better quality.';
    case 'deep_search':
      return 'Complex query detected - Deep Search recommended for comprehensive analysis.';
    default:
      return 'We\'ll find the best approach for your query.';
  }
}

/**
 * Estimates cost range based on query complexity
 * @param complexity - Query complexity analysis
 * @param accountCount - Number of accounts to enrich
 * @returns Object with min, expected, and max cost estimates
 */
export function estimateCostRange(
  complexity: QueryComplexity,
  accountCount: number
): { min: number; expected: number; max: number; expectedMix: string } {
  const TIER1_COST = 1; // Fast Search cost
  const TIER2_COST = 6; // Deep Search cost

  let tier1Percentage = 1.0; // Default: all Tier 1

  // Adjust based on complexity
  if (complexity.level === 'complex') {
    tier1Percentage = 0.2; // 20% Tier 1, 80% Tier 2
  } else if (complexity.level === 'medium') {
    tier1Percentage = 0.6; // 60% Tier 1, 40% Tier 2
  } else {
    tier1Percentage = 0.9; // 90% Tier 1, 10% Tier 2
  }

  const tier1Count = Math.floor(accountCount * tier1Percentage);
  const tier2Count = accountCount - tier1Count;

  return {
    min: accountCount * TIER1_COST, // All Fast Search
    expected: tier1Count * TIER1_COST + tier2Count * TIER2_COST,
    max: accountCount * TIER2_COST, // All Deep Search
    expectedMix: `~${Math.round(tier1Percentage * 100)}% Fast, ~${Math.round((1 - tier1Percentage) * 100)}% Deep`
  };
}
