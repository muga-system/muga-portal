interface PageHeroProps {
  badge: string
  title: string
  description: string
  variant?: "default" | "feature" | "minimal"
  aside?: React.ReactNode
}

export function PageHero({
  badge,
  title,
  description,
  variant = "default",
  aside,
}: PageHeroProps) {
  const isFeature = variant === "feature"
  const isMinimal = variant === "minimal"

  return (
    <section
      className={`layout-divider-bottom ${
        isFeature ? "py-10 sm:py-12 lg:py-16" : isMinimal ? "py-7 sm:py-8 lg:py-10" : "py-8 sm:py-10 lg:py-14"
      }`}
    >
      <div className="page-container">
        <div className={isFeature ? "grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end" : ""}>
          <div className="min-w-0">
            <div className="mb-5">
              <span className="muga-badge muga-badge--md">{badge}</span>
            </div>
            <h1
              className={`max-w-4xl font-semibold tracking-tight text-white ${
                isFeature
                  ? "text-4xl leading-[0.95] sm:text-6xl lg:text-[5rem]"
                  : isMinimal
                    ? "text-3xl leading-[1.02] sm:text-5xl lg:text-[3.8rem]"
                    : "text-4xl leading-[0.95] sm:text-6xl lg:text-[4.9rem]"
              }`}
            >
              {title}
            </h1>
            <p
              className={`mt-6 max-w-2xl text-white/75 ${
                isMinimal ? "text-[1rem] leading-7 sm:text-[1.0625rem] sm:leading-8" : "text-base leading-7 sm:text-lg sm:leading-8"
              }`}
            >
              {description}
            </p>
          </div>

          {isFeature && aside ? (
            <aside className="min-w-0 muga-surface p-5 sm:p-6">
              {aside}
            </aside>
          ) : null}
        </div>
      </div>
    </section>
  )
}
