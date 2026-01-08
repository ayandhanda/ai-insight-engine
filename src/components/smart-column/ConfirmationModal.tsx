import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const ConfirmationModal = ({ open, onOpenChange, onConfirm }: ConfirmationModalProps) => {
  const [scope, setScope] = useState("all");
  const [customCount, setCustomCount] = useState("100");

  const totalAccounts = 1250;
  const selectedAccounts = 45;
  const costPerAccount = 12.5;

  const getAccountCount = () => {
    if (scope === "all") return totalAccounts;
    if (scope === "first") return parseInt(customCount) || 100;
    return selectedAccounts;
  };

  const totalCost = getAccountCount() * costPerAccount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] bg-card border-2 border-border">
        <DialogHeader>
          <DialogTitle className="text-xl">Confirm Enrichment Run</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Configuration Summary</h3>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-2 text-sm">
              <p><span className="text-muted-foreground">Model:</span> <span className="font-medium">GPT-4o</span></p>
              <p><span className="text-muted-foreground">Web Search:</span> <span className="font-medium">Enabled</span></p>
              <p><span className="text-muted-foreground">Primary Output:</span> <span className="font-medium">expansion_signal</span></p>
              <p><span className="text-muted-foreground">Output Fields:</span> <span className="font-medium">4 detected</span></p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Select Enrichment Scope</h3>
            <RadioGroup value={scope} onValueChange={setScope} className="space-y-3">
              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors cursor-pointer">
                <RadioGroupItem value="all" id="all" className="mt-1" />
                <Label htmlFor="all" className="flex-1 cursor-pointer">
                  <div className="font-medium text-foreground">Enrich all {totalAccounts.toLocaleString()} accounts in this table</div>
                  <div className="text-sm text-muted-foreground mt-1">Total cost: {(totalAccounts * costPerAccount).toLocaleString()} credits</div>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors cursor-pointer">
                <RadioGroupItem value="first" id="first" className="mt-1" />
                <Label htmlFor="first" className="flex-1 cursor-pointer">
                  <div className="font-medium text-foreground flex items-center gap-2">
                    Enrich first 
                    <Input
                      type="number"
                      value={customCount}
                      onChange={(e) => setCustomCount(e.target.value)}
                      className="w-24 h-8"
                      min="1"
                      max={totalAccounts}
                      onClick={(e) => e.stopPropagation()}
                    />
                    accounts
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Total cost: {((parseInt(customCount) || 100) * costPerAccount).toLocaleString()} credits
                  </div>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors cursor-pointer">
                <RadioGroupItem value="selected" id="selected" className="mt-1" />
                <Label htmlFor="selected" className="flex-1 cursor-pointer">
                  <div className="font-medium text-foreground">Enrich selected {selectedAccounts} accounts</div>
                  <div className="text-sm text-muted-foreground mt-1">Total cost: {(selectedAccounts * costPerAccount).toLocaleString()} credits</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="p-6 rounded-xl bg-gradient-primary/5 border-2 border-primary/20">
            <h3 className="text-sm font-semibold text-foreground mb-3">💳 Final Cost Estimate</h3>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-primary">{totalCost.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-1">credits</div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Model: {getAccountCount() * 10}</span>
              <span>Web Search: {getAccountCount() * 3}</span>
              <span>Tokens: ~{getAccountCount() * 0.1}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="gap-2">
            Confirm & Run →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
