import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: "border-green-500/50 text-green-700 bg-green-50 [&>svg]:text-green-600",
        warning: "border-yellow-500/50 text-yellow-700 bg-yellow-50 [&>svg]:text-yellow-600",
        info: "border-blue-500/50 text-blue-700 bg-blue-50 [&>svg]:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

// Custom hook for showing alerts
export function useAlert() {
  const [alerts, setAlerts] = React.useState<Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title?: string
    message: string
    duration?: number
  }>>([])

  const showAlert = React.useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    title?: string,
    duration = 5000
  ) => {
    const id = Math.random().toString(36).substr(2, 9)
    setAlerts(prev => [...prev, { id, type, title, message, duration }])

    if (duration > 0) {
      setTimeout(() => {
        setAlerts(prev => prev.filter(alert => alert.id !== id))
      }, duration)
    }

    return id
  }, [])

  const removeAlert = React.useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }, [])

  return { alerts, showAlert, removeAlert }
}

// Alert Provider Component
export function AlertProvider({ children }: { children: React.ReactNode }) {
  const { alerts, removeAlert } = useAlert()

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.type === 'error' ? 'destructive' : alert.type}
            className="min-w-[300px] shadow-lg"
          >
            {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
            <AlertDescription>{alert.message}</AlertDescription>
            <button
              onClick={() => removeAlert(alert.id)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </Alert>
        ))}
      </div>
    </>
  )
}
