import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Custom Heritage-Digital variants
        gold: "bg-gradient-to-br from-gold to-gold-dark text-accent-foreground font-semibold shadow-gold hover:shadow-[0_0_50px_hsla(45,100%,51%,0.6)] hover:scale-105 active:scale-95",
        goldOutline: "border-2 border-gold text-gold hover:bg-gold/10 hover:shadow-gold",
        glass: "backdrop-blur-xl bg-[hsla(232,50%,15%,0.6)] border border-[hsla(0,0%,100%,0.1)] text-foreground hover:bg-[hsla(0,0%,100%,0.2)]",
        glassGold: "backdrop-blur-xl bg-[hsla(232,50%,15%,0.6)] border border-gold/30 text-gold hover:border-gold/60 hover:shadow-gold",
        social: "backdrop-blur-xl bg-[hsla(232,50%,15%,0.6)] border border-[hsla(0,0%,100%,0.1)] text-foreground hover:bg-[hsla(0,0%,100%,0.2)] hover:scale-105 active:scale-95",
        game: "bg-gradient-to-br from-gold to-gold-dark text-accent-foreground font-bold uppercase tracking-wider shadow-[0_0_50px_hsla(45,100%,51%,0.6)] hover:scale-110 active:scale-95 animate-glow",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
        iconLg: "h-12 w-12",
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
