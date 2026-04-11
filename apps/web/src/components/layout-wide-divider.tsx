export function LayoutWideDivider() {
  return (
    <div
      aria-hidden="true"
      className="relative left-1/2 -translate-x-1/2 border-t border-white/10"
      style={{ width: "var(--layout-divider-width)" }}
    />
  )
}
