'use client'

import { useMemo, useState } from 'react'
import { geoCentroid } from 'd3-geo'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'

interface WorldLeadsMapProps {
  countryCounts: Record<string, number>
  argentinaProvinceCounts?: Record<string, number>
}

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const ARGENTINA_GEO_URL =
  'https://cdn.jsdelivr.net/npm/@wmgeolab/geo-boundaries@9469f09/gbOpen/ARG/ADM1/geoBoundaries-ARG-ADM1_simplified.geojson'

const COUNTRY_NAME_ALIASES: Record<string, string[]> = {
  AR: ['Argentina'],
  BO: ['Bolivia'],
  BR: ['Brazil', 'Brasil'],
  CA: ['Canada'],
  CL: ['Chile'],
  CO: ['Colombia'],
  GB: ['United Kingdom', 'Great Britain'],
  MX: ['Mexico'],
  PE: ['Peru'],
  PY: ['Paraguay'],
  US: ['United States', 'United States of America', 'USA'],
  UY: ['Uruguay'],
}

const ARGENTINA_PROVINCE_ALIASES: Record<string, string> = {
  C: 'CABA',
  B: 'BUENOS AIRES',
  K: 'CATAMARCA',
  H: 'CHACO',
  U: 'CHUBUT',
  X: 'CORDOBA',
  W: 'CORRIENTES',
  E: 'ENTRE RIOS',
  P: 'FORMOSA',
  Y: 'JUJUY',
  L: 'LA PAMPA',
  F: 'LA RIOJA',
  M: 'MENDOZA',
  N: 'MISIONES',
  Q: 'NEUQUEN',
  R: 'RIO NEGRO',
  A: 'SALTA',
  J: 'SAN JUAN',
  D: 'SAN LUIS',
  Z: 'SANTA CRUZ',
  S: 'SANTA FE',
  G: 'SANTIAGO DEL ESTERO',
  V: 'TIERRA DEL FUEGO',
  T: 'TUCUMAN',
}

const DEFAULT_WORLD_POSITION = { coordinates: [0, 20] as [number, number], zoom: 1.4 }
const DEFAULT_ARGENTINA_POSITION = { coordinates: [-64.2, -38.9] as [number, number], zoom: 1.85 }

function normalizeKey(value: string) {
  return value
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim()
}

function radiusForCount(count: number, max: number, range: { min: number; max: number }) {
  if (count <= 0 || max <= 0) return 0
  const normalized = Math.sqrt(count / max)
  return range.min + normalized * (range.max - range.min)
}

