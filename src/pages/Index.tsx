import { useState } from "react";
import { Sparkles } from "lucide-react";
import AccountsTable from "@/components/AccountsTable";
import SmartColumnModal from "@/components/SmartColumnModal";

const Index = () => {
  const [isSmartColumnOpen, setIsSmartColumnOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Target Profiles</h1>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                19.9K Credits
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <AccountsTable onAskAIClick={() => setIsSmartColumnOpen(true)} />
      </main>

      {/* Smart Column Modal */}
      <SmartColumnModal 
        open={isSmartColumnOpen} 
        onOpenChange={setIsSmartColumnOpen}
      />
    </div>
  );
};

export default Index;
