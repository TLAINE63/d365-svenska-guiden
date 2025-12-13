import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone: string;
  description: string;
}

serve(async (req: Request): Promise<Response> => {
  console.log("send-contact-email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, description }: ContactEmailRequest = await req.json();
    console.log("Received contact form submission from:", name, email);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Dynamic Factory <noreply@dynamicfactory.se>",
        to: ["thomas.laine@dynamicfactory.se"],
        subject: `Ny kontaktförfrågan från ${name}`,
        html: `
          <h1>Ny kontaktförfrågan</h1>
          <p><strong>Namn:</strong> ${name}</p>
          <p><strong>E-post:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone || "Ej angivet"}</p>
          <h2>Meddelande:</h2>
          <p>${description}</p>
        `,
      }),
    });

    const responseData = await emailResponse.json();
    console.log("Contact email response:", responseData);

    if (!emailResponse.ok) {
      throw new Error(responseData.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
