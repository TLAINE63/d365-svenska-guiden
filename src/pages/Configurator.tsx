import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import BizAppsHero from "@/assets/biz-apps-hero.png";

type Answer = {
  [key: string]: string;
};

type Question = {
  id: string;
  question: string;
  options: { value: string; label: string; description?: string }[];
};

const questions: Question[] = [
  {
    id: "company-size",
    question: "Hur många anställda har ert företag?",
    options: [
      { value: "small", label: "1-50 anställda", description: "Litet företag" },
      { value: "medium", label: "51-300 anställda", description: "Medelstort företag" },
      { value: "large", label: "301-1000 anställda", description: "Stort företag" },
      { value: "enterprise", label: "1000+ anställda", description: "Koncern/Enterprise" },
    ],
  },
  {
    id: "primary-need",
    question: "Vad är ert primära behov?",
    options: [
      { value: "erp", label: "Affärssystem/ERP", description: "Ekonomi, lager, inköp" },
      { value: "crm", label: "Kundhantering/CRM", description: "Försäljning, service, marknadsföring" },
      { value: "both", label: "Både ERP och CRM", description: "Komplett lösning" },
    ],
  },
  {
    id: "international",
    question: "Har ni internationell verksamhet?",
    options: [
      { value: "no", label: "Nej, endast Sverige" },
      { value: "nordic", label: "Ja, Norden" },
      { value: "europe", label: "Ja, Europa" },
      { value: "global", label: "Ja, global verksamhet" },
    ],
  },
  {
    id: "complexity",
    question: "Hur komplexa är era affärsprocesser?",
    options: [
      { value: "simple", label: "Enkla", description: "Standardprocesser" },
      { value: "moderate", label: "Måttliga", description: "Viss anpassning behövs" },
      { value: "complex", label: "Komplexa", description: "Branschspecifika processer" },
      { value: "very-complex", label: "Mycket komplexa", description: "Omfattande anpassning" },
    ],
  },
  {
    id: "manufacturing",
    question: "Bedriver ni tillverkning eller produktion?",
    options: [
      { value: "no", label: "Nej" },
      { value: "simple", label: "Ja, enkel tillverkning" },
      { value: "advanced", label: "Ja, avancerad tillverkning" },
    ],
  },
  {
    id: "supply-chain",
    question: "Hur viktig är supply chain management för er?",
    options: [
      { value: "not-important", label: "Inte viktigt" },
      { value: "moderate", label: "Ganska viktigt" },
      { value: "critical", label: "Kritiskt viktigt" },
    ],
  },
  {
    id: "sales-team",
    question: "Hur stort är ert säljteam?",
    options: [
      { value: "none", label: "Inget säljteam" },
      { value: "small", label: "1-10 personer" },
      { value: "medium", label: "11-50 personer" },
      { value: "large", label: "50+ personer" },
    ],
  },
  {
    id: "customer-service",
    question: "Behöver ni hantera kundservice och support?",
    options: [
      { value: "no", label: "Nej" },
      { value: "basic", label: "Ja, grundläggande" },
      { value: "advanced", label: "Ja, avancerat med ärendehantering" },
    ],
  },
  {
    id: "timeline",
    question: "Hur snabbt behöver ni komma igång?",
    options: [
      { value: "urgent", label: "Inom 3 månader" },
      { value: "normal", label: "3-6 månader" },
      { value: "flexible", label: "6-12 månader" },
      { value: "long-term", label: "12+ månader är okej" },
    ],
  },
  {
    id: "budget",
    question: "Vilken är er uppskattade budget per användare/månad?",
    options: [
      { value: "low", label: "Under 500 kr" },
      { value: "medium", label: "500-1000 kr" },
      { value: "high", label: "1000-2000 kr" },
      { value: "enterprise", label: "2000+ kr" },
    ],
  },
];

