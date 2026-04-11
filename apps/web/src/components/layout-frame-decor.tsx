interface LayoutFrameDecorProps {
  sideInsetClassName?: string
  centerInsetClassName?: string
}

const sideStripeStyle = {
  backgroundImage:
    "repeating-linear-gradient(-45deg, transparent 0 10px, rgba(255,255,255,var(--layout-side-trama-alpha)) 10px 11px)",
}

const frameWidth = "var(--layout-frame-width)"
const sideStripeWidth = "var(--layout-side-trama-width)"

export function LayoutFrameDecor({
  sideInsetClassName = "inset-y-0",
  centerInsetClassName = "inset-y-0",
}: LayoutFrameDecorProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 hidden -translate-x-1/2 sm:block ${sideInsetClassName}`}
        style={{ width: frameWidth }}
      >
        <div
          className="absolute inset-y-0 left-0 -translate-x-full"
          style={{
            width: sideStripeWidth,
            ...sideStripeStyle,
          }}
        >
          <div className="absolute inset-y-0 left-0 border-l border-white/10" />
        </div>
        <div
          className="absolute inset-y-0 right-0 translate-x-full"
          style={{
            width: sideStripeWidth,
            ...sideStripeStyle,
          }}
        >
          <div className="absolute inset-y-0 right-0 border-r border-white/10" />
        </div>
      </div>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 hidden -translate-x-1/2 px-0 sm:block ${centerInsetClassName}`}
        style={{ width: frameWidth }}
      >
        <div className="h-full border-x border-white/10" />
      </div>
    </>
  )
}
