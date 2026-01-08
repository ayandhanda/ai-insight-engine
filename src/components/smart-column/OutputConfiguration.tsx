import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface OutputField {
  name: string;
  type: string;
  sample?: string;
}

interface OutputConfigurationProps {
  fields: OutputField[];
  displayMode: "single" | "separate";
  onDisplayModeChange: (mode: "single" | "separate") => void;
  primaryField: string;
  onPrimaryFieldChange: (field: string) => void;
}

const OutputConfiguration = ({
  fields,
  displayMode,
  onDisplayModeChange,
  primaryField,
  onPrimaryFieldChange,
}: OutputConfigurationProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2">Detected Output Fields</h3>
        <div className="p-4 rounded-xl border-2 border-border bg-secondary/30">
          <p className="text-sm text-muted-foreground mb-2">
            Detected {fields.length} output field{fields.length !== 1 ? 's' : ''}:
          </p>
          <div className="flex flex-wrap gap-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className="px-3 py-1.5 rounded-lg bg-background border border-border text-sm"
              >
                <span className="font-medium text-foreground">{field.name}</span>
                <span className="text-muted-foreground ml-2">({field.type})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          How do you want to display results?
        </h3>
        
        <RadioGroup value={displayMode} onValueChange={(value) => onDisplayModeChange(value as "single" | "separate")}>
          <div className="space-y-3">
            {/* Single Column Option */}
            <div className="p-4 rounded-xl border-2 border-border hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-3">
                <RadioGroupItem value="single" id="single" className="mt-1" />
                <Label htmlFor="single" className="flex-1 cursor-pointer">
                  <div className="font-medium text-foreground mb-1">
                    Single column <span className="text-xs text-muted-foreground">(Default)</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    All fields stored in one column. Click any row to see all fields in detail view.
                  </div>
                  
                  {displayMode === "single" && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm font-medium text-foreground mb-2">Select primary display field:</p>
                      <RadioGroup value={primaryField} onValueChange={onPrimaryFieldChange}>
                        <div className="space-y-2">
                          {fields.map((field) => (
                            <div key={field.name} className="flex items-center space-x-2">
                              <RadioGroupItem value={field.name} id={`field-${field.name}`} />
                              <Label
                                htmlFor={`field-${field.name}`}
                                className="text-sm cursor-pointer flex-1"
                              >
                                {field.name}
                                {field.sample && (
                                  <span className="text-muted-foreground ml-2">
                                    e.g., "{field.sample.substring(0, 30)}{field.sample.length > 30 ? '...' : ''}"
                                  </span>
                                )}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </Label>
              </div>
            </div>

            {/* Separate Columns Option */}
            <div className="p-4 rounded-xl border-2 border-border hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-3">
                <RadioGroupItem value="separate" id="separate" className="mt-1" />
                <Label htmlFor="separate" className="flex-1 cursor-pointer">
                  <div className="font-medium text-foreground mb-1">
                    Separate columns for each field
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Creates {fields.length} column{fields.length !== 1 ? 's' : ''} on TAL: {fields.map(f => f.name).join(', ')}
                  </div>
                </Label>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default OutputConfiguration;
