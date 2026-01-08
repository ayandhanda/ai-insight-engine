import { DollarSign, TrendingUp, Zap, Crown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CostBreakdownProps {
  tier1Count: number;
  tier2Count: number;
  totalAccounts: number;
  showDetails?: boolean;
}

const CostBreakdown = ({
  tier1Count,
  tier2Count,
  totalAccounts,
  showDetails = true
}: CostBreakdownProps) => {
  const tier1Cost = tier1Count * 1;
  const tier2Cost = tier2Count * 6;
  const totalCost = tier1Cost + tier2Cost;
  const averageCost = totalAccounts > 0 ? totalCost / totalAccounts : 0;

  const tier1Percentage = totalAccounts > 0 ? (tier1Count / totalAccounts) * 100 : 0;
  const tier2Percentage = totalAccounts > 0 ? (tier2Count / totalAccounts) * 100 : 0;

  // Calculate potential savings
  const maxCost = totalAccounts * 6; // If all were Deep Search
  const savings = maxCost - totalCost;
  const savingsPercentage = maxCost > 0 ? (savings / maxCost) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Total Cost Card */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Total Cost Estimate
          </h3>
        </div>

        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-primary">
            {totalCost.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            credits
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-muted-foreground">Accounts</div>
            <div className="font-semibold text-foreground">
              {totalAccounts.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Per Account</div>
            <div className="font-semibold text-foreground">
              {averageCost.toFixed(1)} credits
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Savings</div>
            <div className="font-semibold text-emerald-600 dark:text-emerald-400">
              {savingsPercentage.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Tier Distribution */}
      {showDetails && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">
              Search Tier Distribution
            </h4>
          </div>

          {/* Fast Search */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-foreground">Fast Search</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">
                  {tier1Count.toLocaleString()} accounts
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {tier1Percentage.toFixed(0)}%
                </span>
              </div>
            </div>
            <Progress
              value={tier1Percentage}
              className="h-2 bg-secondary"
              indicatorClassName="bg-emerald-600 dark:bg-emerald-400"
            />
            <div className="text-xs text-muted-foreground text-right">
              Cost: {tier1Cost.toLocaleString()} credits (@ 1 credit each)
            </div>
          </div>

          {/* Deep Search */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-foreground">Deep Search</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">
                  {tier2Count.toLocaleString()} accounts
                </span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {tier2Percentage.toFixed(0)}%
                </span>
              </div>
            </div>
            <Progress
              value={tier2Percentage}
              className="h-2 bg-secondary"
              indicatorClassName="bg-purple-600 dark:bg-purple-400"
            />
            <div className="text-xs text-muted-foreground text-right">
              Cost: {tier2Cost.toLocaleString()} credits (@ 6 credits each)
            </div>
          </div>
        </div>
      )}

      {/* Cost Range Information */}
      {showDetails && (
        <div className="p-4 rounded-lg bg-secondary/30 border border-border">
          <h4 className="text-sm font-semibold text-foreground mb-2">
            Cost Range
          </h4>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Minimum (all Fast Search):</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {(totalAccounts * 1).toLocaleString()} credits
              </span>
            </div>
            <div className="flex justify-between">
              <span>Current estimate (mixed):</span>
              <span className="font-medium text-primary">
                {totalCost.toLocaleString()} credits
              </span>
            </div>
            <div className="flex justify-between">
              <span>Maximum (all Deep Search):</span>
              <span className="font-medium text-purple-600 dark:text-purple-400">
                {(totalAccounts * 6).toLocaleString()} credits
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Savings Highlight */}
      {savings > 0 && (
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-2xl">💰</span>
            <div className="flex-1">
              <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                Estimated savings: {savings.toLocaleString()} credits
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                vs. using Deep Search for all accounts
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostBreakdown;
