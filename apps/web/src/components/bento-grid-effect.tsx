"use client"

import { useEffect } from "react"

export function BentoGridEffect() {
  useEffect(() => {
    const cleanupCallbacks: Array<() => void> = []
    const cells = document.querySelectorAll<HTMLElement>(".bento-cell")

    cells.forEach((cell) => {
      if (cell.dataset.lightBound === "true") return

      const lightEffect = cell.querySelector<HTMLElement>(".light-effect")
      if (!lightEffect) return

      let cellRect = cell.getBoundingClientRect()
      let pointerX = 0
      let pointerY = 0
      let rafId: number | null = null

      const updateCellRect = () => {
        cellRect = cell.getBoundingClientRect()
      }

      const renderLightEffect = () => {
        rafId = null
        lightEffect.style.transform = `translate(${pointerX}px, ${pointerY}px) translate(-50%, -50%)`

        const gradientSize = 153
        const borderGradient = `
          radial-gradient(
            circle ${gradientSize}px at ${pointerX}px ${pointerY}px,
            rgba(255, 83, 83, 0.5) 50%,
            rgba(255, 255, 255, 0.05) ${gradientSize}px
          ) 1
        `

        cell.style.borderImage = borderGradient
      }

      const onMouseEnter = () => {
        updateCellRect()
        lightEffect.style.opacity = "1"
      }

      const onMouseLeave = () => {
        lightEffect.style.opacity = "0"
        cell.style.borderImage = "none"
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      }

      const onMouseMove = (event: MouseEvent) => {
        pointerX = event.clientX - cellRect.left
        pointerY = event.clientY - cellRect.top

        if (rafId === null) {
          rafId = requestAnimationFrame(renderLightEffect)
        }
      }

      cell.addEventListener("mouseenter", onMouseEnter)
      cell.addEventListener("mouseleave", onMouseLeave)
      cell.addEventListener("mousemove", onMouseMove)

      window.addEventListener("resize", updateCellRect, { passive: true })
      window.addEventListener("scroll", updateCellRect, { passive: true })

      cleanupCallbacks.push(() => {
        cell.removeEventListener("mouseenter", onMouseEnter)
        cell.removeEventListener("mouseleave", onMouseLeave)
        cell.removeEventListener("mousemove", onMouseMove)
        window.removeEventListener("resize", updateCellRect)
        window.removeEventListener("scroll", updateCellRect)

        if (rafId !== null) {
          cancelAnimationFrame(rafId)
          rafId = null
        }

        lightEffect.style.opacity = "0"
        lightEffect.style.transform = ""
        cell.style.borderImage = "none"
        delete cell.dataset.lightBound
      })

      cell.dataset.lightBound = "true"
    })

    const icons = document.querySelectorAll<HTMLImageElement>(".icon-with-blur-effect")

    icons.forEach((icon) => {
      if (icon.dataset.bound === "true") return

      const bentoCell = icon.closest<HTMLElement>(".bento-cell")
      if (!bentoCell) return

      let iconRect = icon.getBoundingClientRect()
      let pointerX = 0
      let pointerY = 0
      let rafId: number | null = null

      const updateIconRect = () => {
        iconRect = icon.getBoundingClientRect()
      }

      const renderMask = () => {
        rafId = null
        icon.style.opacity = "1"
        const maskImage = `radial-gradient(circle 50px at ${pointerX}px ${pointerY}px, black 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.2) 80%, transparent 100%)`
        icon.style.setProperty("-webkit-mask-image", maskImage)
        icon.style.maskImage = maskImage
      }

      icon.style.opacity = "0"
      icon.style.setProperty("-webkit-mask-image", "none")
      icon.style.maskImage = "none"

      const updateMask = (event: MouseEvent) => {
        pointerX = event.clientX - iconRect.left
        pointerY = event.clientY - iconRect.top

        if (rafId === null) {
          rafId = requestAnimationFrame(renderMask)
        }
      }

      const onMouseLeave = () => {
        icon.style.opacity = "0"
        icon.style.setProperty("-webkit-mask-image", "none")
        icon.style.maskImage = "none"
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      }

      bentoCell.addEventListener("mouseenter", updateIconRect, { passive: true })
      bentoCell.addEventListener("mousemove", updateMask)
      bentoCell.addEventListener("mouseleave", onMouseLeave)

      window.addEventListener("resize", updateIconRect, { passive: true })
      window.addEventListener("scroll", updateIconRect, { passive: true })

      cleanupCallbacks.push(() => {
        bentoCell.removeEventListener("mouseenter", updateIconRect)
        bentoCell.removeEventListener("mousemove", updateMask)
        bentoCell.removeEventListener("mouseleave", onMouseLeave)
        window.removeEventListener("resize", updateIconRect)
        window.removeEventListener("scroll", updateIconRect)

        if (rafId !== null) {
          cancelAnimationFrame(rafId)
          rafId = null
        }

        icon.style.opacity = "0"
        icon.style.setProperty("-webkit-mask-image", "none")
        icon.style.maskImage = "none"
        delete icon.dataset.bound
      })

      icon.dataset.bound = "true"
    })

    return () => {
      cleanupCallbacks.forEach((cleanup) => cleanup())
    }
  }, [])

  return null
}
