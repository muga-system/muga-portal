interface BentoIconProps {
  src: string
  alt: string
  sizeClass?: string
  blurAmount?: string
  width?: number
  height?: number
}

export function BentoIcon({
  src,
  alt,
  sizeClass = "h-40 w-40",
  blurAmount = "3px",
  width = 160,
  height = 160,
}: BentoIconProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={`icon-with-blur-effect absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain ${sizeClass}`}
        style={{ ["--blur-amount" as string]: blurAmount }}
      />
    </div>
  )
}
