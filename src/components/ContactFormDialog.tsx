import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().trim().min(2, {
    message: "Namnet måste vara minst 2 tecken.",
  }).max(100, {
    message: "Namnet får vara max 100 tecken.",
  }),
  email: z.string().trim().email({
    message: "Ange en giltig e-postadress.",
  }).max(255, {
    message: "E-postadressen får vara max 255 tecken.",
  }),
  phone: z.string().trim().max(20, {
    message: "Telefonnumret får vara max 20 tecken.",
  }).optional().or(z.literal("")),
  description: z.string().trim().min(10, {
    message: "Beskrivningen måste vara minst 10 tecken.",
  }).max(1000, {
    message: "Beskrivningen får vara max 1000 tecken.",
  }),
  // Honeypot field - should always be empty (bots will fill it)
  website: z.string().max(0, { message: "" }).optional().or(z.literal("")),
});

interface ContactFormDialogProps {
  children: React.ReactNode;
}

const ContactFormDialog = ({ children }: ContactFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      description: "",
      website: "", // Honeypot field
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Honeypot check - if website field is filled, it's a bot
    if (values.website && values.website.length > 0) {
      // Silently reject but pretend success to confuse bots
      toast({
        title: "Tack för din förfrågan!",
        description: "Vi återkommer till dig så snart som möjligt.",
      });
      form.reset();
      setOpen(false);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: values.name,
          email: values.email,
          phone: values.phone || "",
          description: values.description,
          honeypot: values.website || "", // Send honeypot for server-side check
        },
      });

      if (error) {
        console.error("Error sending email:", error);
        throw error;
      }

      console.log("Email sent successfully:", data);

      toast({
        title: "Tack för din förfrågan!",
        description: "Vi återkommer till dig så snart som möjligt.",
      });

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Failed to send contact email:", error);
      toast({
        title: "Något gick fel",
        description: "Försök igen eller kontakta oss direkt via e-post.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl text-card-foreground">Boka Gratis Konsultation</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fyll i formuläret så återkommer vi till dig så snart som möjligt.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Namn *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ditt namn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-post *</FormLabel>
                  <FormControl>
                    <Input placeholder="din.epost@foretag.se" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefonnummer (valfritt)</FormLabel>
                  <FormControl>
                    <Input placeholder="+46 70 123 45 67" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vad är du intresserad av? *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Beskriv ditt behov och vilken Dynamics 365-lösning du är intresserad av..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Honeypot field - hidden from users, bots will fill it */}
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="absolute -left-[9999px] opacity-0 h-0 overflow-hidden" aria-hidden="true">
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="Leave empty" tabIndex={-1} autoComplete="off" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Avbryt
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Skickar..." : "Skicka förfrågan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormDialog;
