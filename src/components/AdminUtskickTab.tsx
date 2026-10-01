import AdminExpertOutreachCard from "@/components/AdminExpertOutreachCard";
import AdminNewsletterCard from "@/components/AdminNewsletterCard";

// Månadsbrevet ersätter de tidigare partnerrapporterna (Thomas beslut 2026-10-01).
export default function AdminUtskickTab({ token }: { token: string | null }) {
  return (
    <div className="space-y-6">
      <AdminNewsletterCard token={token} />
      <AdminExpertOutreachCard token={token} />
    </div>
  );
}
