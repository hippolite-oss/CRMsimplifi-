import { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const PageWrapper = ({
  children,
  title,
  subtitle,
  maxWidth = "7xl",
  padding = "lg",
  className = "",
}: PageWrapperProps) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "p-4 sm:p-6",
    md: "p-6 sm:p-8",
    lg: "p-6 sm:p-8 lg:p-12",
    xl: "p-8 sm:p-12 lg:p-16",
  };

  return (
    <div
      className={`${maxWidthClasses[maxWidth]} mx-auto w-full ${paddingClasses[padding]} ${className}`}
    >
      {/* Header de page optionnel */}
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
      )}

      {/* Contenu de la page */}
      <div className="space-y-6">{children}</div>
    </div>
  );
};

export default PageWrapper;
