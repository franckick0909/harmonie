"use client";

import { motion } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "success"
    | "warning"
    | "info";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      asChild,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = asChild;

    // Classes de base
    const baseClasses =
      "group relative inline-flex items-center justify-center whitespace-nowrap font-medium tracking-wide transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#927950] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden rounded-md";

    // Classes par variant (thème beige)
    const variantClasses = {
      primary: "bg-[#927950] text-white border border-[#927950]",
      secondary: "bg-[#F4E6CD] text-[#1E211E] border border-[#d5ccc0]",
      outline:
        "bg-white text-[#1E211E] border border-[#d5ccc0] hover:border-[#927950]",
      ghost: "bg-transparent text-[#1E211E] hover:bg-[#F4E6CD] border-0",
      destructive: "bg-transparent text-red-500 border-0 hover:bg-red-50",
      success: "bg-green-500 text-white border-0 hover:bg-green-600",
      warning: "bg-yellow-500 text-white border-0 hover:bg-yellow-600",
      info: "bg-blue-500 text-white border-0 hover:bg-blue-600",
    };

    // Classes par taille
    const sizeClasses = {
      sm: "h-9 px-4 text-xs gap-2",
      md: "h-11 px-6 text-sm gap-2",
      lg: "h-12 px-8 text-base gap-2.5",
      icon: "h-11 w-11",
    };

    // Overlay colors pour animations
    const overlayColors = {
      primary: "bg-[#1E211E]",
      secondary: "bg-[#927950]",
      outline: "bg-[#927950]",
      ghost: "bg-[#927950]",
      destructive: "bg-red-500",
      success: "bg-green-600",
      warning: "bg-yellow-600",
      info: "bg-blue-600",
    };

    const combinedClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Détecter si le contenu contient des icônes
    const hasIcons = React.Children.toArray(children).some((child) => {
      if (React.isValidElement(child)) {
        const props = child.props as { className?: string };
        // Détecter les icônes Lucide (ont généralement des classes w- et h-)
        const isIcon =
          (props?.className?.includes("w-") &&
            props?.className?.includes("h-")) ||
          child.type === Loader2;
        // Détecter si c'est un élément SVG
        const isSVGElement =
          typeof child.type === "string" &&
          (child.type === "svg" ||
            child.type === "path" ||
            child.type === "circle" ||
            child.type === "rect");
        return isIcon || isSVGElement;
      }
      // Si c'est du texte pur (string ou number), pas d'icône
      return false;
    });

    // Gap selon la taille
    const gapClasses = {
      sm: "gap-2",
      md: "gap-2",
      lg: "gap-2.5",
      icon: "gap-0",
    };

    // Animation de flip du texte (inspiré de PremiumButton) pour primary et secondary
    // Adapté pour gérer les icônes correctement
    const textFlipContent = (
      <div className="relative z-10 overflow-hidden flex flex-col items-center justify-center min-h-[1.5rem]">
        <span className={cn("flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full group-hover:delay-75", gapClasses[size])}>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
          {children}
        </span>
        <span className={cn("flex items-center justify-center absolute top-0 left-0 right-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0", gapClasses[size])}>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
          {children}
        </span>
      </div>
    );

    // Contenu simple pour les autres variants
    const simpleContent = (
      <span className={cn("relative z-10 flex items-center justify-center transition-colors duration-300", gapClasses[size])}>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
        {children}
      </span>
    );

    return (
      <motion.button
        className={combinedClasses}
        ref={ref}
        disabled={disabled || isLoading}
        whileHover={!disabled && !isLoading ? { y: -2 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {/* Background Flip Layer (inspiré de PremiumButton) */}
        {(variant === "primary" || variant === "secondary") && (
          <div
            className={cn(
              "absolute inset-0",
              overlayColors[variant],
              "translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
            )}
          />
        )}

        {/* Overlay pour outline (inspiré de custom/Button) */}
        {variant === "outline" && (
          <div
            className={cn(
              "absolute inset-0",
              overlayColors[variant],
              "translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
            )}
          />
        )}

        {/* Overlay pour ghost */}
        {variant === "ghost" && (
          <div
            className={cn(
              "absolute inset-0",
              overlayColors[variant],
              "opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            )}
          />
        )}

        {/* Contenu avec flip pour primary/secondary (texte pur uniquement), simple pour les autres */}
        {(variant === "primary" || variant === "secondary") &&
        !isLoading &&
        !hasIcons ? (
          textFlipContent
        ) : (
          <span
            className={cn(
              "relative z-10 flex items-center justify-center transition-colors duration-300",
              gapClasses[size],
              variant === "outline" && "group-hover:text-white",
              variant === "destructive" && "group-hover:text-red-700",
              (variant === "primary" || variant === "secondary") &&
                "group-hover:text-white"
            )}
          >
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            )}
            {children}
          </span>
        )}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };
