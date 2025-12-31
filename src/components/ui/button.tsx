import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Product-specific variants
        "business-central": "bg-business-central text-business-central-foreground hover:bg-business-central/85 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        "crm": "bg-crm text-crm-foreground hover:bg-crm/85 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        "finance-supply": "bg-finance-supply text-finance-supply-foreground hover:bg-finance-supply/85 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        "copilot": "bg-copilot text-copilot-foreground hover:bg-copilot/85 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        "agents": "bg-agents text-agents-foreground hover:bg-agents/85 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        "customer-service": "bg-customer-service text-customer-service-foreground hover:bg-customer-service/85 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        "amber": "bg-amber-500 text-white hover:bg-amber-600 shadow-sm hover:shadow-md hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
