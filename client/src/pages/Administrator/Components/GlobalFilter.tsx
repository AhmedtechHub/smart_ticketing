import { CalendarIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ranges = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
  "Custom Range…",
];

const GlobalFilter = () => (
  <div className="flex items-center gap-2">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 rounded-lg border-border bg-card text-sm font-medium text-foreground
                     hover:bg-accent hover:text-accent-foreground gap-2"
        >
          <CalendarIcon className="h-4 w-4 text-primary" />
          Last 30 Days
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 font-sans">
        {ranges.map((r) => (
          <DropdownMenuItem key={r} className="text-sm cursor-pointer">
            {r}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>

    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9 rounded-lg border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    >
      <Filter className="h-4 w-4" />
    </Button>
  </div>
);

export default GlobalFilter;
