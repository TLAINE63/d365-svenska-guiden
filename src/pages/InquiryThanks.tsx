import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";

export default function InquiryThanks() {
  const [q] = useSearchParams();
  const partners = q.get("p") || "valda partners";
  const email = q.get("e") || "er e-postadress";
  return (
    <>
      <SEOHead title="Tack, er förfrågan är skickad – d365.se" description="Bekräftelse på skickad förfrågan via d365.se." canonicalPath="/forfragan/tack" noIndex />
      <Navbar />
      <main className="min-h-[60vh] container mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">Tack, er förfrågan är skickad</h1>
        <p className="text-lg mb-8">Den har skickats till: {partners}. En bekräftelse har skickats till {email}.</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild><Link to="/kortlista/">Tillbaka till kortlistan</Link></Button>
          <Button asChild variant="outline"><Link to="/kunskapscenter/">Till kunskapscentret</Link></Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
