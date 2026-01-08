import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Sparkles, TrendingUp, Users, Globe, Target } from "lucide-react";

const TEMPLATES = [
  {
    id: 1,
    name: "Gong Call Summary",
    category: "Sprouts",
    credits: 0.1,
    icon: Sparkles,
    prompt: "Analyze the {COMPANY_NAME} and provide key insights from recent calls",
  },
  {
    id: 2,
    name: "GS - Analyst Call Transcript",
    category: "Sprouts",
    credits: 0.1,
    icon: Users,
    prompt: "Summarize analyst call transcript for {COMPANY_NAME}",
  },
  {
    id: 3,
    name: "Entity Normalization",
    category: "Sprouts",
    credits: 0.1,
    icon: Target,
    prompt: "Normalize entity data for {COMPANY_NAME} including {COMPANY_DOMAIN}",
  },
  {
    id: 4,
    name: "Corporate Hierarchy JSON",
    category: "Sprouts",
    credits: 0.1,
    icon: Globe,
    prompt: "Create corporate hierarchy structure for {COMPANY_NAME}",
  },
  {
    id: 5,
    name: "ICP & Value Prop",
    category: "Sprouts",
    credits: 0.1,
    icon: TrendingUp,
    prompt: "Analyze ICP fit and value proposition for {COMPANY_NAME} in {INDUSTRY}",
  },
  {
    id: 6,
    name: "Recent Funding Check",
    category: "Sprouts",
    credits: 0.1,
    icon: Sparkles,
    prompt: "Check recent funding activity for {COMPANY_NAME} using {FUNDING_AMOUNT} and {FUNDING_DATE}",
  },
];

interface TemplateLibraryProps {
  onSelectTemplate: (template: typeof TEMPLATES[0]) => void;
}

const TemplateLibrary = ({ onSelectTemplate }: TemplateLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<"All" | "Sprouts" | "Custom">("All");

  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-3">Templates</h3>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search templates..."
            className="pl-9 bg-background border-border"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2">
          {["All", "Sprouts", "Custom"].map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category as any)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filterCategory === category
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="w-full p-4 rounded-xl border border-border bg-card hover:bg-gradient-subtle hover:border-primary/50 transition-all group text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0 group-hover:shadow-glow transition-all">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {template.name}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className="bg-ai-primary/10 text-ai-primary border-ai-primary/20 ml-2 flex-shrink-0"
                      >
                        {template.credits}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.prompt}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TemplateLibrary;