const getRecommendation = (answers: Answer) => {
  let bcScore = 0;
  let fscScore = 0;
  let crmScore = 0;

  // Company size
  if (answers["company-size"] === "small" || answers["company-size"] === "medium") {
    bcScore += 3;
  } else if (answers["company-size"] === "large" || answers["company-size"] === "enterprise") {
    fscScore += 3;
  }

  // Primary need
  if (answers["primary-need"] === "erp") {
    bcScore += 2;
    fscScore += 2;
  } else if (answers["primary-need"] === "crm") {
    crmScore += 5;
  } else if (answers["primary-need"] === "both") {
    bcScore += 1;
    fscScore += 1;
    crmScore += 1;
  }

  // International
  if (answers["international"] === "global" || answers["international"] === "europe") {
    fscScore += 2;
  } else if (answers["international"] === "no" || answers["international"] === "nordic") {
    bcScore += 1;
  }

  // Complexity
  if (answers["complexity"] === "simple" || answers["complexity"] === "moderate") {
    bcScore += 2;
  } else if (answers["complexity"] === "complex" || answers["complexity"] === "very-complex") {
    fscScore += 3;
  }

  // Manufacturing
  if (answers["manufacturing"] === "advanced") {
    fscScore += 3;
  } else if (answers["manufacturing"] === "simple") {
    bcScore += 2;
  }

  // Supply chain
  if (answers["supply-chain"] === "critical") {
    fscScore += 3;
  } else if (answers["supply-chain"] === "moderate") {
    bcScore += 1;
    fscScore += 1;
  }

  // Sales team
  if (answers["sales-team"] === "small") {
    crmScore += 2;
  } else if (answers["sales-team"] === "medium" || answers["sales-team"] === "large") {
    crmScore += 3;
  }

  // Customer service
  if (answers["customer-service"] === "basic") {
    crmScore += 2;
  } else if (answers["customer-service"] === "advanced") {
    crmScore += 3;
  }

  // Timeline
  if (answers["timeline"] === "urgent" || answers["timeline"] === "normal") {
    bcScore += 2;
    crmScore += 1;
  } else if (answers["timeline"] === "long-term") {
    fscScore += 1;
  }

  // Budget
  if (answers["budget"] === "low" || answers["budget"] === "medium") {
    bcScore += 2;
  } else if (answers["budget"] === "enterprise") {
    fscScore += 2;
  }

  // Determine recommendation
  const scores = [
    { product: "business-central", score: bcScore, name: "Business Central" },
    { product: "finance-supply-chain", score: fscScore, name: "Finance & Supply Chain" },
    { product: "crm", score: crmScore, name: "Dynamics 365 CRM" },
  ];

  scores.sort((a, b) => b.score - a.score);

  return scores;
};

const Configurator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;
  const canProceed = answers[currentQuestion?.id];

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const recommendations = showResults ? getRecommendation(answers) : [];
  const topRecommendation = recommendations[0];

  const getRecommendationDetails = (product: string) => {
    switch (product) {
      case "business-central":
        return {
          title: "Business Central",
          description: "Ett komplett affärssystem för mindre och medelstora företag",
          benefits: [
            "Snabb implementering (2-6 månader)",
            "Kostnadseffektiv lösning",
            "Allt-i-ett system",
            "Lätt att använda och underhålla",
            "Perfekt för standardprocesser",
          ],
          link: "/business-central",
        };
      case "finance-supply-chain":
        return {
          title: "Finance & Supply Chain Management",
          description: "För stora organisationer med komplexa och internationella verksamheter",
          benefits: [
            "Global finanshantering",
            "Avancerad supply chain",
            "Kraftfull tillverkning",
            "Obegränsad skalbarhet",
            "Branschspecifika anpassningar",
          ],
          link: "/finance-supply-chain",
        };
      case "crm":
        return {
          title: "Dynamics 365 CRM",
          description: "Komplett CRM-lösning för försäljning, service och marknadsföring",
          benefits: [
            "360° kundvy",
            "AI-driven försäljning",
            "Avancerad kundservice",
            "Marknadsföringsautomation",
            "LinkedIn-integration",
          ],
          link: "/crm",
        };
      default:
        return null;
    }
  };

  if (showResults) {
    const details = getRecommendationDetails(topRecommendation.product);
    if (!details) return null;

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-foreground mb-4">Din Rekommendation</h1>
              <p className="text-lg text-muted-foreground">
                Baserat på dina svar rekommenderar vi följande lösning
              </p>
            </div>

            <Card className="p-8 mb-8 border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-foreground mb-2">{details.title}</h2>
                <p className="text-lg text-muted-foreground">{details.description}</p>
              </div>

              <div className="space-y-3 mb-8">
                <h3 className="font-semibold text-card-foreground text-center mb-4">
                  Varför passar detta för er:
                </h3>
                {details.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0">
                  <Link to={details.link}>Läs mer om {details.title}</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/kontakt">Boka konsultation</Link>
                </Button>
              </div>
            </Card>

            {recommendations.length > 1 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
                  Andra alternativ att överväga:
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendations.slice(1).map((rec) => {
                    const altDetails = getRecommendationDetails(rec.product);
                    if (!altDetails) return null;
                    return (
                      <Card key={rec.product} className="p-6">
                        <h4 className="font-semibold text-card-foreground mb-2">
                          {altDetails.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          {altDetails.description}
                        </p>
                        <Button asChild size="sm" variant="outline" className="w-full">
                          <Link to={altDetails.link}>Läs mer</Link>
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="text-center">
              <Button onClick={handleRestart} variant="ghost">
                Starta om konfiguratorn
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Image */}
      <div className="w-full bg-black py-8 mt-16">
        <div className="container mx-auto px-4">
          <img 
            src={BizAppsHero} 
            alt="Microsoft Business Applications" 
            className="w-full max-w-2xl mx-auto h-auto"
          />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Hitta rätt Dynamics 365-lösning
            </h1>
            <p className="text-lg text-muted-foreground">
              Svara på några frågor så hjälper vi dig att hitta den perfekta lösningen för er verksamhet
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Fråga {currentStep + 1} av {questions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(((currentStep + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-secondary/30 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              {currentQuestion.question}
            </h2>

            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => handleAnswer(option.value)}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium text-card-foreground">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Föregående
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0"
            >
              {isLastQuestion ? "Se resultat" : "Nästa"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurator;