export function WorldLeadsMap({ countryCounts, argentinaProvinceCounts = {} }: WorldLeadsMapProps) {
  const [mapMode, setMapMode] = useState<'world' | 'argentina'>('world')
  const [zoneMode, setZoneMode] = useState<'soft' | 'medium' | 'strong'>('medium')
  const [position, setPosition] = useState(DEFAULT_WORLD_POSITION)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; count: number } | null>(null)

  const regionDisplayNames = useMemo(() => {
    try {
      return new Intl.DisplayNames(['en'], { type: 'region' })
    } catch {
      return null
    }
  }, [])

  const normalizedCountryCounts = useMemo(() => {
    const result: Record<string, number> = {}
    Object.entries(countryCounts).forEach(([rawCode, count]) => {
      const code = rawCode.trim().toUpperCase()
      if (!/^[A-Z]{2}$/.test(code)) return
      result[code] = (result[code] || 0) + count
    })
    return result
  }, [countryCounts])

  const countryNamesByCode = useMemo(() => {
    const result: Record<string, string[]> = {}

    Object.keys(normalizedCountryCounts).forEach((code) => {
      const names = new Set<string>()
      const autoName = regionDisplayNames?.of(code)
      if (autoName) names.add(normalizeKey(autoName))
      ;(COUNTRY_NAME_ALIASES[code] || []).forEach((name) => names.add(normalizeKey(name)))
      result[code] = Array.from(names)
    })

    return result
  }, [normalizedCountryCounts, regionDisplayNames])

  const zoneStyle = useMemo(() => {
    if (zoneMode === 'soft') return { fillBase: 0.12, fillStrong: 0.28, marker: { min: 3, max: 10 } }
    if (zoneMode === 'strong') return { fillBase: 0.2, fillStrong: 0.5, marker: { min: 6, max: 19 } }
    return { fillBase: 0.16, fillStrong: 0.4, marker: { min: 4, max: 15 } }
  }, [zoneMode])

  const normalizedProvinceCounts = useMemo(() => {
    const result: Record<string, number> = {}
    Object.entries(argentinaProvinceCounts).forEach(([rawKey, count]) => {
      const normalized = normalizeKey(rawKey)
      const aliased = ARGENTINA_PROVINCE_ALIASES[normalized] || normalized
      result[aliased] = (result[aliased] || 0) + count
    })
    return result
  }, [argentinaProvinceCounts])

  const hasArgentinaData = useMemo(
    () => Object.values(normalizedProvinceCounts).some((count) => count > 0),
    [normalizedProvinceCounts]
  )
  const effectiveMapMode: 'world' | 'argentina' = mapMode === 'argentina' && !hasArgentinaData ? 'world' : mapMode
  const mapPosition = effectiveMapMode === 'world' && mapMode === 'argentina' ? DEFAULT_WORLD_POSITION : position

  const maxCountryCount = useMemo(() => {
    const values = Object.values(normalizedCountryCounts)
    return values.length ? Math.max(...values) : 0
  }, [normalizedCountryCounts])

  const maxProvinceCount = useMemo(() => {
    const values = Object.values(normalizedProvinceCounts)
    return values.length ? Math.max(...values) : 0
  }, [normalizedProvinceCounts])

  function fillByRatio(count: number, max: number) {
    if (!count || max <= 0) return 'rgba(255,255,255,0.05)'
    const ratio = count / max
    if (ratio > 0.66) return `rgba(255,83,83,${zoneStyle.fillStrong})`
    if (ratio > 0.33) return `rgba(255,83,83,${Math.max(zoneStyle.fillBase, zoneStyle.fillStrong - 0.12)})`
    return `rgba(255,83,83,${zoneStyle.fillBase})`
  }

  function getCountryCountByGeoName(geoName: string) {
    for (const [code, count] of Object.entries(normalizedCountryCounts)) {
      const names = countryNamesByCode[code] || []
      if (names.includes(geoName)) return count
    }
    return 0
  }

  return (
    <div className="relative h-[420px] w-full border border-white/10 bg-[rgba(24,23,23,0.52)] md:h-[500px]">
      <div className="absolute left-2 top-2 z-20 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setMapMode('world')
            setPosition(DEFAULT_WORLD_POSITION)
          }}
          className={`inline-flex h-8 items-center border px-3 text-xs uppercase tracking-[0.1em] ${
            effectiveMapMode === 'world' ? 'border-primary/50 text-primary' : 'border-white/20 text-white/80'
          }`}
        >
          Mundo
        </button>
        {hasArgentinaData ? (
          <button
            type="button"
            onClick={() => {
              setMapMode('argentina')
              setPosition(DEFAULT_ARGENTINA_POSITION)
            }}
            className={`inline-flex h-8 items-center border px-3 text-xs uppercase tracking-[0.1em] ${
              effectiveMapMode === 'argentina' ? 'border-primary/50 text-primary' : 'border-white/20 text-white/80'
            }`}
          >
            Argentina
          </button>
        ) : null}
      </div>

      <div className="absolute right-2 top-2 z-20 flex gap-2">
        {(['soft', 'medium', 'strong'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setZoneMode(mode)}
            className={`inline-flex h-8 items-center border px-2 text-[10px] uppercase tracking-[0.1em] ${
              zoneMode === mode ? 'border-primary/50 text-primary' : 'border-white/20 text-white/80'
            }`}
          >
            {mode}
          </button>
        ))}

        <button
          type="button"
          onClick={() =>
            setPosition((prev) => ({
              ...prev,
              zoom: Math.max(1.2, Number((prev.zoom - 0.3).toFixed(2))),
            }))
          }
          className="inline-flex h-8 w-8 items-center justify-center border border-white/20 text-primary"
          aria-label="Alejar"
        >
          -
        </button>
        <button
          type="button"
          onClick={() =>
            setPosition((prev) => ({
              ...prev,
              zoom: Math.min(8, Number((prev.zoom + 0.3).toFixed(2))),
            }))
          }
          className="inline-flex h-8 w-8 items-center justify-center border border-white/20 text-primary"
          aria-label="Acercar"
        >
          +
        </button>

        <button
          type="button"
          onClick={() => setPosition(effectiveMapMode === 'argentina' ? DEFAULT_ARGENTINA_POSITION : DEFAULT_WORLD_POSITION)}
          className="inline-flex h-8 items-center justify-center border border-white/20 px-2 text-[10px] text-primary"
          aria-label="Reset mapa"
        >
          1:1
        </button>
      </div>

      <ComposableMap
        width={980}
        height={500}
        className="h-full w-full"
        projection="geoMercator"
        projectionConfig={
          effectiveMapMode === 'argentina'
            ? { scale: 900, center: [-64.2, -38.9] }
            : { scale: 145, center: [0, 20] }
        }
      >
        <ZoomableGroup center={mapPosition.coordinates} zoom={mapPosition.zoom}>
          <Geographies geography={effectiveMapMode === 'argentina' ? ARGENTINA_GEO_URL : GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = normalizeKey(String(geo.properties.name || geo.properties.shapeName || ''))

                if (effectiveMapMode === 'argentina') {
                  const provinceCount = normalizedProvinceCounts[name] || 0
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillByRatio(provinceCount, maxProvinceCount)}
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth={0.55}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fill: 'rgba(255,83,83,0.45)' },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={(event) => {
                        if (provinceCount <= 0) return
                        setTooltip({
                          x: event.clientX,
                          y: event.clientY,
                          label: String(geo.properties.shapeName || geo.properties.name || name),
                          count: provinceCount,
                        })
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  )
                }

                const countryCount = getCountryCountByGeoName(name)

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillByRatio(countryCount, maxCountryCount)}
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: 'rgba(255,83,83,0.36)' },
                      pressed: { outline: 'none' },
                    }}
                  />
                )
              })
            }
          </Geographies>

          {effectiveMapMode === 'world'
            ? Object.entries(normalizedCountryCounts).map(([code, count]) => {
                const countryNames = countryNamesByCode[code]
                if (!countryNames || count <= 0) return null

                return (
                  <Geographies key={code} geography={GEO_URL}>
                    {({ geographies }) => {
                      const geo = geographies.find((item) =>
                        countryNames.map(normalizeKey).includes(normalizeKey(String(item.properties.name || '')))
                      )
                      if (!geo) return null

                      const [lon, lat] = geoCentroid(geo)
                      const radius = radiusForCount(count, maxCountryCount, zoneStyle.marker)

                      return (
                        <Marker coordinates={[lon, lat]}>
                          <circle
                            r={radius}
                            fill="rgba(255, 83, 83, 0.24)"
                            stroke="rgba(255, 83, 83, 0.9)"
                            strokeWidth={1}
                            onMouseEnter={(event) =>
                              setTooltip({
                                x: event.clientX,
                                y: event.clientY,
                                label: regionDisplayNames?.of(code) || code,
                                count,
                              })
                            }
                            onMouseLeave={() => setTooltip(null)}
                          />
                        </Marker>
                      )
                    }}
                  </Geographies>
                )
              })
            : null}

          {effectiveMapMode === 'argentina'
            ? Object.entries(normalizedProvinceCounts).map(([province, count]) => {
                if (count <= 0) return null

                return (
                  <Geographies key={`province-marker-${province}`} geography={ARGENTINA_GEO_URL}>
                    {({ geographies }) => {
                      const geo = geographies.find(
                        (item) => normalizeKey(String(item.properties.shapeName || item.properties.name || '')) === province
                      )
                      if (!geo) return null

                      const [lon, lat] = geoCentroid(geo)
                      const radius = radiusForCount(count, maxProvinceCount, {
                        min: Math.max(2, zoneStyle.marker.min - 1),
                        max: Math.max(8, zoneStyle.marker.max - 2),
                      })

                      return (
                        <Marker coordinates={[lon, lat]}>
                          <circle
                            r={radius}
                            fill="rgba(255, 83, 83, 0.24)"
                            stroke="rgba(255, 83, 83, 0.92)"
                            strokeWidth={1}
                            onMouseEnter={(event) =>
                              setTooltip({
                                x: event.clientX,
                                y: event.clientY,
                                label: province,
                                count,
                              })
                            }
                            onMouseLeave={() => setTooltip(null)}
                          />
                        </Marker>
                      )
                    }}
                  </Geographies>
                )
              })
            : null}
        </ZoomableGroup>
      </ComposableMap>

      {tooltip ? (
        <div
          className="pointer-events-none fixed z-40 border border-white/20 bg-[var(--color-obscure)] px-2 py-1 text-xs text-white"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
        >
          {tooltip.label} · {tooltip.count}
        </div>
      ) : null}
    </div>
  )
}
