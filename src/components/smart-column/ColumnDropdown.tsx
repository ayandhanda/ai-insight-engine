import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const COLUMN_CATEGORIES = {
  default: [
    { name: "COMPANY_NAME", type: "text" },
    { name: "CONTACT_NAME", type: "text" },
    { name: "COMPANY_DOMAIN", type: "url" },
    { name: "LINKEDIN_URL", type: "url" },
  ],
  company: [
    { name: "COMPANY_LOCATION", type: "text" },
    { name: "EMPLOYEES_RANGE", type: "range" },
    { name: "INDUSTRY", type: "text" },
    { name: "SUB_INDUSTRY", type: "text" },
    { name: "KEYWORDS", type: "array" },
    { name: "REVENUE_RANGE", type: "range" },
    { name: "FUNDING_STAGE", type: "text" },
    { name: "TECHNOLOGIES", type: "array" },
    { name: "FOUNDED_YEAR", type: "number" },
    { name: "COMPANY_TYPE", type: "text" },
    { name: "FUNDING_AMOUNT", type: "number" },
    { name: "FUNDING_DATE", type: "date" },
    { name: "INVESTORS", type: "array" },
    { name: "BUSINESS_MODEL", type: "text" },
    { name: "PARENT_COMPANY", type: "text" },
    { name: "SUBSIDIARIES", type: "array" },
    { name: "COMPETITORS", type: "array" },
    { name: "PARTNERSHIPS", type: "array" },
  ],
  contact: [
    { name: "JOB_TITLES", type: "text" },
    { name: "SENIORITY_LEVEL", type: "text" },
    { name: "DEPARTMENTS", type: "text" },
    { name: "CONTACT_LOCATION", type: "text" },
    { name: "SKILLS", type: "array" },
    { name: "EDUCATION", type: "text" },
    { name: "YEARS_EXPERIENCE", type: "number" },
    { name: "YEARS_IN_CURRENT_ROLE", type: "number" },
    { name: "PREVIOUS_COMPANIES", type: "array" },
    { name: "CONTACT_EMAIL_PATTERN", type: "email" },
    { name: "CONTACT_PHONE_PATTERN", type: "phone" },
  ],
};

interface ColumnDropdownProps {
  searchTerm: string;
  onSelect: (column: string) => void;
  onClose: () => void;
}

const ColumnDropdown = ({ searchTerm, onSelect, onClose }: ColumnDropdownProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["default"]));
  const [localSearch, setLocalSearch] = useState("");

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const filterColumns = (columns: typeof COLUMN_CATEGORIES.default) => {
    if (!localSearch) return columns;
    return columns.filter(col => 
      col.name.toLowerCase().includes(localSearch.toLowerCase())
    );
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      text: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      number: "bg-green-500/10 text-green-600 border-green-500/20",
      array: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      url: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
      date: "bg-orange-500/10 text-orange-600 border-orange-500/20",
      email: "bg-pink-500/10 text-pink-600 border-pink-500/20",
      phone: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
      range: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    };
    return colors[type] || colors.text;
  };

  return (
    <div className="w-[400px] bg-popover border-2 border-border rounded-xl shadow-2xl overflow-hidden animate-scale-in">
      {/* Search */}
      <div className="p-3 border-b border-border bg-gradient-subtle">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search columns..."
            className="pl-9 bg-background border-border focus:ring-primary"
            autoFocus
          />
        </div>
      </div>

      {/* Columns List */}
      <ScrollArea className="h-[400px]">
        <div className="p-2">
          {/* Default Columns */}
          <div className="mb-2">
            <button
              onClick={() => toggleCategory("default")}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg transition-colors text-sm font-medium text-foreground"
            >
              {expandedCategories.has("default") ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span>Quick Access</span>
              <Badge variant="outline" className="ml-auto text-xs">
                {COLUMN_CATEGORIES.default.length}
              </Badge>
            </button>
            {expandedCategories.has("default") && (
              <div className="ml-6 mt-1 space-y-1">
                {filterColumns(COLUMN_CATEGORIES.default).map((column) => (
                  <button
                    key={column.name}
                    onClick={() => onSelect(column.name)}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-primary/10 rounded-lg transition-colors group"
                  >
                    <span className="text-sm font-medium text-foreground group-hover:text-primary">
                      {column.name}
                    </span>
                    <Badge variant="outline" className={`text-xs ${getTypeColor(column.type)}`}>
                      {column.type}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Company Fields */}
          <div className="mb-2">
            <button
              onClick={() => toggleCategory("company")}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg transition-colors text-sm font-medium text-foreground"
            >
              {expandedCategories.has("company") ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span>Company Fields</span>
              <Badge variant="outline" className="ml-auto text-xs">
                {COLUMN_CATEGORIES.company.length}
              </Badge>
            </button>
            {expandedCategories.has("company") && (
              <div className="ml-6 mt-1 space-y-1">
                {filterColumns(COLUMN_CATEGORIES.company).map((column) => (
                  <button
                    key={column.name}
                    onClick={() => onSelect(column.name)}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-primary/10 rounded-lg transition-colors group"
                  >
                    <span className="text-sm font-medium text-foreground group-hover:text-primary">
                      {column.name}
                    </span>
                    <Badge variant="outline" className={`text-xs ${getTypeColor(column.type)}`}>
                      {column.type}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contact Fields */}
          <div className="mb-2">
            <button
              onClick={() => toggleCategory("contact")}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg transition-colors text-sm font-medium text-foreground"
            >
              {expandedCategories.has("contact") ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span>Contact Fields</span>
              <Badge variant="outline" className="ml-auto text-xs">
                {COLUMN_CATEGORIES.contact.length}
              </Badge>
            </button>
            {expandedCategories.has("contact") && (
              <div className="ml-6 mt-1 space-y-1">
                {filterColumns(COLUMN_CATEGORIES.contact).map((column) => (
                  <button
                    key={column.name}
                    onClick={() => onSelect(column.name)}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-primary/10 rounded-lg transition-colors group"
                  >
                    <span className="text-sm font-medium text-foreground group-hover:text-primary">
                      {column.name}
                    </span>
                    <Badge variant="outline" className={`text-xs ${getTypeColor(column.type)}`}>
                      {column.type}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ColumnDropdown;
