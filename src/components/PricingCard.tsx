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
    <Card className={`relative transition-all duration-300 hover:shadow-[var(--shadow-hover)] ${popular ? 'border-primary shadow-[var(--shadow-card)]' : 'border-border'}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
          Populärast
        </div>
      )}
      <CardHeader className="space-y-2 text-center pb-8 pt-8">
        <CardTitle className="text-2xl text-card-foreground">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
        <div className="pt-4">
          <div className="text-4xl font-bold text-primary">{price}</div>
          <div className="text-sm text-muted-foreground mt-1">per användare/månad</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-card-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          asChild
          className="w-full mt-6 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] hover:opacity-90 text-primary-foreground"
          size="lg"
        >
          <Link to="/kontakt">Kontakta oss</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
