import { cn } from "@/lib/utils"

function AppLayout({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="bg-background w-full">
      <div
        data-slot="app-layout"
        className={cn(
          "mx-auto grid min-h-screen w-full max-w-5xl min-w-0 content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 lg:grid-cols-3 lg:p-12 xl:max-w-7xl 2xl:max-w-screen-2xl",
          className
        )}
        {...props}
      />
    </div>
  )
}

function SectionWrapper({
  title,
  children,
  className,
  containerClassName,
  ...props
}: React.ComponentProps<"div"> & {
  title: string
  containerClassName?: string
}) {
  return (
    <div
      data-slot="section-wrapper"
      className={cn(
        "mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none",
        containerClassName
      )}
      {...props}
    >
      <div className="text-muted-foreground px-1.5 py-2 text-xs font-medium">
        {title}
      </div>
      <div
        data-slot="section-content"
        className={cn(
          "bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

export { AppLayout, SectionWrapper }
