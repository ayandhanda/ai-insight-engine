import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Slash, Sparkles } from "lucide-react";
import ColumnDropdown from "./ColumnDropdown";

interface PromptBuilderProps {
  value: string;
  onChange: (value: string) => void;
  selectedColumns: string[];
  onColumnsChange: (columns: string[]) => void;
}

const PromptBuilder = ({ value, onChange, selectedColumns, onColumnsChange }: PromptBuilderProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Help Me enhancement state
  const [showEnhancementModal, setShowEnhancementModal] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "/" && !showDropdown) {
      e.preventDefault();
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      const cursorPos = target.selectionStart;
      
      setDropdownPosition({
        top: rect.top + 40,
        left: rect.left + 20,
      });
      setShowDropdown(true);
      setCursorPosition(cursorPos);
    }

    if (e.key === "Escape" && showDropdown) {
      setShowDropdown(false);
      setSearchTerm("");
    }
  };

  const handleColumnSelect = (columnName: string) => {
    if (!selectedColumns.includes(columnName)) {
      onColumnsChange([...selectedColumns, columnName]);

      // Insert column reference at cursor position
      const newValue =
        value.slice(0, cursorPosition) +
        `{${columnName}}` +
        value.slice(cursorPosition);
      onChange(newValue);
    }

    setShowDropdown(false);
    setSearchTerm("");
    textareaRef.current?.focus();
  };

  const handleHelpMe = () => {
    if (!value.trim()) return;

    setIsEnhancing(true);
    // Simulate API call with 2 second delay
    setTimeout(() => {
      // Mock enhanced prompt based on current prompt
      const enhanced = generateEnhancedPrompt(value, selectedColumns);
      setEnhancedPrompt(enhanced);
      setIsEnhancing(false);
      setShowEnhancementModal(true);
    }, 2000);
  };

  const generateEnhancedPrompt = (originalPrompt: string, columns: string[]) => {
    // Mock enhancement logic - in real implementation, this comes from backend AI
    const lowerPrompt = originalPrompt.toLowerCase();

    // Example enhancement for common patterns
    if (lowerPrompt.includes("indian") && lowerPrompt.includes("origin")) {
      return `Analyze {CONTACT_NAME} and determine if the person is of Indian origin.

Consider:
- Name patterns typical of Indian culture
- Regional variations (North Indian, South Indian, etc.)
- Common Indian surnames and given names

Respond with:
- indian_origin: "Yes" or "No"
- confidence: "High", "Medium", or "Low"
- reasoning: Brief explanation (1-2 sentences)`;
    }

    if (lowerPrompt.includes("ceo") || lowerPrompt.includes("founder")) {
      return `Find the CEO or founder of {COMPANY_NAME}.

Research:
- Official company website and About page
- LinkedIn company page
- Recent press releases and news articles

Respond with:
- name: Full name of the CEO/founder
- title: Official job title
- linkedin: LinkedIn profile URL (if available)
- confidence: "High", "Medium", or "Low"`;
    }

    if (lowerPrompt.includes("funding") || lowerPrompt.includes("raised")) {
      return `Research if {COMPANY_NAME} has raised funding recently (within the last 12 months).

Check:
- Crunchbase and funding databases
- Press releases and news articles
- Company announcements

Respond with:
- raised_funding: "Yes" or "No"
- amount: Funding amount (if available)
- round: Funding round (e.g., "Series A", "Seed")
- date: Date of funding announcement
- confidence: "High", "Medium", or "Low"`;
    }

    // Default enhancement
    return `${originalPrompt}

Please provide a structured response with:
- result: Your main finding
- confidence: "High", "Medium", or "Low"
- reasoning: Brief explanation of your analysis`;
  };

  const handleAcceptEnhanced = () => {
    onChange(enhancedPrompt);
    setShowEnhancementModal(false);
    textareaRef.current?.focus();
  };

  const handleRejectEnhanced = () => {
    setShowEnhancementModal(false);
    textareaRef.current?.focus();
  };

  const charCount = value.length;
  const tokenEstimate = Math.ceil(charCount / 4);

  return (
    <>
      <div className="space-y-3">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What do you want to know about these accounts?

Examples:
• Is {{CONTACT_NAME}} of Indian origin?
• Did {{COMPANY_NAME}} raise funding recently?
• What technologies does {{COMPANY_DOMAIN}} use?

Type / to add data fields from your list"
            className="w-full min-h-[160px] p-4 rounded-xl border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              lineHeight: '1.5'
            }}
          />

          {/* Column insertion hint */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md backdrop-blur-sm">
            <Slash className="w-3 h-3" />
            <span>Type / to insert column</span>
          </div>

          {/* Column Dropdown */}
          {showDropdown && (
            <div
              className="fixed z-50"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`
              }}
            >
              <ColumnDropdown
                searchTerm={searchTerm}
                onSelect={handleColumnSelect}
                onClose={() => {
                  setShowDropdown(false);
                  setSearchTerm("");
                }}
              />
            </div>
          )}
        </div>

        {/* Bottom row: Token count and Help Me button */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>{charCount} characters</span>
            <span className="text-primary">~{tokenEstimate} tokens</span>
            {selectedColumns.length === 0 && (
              <span className="text-amber-600">⚠ Add at least one column reference</span>
            )}
          </div>

          {/* Help Me Button */}
          <Button
            onClick={handleHelpMe}
            disabled={!value.trim() || isEnhancing}
            size="sm"
            variant="outline"
            className="gap-2 border-primary/30 hover:bg-primary/5 hover:border-primary text-primary"
          >
            {isEnhancing ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Help Me
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Enhancement Comparison Modal */}
      {showEnhancementModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={() => setShowEnhancementModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[61] p-4">
            <div className="bg-background rounded-2xl shadow-2xl border-2 border-border w-full max-w-5xl max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-border flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">AI-Enhanced Prompt</h2>
                      <p className="text-sm text-muted-foreground">Your prompt has been optimized for better results</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowEnhancementModal(false)}
                    className="hover:bg-secondary"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Comparison Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Original Prompt */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">Original Prompt</h3>
                      <Badge variant="outline" className="text-xs">Your version</Badge>
                    </div>
                    <div className="p-4 rounded-xl border-2 border-border bg-secondary/30 min-h-[200px]">
                      <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                        {value}
                      </pre>
                    </div>
                  </div>

                  {/* Enhanced Prompt */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">Enhanced Prompt</h3>
                      <Badge className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                        AI Optimized
                      </Badge>
                    </div>
                    <div className="p-4 rounded-xl border-2 border-primary/50 bg-primary/5 min-h-[200px]">
                      <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                        {enhancedPrompt}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground">Why this enhancement?</h4>
                      <ul className="text-sm text-muted-foreground space-y-1.5">
                        <li>• Added structured output format for consistent results</li>
                        <li>• Included specific guidance on what to analyze</li>
                        <li>• Requested confidence levels for better data quality</li>
                        <li>• Improved clarity and removed ambiguity</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-between flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={handleRejectEnhanced}
                  className="gap-2"
                >
                  Keep Original
                </Button>
                <Button
                  onClick={handleAcceptEnhanced}
                  className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                >
                  <Sparkles className="w-4 h-4" />
                  Use Enhanced Prompt
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PromptBuilder;
