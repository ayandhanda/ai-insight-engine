import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, PlayCircle, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TierIndicator from "../smart-search/TierIndicator";

interface PreviewSystemProps {
  prompt: string;
  selectedColumns: string[];
  onPreviewComplete?: (fields: Array<{ name: string; type: string; sample: string }>) => void;
  previewResults?: Array<{
    accountName: string;
    tierUsed: 'tier1_fast' | 'tier2_deep';
    cost: number;
    answer: string;
    upgradeReason?: string;
  }>;
}

const MOCK_PREVIEW_DATA = [
  {
    id: 1,
    accountName: "Rajesh Kumar",
    status: "success" as const,
    input: {
      contact_name: "Rajesh Kumar",
    },
    output: {
      indian_origin: "Yes",
      confidence: "High",
    },
  },
  {
    id: 2,
    accountName: "Priya Sharma",
    status: "success" as const,
    input: {
      contact_name: "Priya Sharma",
    },
    output: {
      indian_origin: "Yes",
      confidence: "High",
    },
  },
  {
    id: 3,
    accountName: "John Smith",
    status: "success" as const,
    input: {
      contact_name: "John Smith",
    },
    output: {
      indian_origin: "No",
      confidence: "High",
    },
  },
  {
    id: 4,
    accountName: "Aisha Patel",
    status: "success" as const,
    input: {
      contact_name: "Aisha Patel",
    },
    output: {
      indian_origin: "Yes",
      confidence: "High",
    },
  },
];

const DETECTED_OUTPUT_FIELDS = [
  { name: "indian_origin", type: "text", sample: "Yes" },
  { name: "confidence", type: "text", sample: "High" },
];

const PreviewSystem = ({ prompt, selectedColumns, onPreviewComplete, previewResults }: PreviewSystemProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Auto-load preview on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Auto-detect fields and notify parent
      if (onPreviewComplete) {
        onPreviewComplete(DETECTED_OUTPUT_FIELDS);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onPreviewComplete]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onPreviewComplete) {
        onPreviewComplete(DETECTED_OUTPUT_FIELDS);
      }
    }, 2000);
  };

  const successCount = MOCK_PREVIEW_DATA.filter(d => d.status === "success").length;
  const totalCount = MOCK_PREVIEW_DATA.length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">Generating preview with 3 sample accounts...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between flex-shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Preview Results</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-2 border-border hover:bg-secondary"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Preview Results - Scrollable area */}
      <div className="space-y-3">
        {(previewResults && previewResults.length > 0 ? previewResults : MOCK_PREVIEW_DATA).map((preview, index) => {
          // Check if this is a tier-enabled preview result
          const hasTierInfo = 'tierUsed' in preview;
          const mockData = !hasTierInfo ? preview : null;

          return (
            <div
              key={hasTierInfo ? preview.accountName : (mockData as any).id}
              className="p-4 rounded-xl border-2 border-border bg-card hover:border-primary/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {hasTierInfo ? preview.accountName : (mockData as any).accountName}
                  </span>
                  {!hasTierInfo && (mockData as any).status === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-ai-success" />
                  ) : !hasTierInfo && (mockData as any).status === "partial" ? (
                    <AlertCircle className="w-4 h-4 text-ai-warning" />
                  ) : !hasTierInfo && (mockData as any).status === "error" ? (
                    <XCircle className="w-4 h-4 text-ai-error" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-ai-success" />
                  )}
                </div>
                {hasTierInfo && (
                  <TierIndicator
                    tierUsed={preview.tierUsed}
                    cost={preview.cost}
                    showCost={true}
                    size="sm"
                    upgradeReason={preview.upgradeReason}
                  />
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  OUTPUT
                </p>
                <div className="space-y-1">
                  {hasTierInfo ? (
                    <div>
                      <span className="text-xs text-muted-foreground">result: </span>
                      <span className="text-xs text-foreground font-medium">
                        {preview.answer || "N/A"}
                      </span>
                    </div>
                  ) : (
                    Object.entries((mockData as any).output).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-xs text-muted-foreground">{key}: </span>
                        <span className="text-xs text-foreground font-medium">
                          {value || "N/A"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreviewSystem;
