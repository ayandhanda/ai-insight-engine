import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";

interface EnrichmentDetailSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: any;
}

const EnrichmentDetailSidebar = ({ open, onOpenChange, account }: EnrichmentDetailSidebarProps) => {
  if (!account?.enrichment) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${fieldName} to clipboard`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg">Enrichment Details - {account.name}</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="fields" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fields">All Fields</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value="fields" className="space-y-6 mt-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Output Fields</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">indian_origin</span>
                      <Badge variant="secondary" className="text-xs">PRIMARY</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(account.enrichment.indian_origin, "indian_origin")}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-base font-medium text-foreground">
                    {account.enrichment.indian_origin}
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">confidence</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(account.enrichment.confidence, "confidence")}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-base text-foreground">{account.enrichment.confidence}</p>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">reasoning</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(account.enrichment.reasoning, "reasoning")}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{account.enrichment.reasoning}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Input Data Used</h3>
              <div className="p-4 rounded-lg border border-border bg-secondary/30 space-y-2">
                <p className="text-sm"><span className="font-medium">CONTACT_NAME:</span> {account.name}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-6 mt-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Enrichment Information</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Prompt Used</span>
                    <Button variant="ghost" size="sm">View Full</Button>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Is {`{{CONTACT_NAME}}`} of Indian origin based on their name?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <span className="text-xs text-muted-foreground">Model Used</span>
                    <p className="text-sm font-medium text-foreground mt-1">GPT-4o</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <span className="text-xs text-muted-foreground">Web Search</span>
                    <p className="text-sm font-medium text-foreground mt-1">Enabled</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <span className="text-xs text-muted-foreground">Temperature</span>
                    <p className="text-sm font-medium text-foreground mt-1">0.3</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <span className="text-xs text-muted-foreground">Processing Time</span>
                    <p className="text-sm font-medium text-foreground mt-1">2.8 seconds</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card space-y-2">
                  <p className="text-sm"><span className="text-muted-foreground">Enriched On:</span> <span className="font-medium">Jan 25, 2025 at 3:15 PM</span></p>
                  <p className="text-sm"><span className="text-muted-foreground">Cost:</span> <span className="font-medium">12.5 credits</span></p>
                  <p className="text-sm"><span className="text-muted-foreground">Created By:</span> <span className="font-medium">john@company.com</span></p>
                  <p className="text-sm"><span className="text-muted-foreground">Enrichment ID:</span> <span className="font-mono text-xs">enr_abc123xyz</span></p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 pt-6 border-t border-border flex gap-3">
          <Button variant="outline" className="flex-1 gap-2">
            <RefreshCw className="w-4 h-4" />
            Re-run
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EnrichmentDetailSidebar;
