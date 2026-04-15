import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { sv } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SwedishDatePickerProps {
  value: string | null | undefined; // ISO date string yyyy-MM-dd
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  id?: string;
}

export function SwedishDatePicker({
  value,
  onChange,
  placeholder = "Välj datum",
  className,
  icon,
  id,
}: SwedishDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    const d = parse(value, "yyyy-MM-dd", new Date());
    return isValid(d) ? d : undefined;
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"));
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10",
            !dateValue && "text-muted-foreground",
            className
          )}
        >
          {icon || <CalendarIcon className="mr-2 h-4 w-4" />}
          {!icon && dateValue
            ? format(dateValue, "yyyy-MM-dd")
            : icon && dateValue
            ? <span className="ml-2">{format(dateValue, "yyyy-MM-dd")}</span>
            : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleSelect}
          locale={sv}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}
