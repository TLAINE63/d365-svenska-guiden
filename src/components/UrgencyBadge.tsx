import { Clock, Users, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UrgencyBadgeProps {
  variant?: "spots" | "time" | "demand" | "consultation";
  spotsLeft?: number;
  className?: string;
}

export const UrgencyBadge = ({ 
  variant = "spots", 
  spotsLeft = 3,
  className = ""
}: UrgencyBadgeProps) => {
  if (variant === "spots") {
    return (
      <Badge 
        variant="outline" 
        className={`bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 animate-pulse ${className}`}
      >
        <Users className="h-3 w-3 mr-1" />
        Endast {spotsLeft} konsultationsplatser kvar denna månad
      </Badge>
    );
  }

  if (variant === "time") {
    return (
      <Badge 
        variant="outline" 
        className={`bg-orange-500/10 border-orange-500/40 text-orange-600 dark:text-orange-400 ${className}`}
      >
        <Clock className="h-3 w-3 mr-1" />
        Begränsat erbjudande – gäller t.o.m. månadsslutet
      </Badge>
    );
  }

  if (variant === "demand") {
    return (
      <Badge 
        variant="outline" 
        className={`bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400 ${className}`}
      >
        <Flame className="h-3 w-3 mr-1" />
        Hög efterfrågan just nu
      </Badge>
    );
  }

  if (variant === "consultation") {
    return (
      <Badge 
        variant="outline" 
        className={`bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 animate-pulse ${className}`}
      >
        <Clock className="h-3 w-3 mr-1" />
        Begränsat antal kostnadsfria rådgivningstillfällen varje månad
      </Badge>
    );
  }

  return null;
};

export default UrgencyBadge;
