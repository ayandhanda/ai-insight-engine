import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Info, Zap, Crown, Sparkles } from "lucide-react";
import { BudgetMode } from "@/services/smart-search/enrichment-orchestrator";

interface BudgetControlProps {
  value: BudgetMode;
  onChange: (value: BudgetMode) => void;
  queryComplexity?: 'simple' | 'medium' | 'complex';
}

const BudgetControl = ({ value, onChange, queryComplexity }: BudgetControlProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-foreground">
          Budget Control
        </Label>
        <button className="text-xs text-primary hover:underline flex items-center gap-1">
          <Info className="w-3 h-3" />
          How does this work?
        </button>
      </div>

      <RadioGroup value={value} onValueChange={(v) => onChange(v as BudgetMode)}>
        {/* Auto Mode - Recommended */}
        <div className={`relative flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
          value === 'auto'
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-border hover:border-primary/50 bg-card'
        }`}>
          <RadioGroupItem value="auto" id="auto" className="mt-1" />
          <Label htmlFor="auto" className="flex-1 cursor-pointer space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground">
                Auto (Recommended)
              </span>
              {value === 'auto' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                  Selected
                </span>
              )}
            </div>

            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p className="text-foreground font-medium">
                Smart cost optimization
              </p>
              <ul className="space-y-1 text-xs">
                <li className="flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Start with Fast Search (1 credit)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Upgrade to Deep Search if needed (+5 credits)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Maximize quality while minimizing cost</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <div className="px-2.5 py-1 rounded-md bg-background border border-border">
                <span className="text-xs font-medium">Cost: 1-6 credits</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Average: ~3 credits
              </div>
            </div>
          </Label>
        </div>

        {/* Fast Only Mode */}
        <div className={`relative flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
          value === 'fast_only'
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm'
            : 'border-border hover:border-emerald-500/50 bg-card'
        }`}>
          <RadioGroupItem value="fast_only" id="fast_only" className="mt-1" />
          <Label htmlFor="fast_only" className="flex-1 cursor-pointer space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-foreground">
                Fast Only
              </span>
              {value === 'fast_only' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  Selected
                </span>
              )}
            </div>

            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p className="text-foreground font-medium">
                Budget-conscious mode
              </p>
              <ul className="space-y-1 text-xs">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">✓</span>
                  <span>Always use Fast Search only</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">✓</span>
                  <span>Maximum 1 credit per account</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 dark:text-amber-400 mt-0.5">⚠</span>
                  <span>Some complex queries may get limited results</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <div className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  Cost: 1 credit
                </span>
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Lowest cost
              </div>
            </div>
          </Label>
        </div>

        {/* Deep Search Mode */}
        <div className={`relative flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
          value === 'deep_only'
            ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 shadow-sm'
            : 'border-border hover:border-purple-500/50 bg-card'
        }`}>
          <RadioGroupItem value="deep_only" id="deep_only" className="mt-1" />
          <Label htmlFor="deep_only" className="flex-1 cursor-pointer space-y-2">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-foreground">
                Deep Search
              </span>
              {value === 'deep_only' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-600 text-white">
                  Selected
                </span>
              )}
            </div>

            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p className="text-foreground font-medium">
                Maximum quality mode
              </p>
              <ul className="space-y-1 text-xs">
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-600 dark:text-purple-400 mt-0.5">✓</span>
                  <span>Always use Deep Search with AI reasoning</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-600 dark:text-purple-400 mt-0.5">✓</span>
                  <span>Comprehensive analysis for all queries</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-600 dark:text-purple-400 mt-0.5">✓</span>
                  <span>Best for complex questions and analysis</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <div className="px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  Cost: 6 credits
                </span>
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Highest quality
              </div>
            </div>
          </Label>
        </div>
      </RadioGroup>

      {/* Smart Recommendation Based on Query Complexity */}
      {queryComplexity && (
        <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-700 dark:text-blue-300">
              {queryComplexity === 'simple' && (
                <p>
                  <span className="font-semibold">Query Analysis:</span> Simple query detected.
                  <span className="font-medium"> Auto mode</span> will likely use Fast Search for all accounts (save up to 83%).
                </p>
              )}
              {queryComplexity === 'medium' && (
                <p>
                  <span className="font-semibold">Query Analysis:</span> Medium complexity query.
                  <span className="font-medium"> Auto mode</span> recommended - will try Fast Search first and upgrade selectively.
                </p>
              )}
              {queryComplexity === 'complex' && (
                <p>
                  <span className="font-semibold">Query Analysis:</span> Complex query detected.
                  <span className="font-medium"> Auto mode</span> will use Deep Search more often for better quality.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetControl;
