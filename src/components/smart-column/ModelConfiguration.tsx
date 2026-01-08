import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Crown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MODELS = [
  { 
    id: "gpt-4o", 
    name: "GPT-4o", 
    credits: 10,
    icon: Sparkles,
    description: "Most capable model"
  },
  { 
    id: "claude-sonnet-4", 
    name: "Claude Sonnet 4", 
    credits: 8,
    icon: Zap,
    description: "Fast and efficient"
  },
  { 
    id: "claude-opus-4", 
    name: "Claude Opus 4", 
    credits: 15,
    icon: Crown,
    description: "Premium reasoning"
  },
];

const ModelConfiguration = () => {
  const [selectedModel, setSelectedModel] = useState("gpt-4o");

  const currentModel = MODELS.find(m => m.id === selectedModel);
  const totalCredits = currentModel?.credits || 0;

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium text-foreground mb-2 flex items-center justify-between">
          <span>Model</span>
          <button className="text-primary text-xs hover:underline">
            Compare models
          </button>
        </Label>
        
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-full bg-card border-2 border-border hover:border-primary/50 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-2 border-border">
            {MODELS.map((model) => {
              const Icon = model.icon;
              return (
                <SelectItem 
                  key={model.id} 
                  value={model.id}
                  className="cursor-pointer hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{model.name}</span>
                        <Badge variant="outline" className="bg-ai-primary/10 text-ai-primary border-ai-primary/20">
                          {model.credits} credits/account
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{model.description}</p>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 rounded-xl border-2 border-primary/20 bg-gradient-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Estimated Cost</p>
            <p className="text-xs text-muted-foreground mt-1">
              Per account processed
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{totalCredits}</p>
            <p className="text-xs text-muted-foreground">credits</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelConfiguration;
