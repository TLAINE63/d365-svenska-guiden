import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalysisEmailRequest {
  analysisType: "ERP" | "CRM";
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  analysisData: Record<string, any>;
  recommendation?: {
    product: string;
    reasons: string[];
  };
}

serve(async (req: Request): Promise<Response> => {
  console.log("send-analysis-email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      analysisType, 
      companyName, 
      contactName, 
      phone, 
      email, 
      analysisData,
      recommendation 
    }: AnalysisEmailRequest = await req.json();
    
    console.log(`Received ${analysisType} analysis submission from:`, companyName, contactName);

    const formatAnalysisData = (data: Record<string, any>) => {
      return Object.entries(data)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `<p><strong>${key}:</strong> ${value.join(", ")}</p>`;
          }
          return `<p><strong>${key}:</strong> ${value}</p>`;
        })
        .join("");
    };

    const recommendationHtml = recommendation 
      ? `
        <h2>Rekommendation</h2>
        <p><strong>Rekommenderad lösning:</strong> ${recommendation.product}</p>
        <p><strong>Anledningar:</strong></p>
        <ul>
          ${recommendation.reasons.map(r => `<li>${r}</li>`).join("")}
        </ul>
      `
      : "";

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Dynamic Factory <noreply@dynamicfactory.se>",
        to: ["thomas.laine@dynamicfactory.se"],
        subject: `Ny ${analysisType}-behovsanalys från ${companyName}`,
        html: `
          <h1>Ny ${analysisType}-behovsanalys slutförd</h1>
          
          <h2>Kontaktinformation</h2>
          <p><strong>Företag:</strong> ${companyName}</p>
          <p><strong>Kontaktperson:</strong> ${contactName}</p>
          <p><strong>Telefon:</strong> ${phone || "Ej angivet"}</p>
          <p><strong>E-post:</strong> ${email}</p>
          
          <h2>Analysresultat</h2>
          ${formatAnalysisData(analysisData)}
          
          ${recommendationHtml}
        `,
      }),
    });

    const responseData = await emailResponse.json();
    console.log("Analysis email response:", responseData);

    if (!emailResponse.ok) {
      throw new Error(responseData.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-analysis-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
