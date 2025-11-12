import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  popular?: boolean;
}

const PricingCard = ({ title, description, price, features, popular }: PricingCardProps) => {
  return (
    <Card className={`relative transition-all duration-300 hover:shadow-[var(--shadow-hover)] flex flex-col ${popular ? 'border-primary shadow-[var(--shadow-card)]' : 'border-border'}`}>
      {popular && (
        <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-primary-foreground px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
          Populärast
        </div>
      )}
      <CardHeader className="space-y-2 text-center pb-4 sm:pb-8 pt-4 sm:pt-8 px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-2xl text-card-foreground">{title}</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">{description}</CardDescription>
        <div className="pt-3 sm:pt-4">
          <div className="text-2xl sm:text-3xl font-bold text-primary">{price}</div>
          <div className="text-xs text-muted-foreground mt-1">per användare/månad</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 flex flex-col h-full px-4 sm:px-6">
        <ul className="space-y-2 sm:space-y-3 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-card-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          asChild
          className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] hover:opacity-90 text-primary-foreground h-11 sm:h-12 text-sm sm:text-base"
        >
          <Link to="/kontakt">Kontakta oss</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
