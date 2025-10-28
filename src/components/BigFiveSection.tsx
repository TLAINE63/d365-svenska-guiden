import { DollarSign, AlertCircle, GitCompare, Star, Award } from "lucide-react";

const bigFiveItems = [
  {
    icon: DollarSign,
    title: "Priser & Kostnader",
    description: "Transparenta priser för licenser och implementering",
  },
  {
    icon: AlertCircle,
    title: "Problem & Utmaningar",
    description: "Vanliga utmaningar och hur vi löser dem",
  },
  {
    icon: GitCompare,
    title: "Jämförelser",
    description: "Microsoft Dynamics 365 vs andra ERP-system på marknaden",
  },
  {
    icon: Star,
    title: "Recensioner",
    description: "Vad våra kunder säger om Microsoft Dynamics 365",
  },
  {
    icon: Award,
    title: "Bäst i Klassen",
    description: "Varför Microsoft Dynamics 365 är branschledande",
  },
];

const BigFiveSection = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Fem vanliga frågor om Microsoft Dynamics 365
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vi svarar ärligt på alla frågor du har om Microsoft Dynamics 365
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {bigFiveItems.map((item, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg border border-border hover:shadow-[var(--shadow-hover)] transition-all duration-300 cursor-pointer group"
            >
              <div className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BigFiveSection;
