import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "info" | "warning" | "destructive" | "success";

const ICONS: Record<Variant, React.ComponentType<{ className?: string }>> = {
  info: Info,
  warning: AlertTriangle,
  destructive: XCircle,
  success: CheckCircle2,
};

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: Variant;
  title?: React.ReactNode;
  /** hide the leading icon */
  hideIcon?: boolean;
}

export function Alert({
  variant = "info",
  title,
  hideIcon = false,
  className,
  children,
  ...props
}: AlertProps) {
  const Icon = ICONS[variant];
  return (
    <div role="alert" className={cn("alert", `alert-${variant}`, className)} {...props}>
      {!hideIcon && <Icon />}
      <div className="min-w-0 space-y-1">
        {title && <div className="font-semibold text-foreground">{title}</div>}
        {children && <div className="text-muted-foreground">{children}</div>}
      </div>
    </div>
  );
}
