import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, CreditCard, ChevronDown, ChevronUp } from "lucide-react";

const ExecutionMonitor = () => {
  const [progress, setProgress] = useState(0);
  const [showFailed, setShowFailed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const totalAccounts = 1250;
  const processed = Math.floor((progress / 100) * totalAccounts);
  const successful = Math.floor(processed * 0.932);
  const failed = processed - successful;
  const isComplete = progress === 100;

  const mockFailedAccounts = [
    { id: 1, name: "Acme Corp", error: "API Timeout" },
    { id: 2, name: "TechStart Inc", error: "Parse Error" },
    { id: 3, name: "GlobalSoft LLC", error: "Missing Data" },
  ];

  return (
    <div className="space-y-6">
      {!isComplete ? (
        <>
          <div className="p-6 rounded-xl border-2 border-border bg-card">
            <Progress value={progress} className="h-3 mb-4" />
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold text-foreground">
                {processed} / {totalAccounts} accounts
              </p>
              <p className="text-sm text-muted-foreground">
                Processing: {progress}%
              </p>
              <div className="flex justify-between text-xs text-muted-foreground mt-4">
                <span>Started: 2:45 PM</span>
                <span>Estimated completion: ~{Math.ceil((100 - progress) / 5 * 0.5)} minutes remaining</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border-2 border-border bg-card text-center">
              <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-sm text-muted-foreground mb-1">Successfully Enriched</div>
              <div className="text-3xl font-bold text-foreground">{successful}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {processed > 0 ? ((successful / processed) * 100).toFixed(1) : 0}%
              </div>
            </div>

            <div className="p-4 rounded-xl border-2 border-border bg-card text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-sm text-muted-foreground mb-1">Failed</div>
              <div className="text-3xl font-bold text-foreground">{failed}</div>
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowFailed(!showFailed)}
                className="text-xs text-primary mt-1 p-0 h-auto"
              >
                View Failed →
              </Button>
            </div>

            <div className="p-4 rounded-xl border-2 border-border bg-card text-center">
              <CreditCard className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-sm text-muted-foreground mb-1">Actual Cost</div>
              <div className="text-3xl font-bold text-foreground">{(processed * 12.5).toFixed(0)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Est: {(totalAccounts * 12.5).toFixed(0)}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 rounded-xl border-2 border-green-500/20 bg-green-500/5 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">✓ Enrichment Complete!</h3>
          <p className="text-foreground mb-2">
            Successfully enriched {successful} out of {totalAccounts} accounts
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {failed} failed - Review failed accounts below
          </p>
          <div className="flex justify-center gap-8 text-sm mt-6">
            <div>
              <span className="text-muted-foreground">Total time:</span>
              <span className="font-medium ml-2">18 minutes 32 seconds</span>
            </div>
            <div>
              <span className="text-muted-foreground">Actual cost:</span>
              <span className="font-medium ml-2">{(successful * 12.5).toFixed(0)} credits</span>
            </div>
          </div>
        </div>
      )}

      {showFailed && failed > 0 && (
        <div className="rounded-xl border-2 border-border bg-card overflow-hidden">
          <div 
            className="p-4 bg-secondary/30 flex items-center justify-between cursor-pointer"
            onClick={() => setShowFailed(!showFailed)}
          >
            <h3 className="text-sm font-semibold text-foreground">Failed Accounts ({mockFailedAccounts.length})</h3>
            {showFailed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
          
          {showFailed && (
            <>
              <div className="max-h-[300px] overflow-y-auto">
                {mockFailedAccounts.map((account) => (
                  <div key={account.id} className="p-4 border-b border-border flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{account.name}</p>
                      <p className="text-xs text-muted-foreground">{account.error}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-secondary/20 flex gap-2">
                <Button variant="outline" size="sm">Select All</Button>
                <Button variant="outline" size="sm">Retry Selected</Button>
                <Button variant="outline" size="sm">Export Failed</Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ExecutionMonitor;
