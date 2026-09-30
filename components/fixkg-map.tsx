"use client"

import { useEffect, useRef } from "react"
import type * as Leaflet from "leaflet"
import "leaflet/dist/leaflet.css"

export type FixKGMapMarker = {
  id: string
  title: string
  address: string
  category?: string
  status?: string
  position: [number, number]
}

type FixKGMapProps = {
  markers?: FixKGMapMarker[]
  selectedId?: string
  onSelect?: (marker: FixKGMapMarker) => void
  className?: string
}

const defaultCenter: [number, number] = [42.8746, 74.5698]

function markerIcon(L: typeof import("leaflet").default, status = "") {
  const color = status.includes("реш")
    ? "var(--fixkg-green)"
    : status.includes("отклон")
      ? "var(--fixkg-danger)"
      : status.includes("рассмотр")
        ? "var(--fixkg-violet)"
        : status.includes("работ")
          ? "var(--fixkg-yellow)"
          : "var(--fixkg-blue)"
  return L.divIcon({
    className: "fixkg-marker-wrap",
    html: `<span class="fixkg-marker" style="background:${color}"><span></span></span>`,
    iconSize: [34, 42],
    iconAnchor: [17, 38],
    popupAnchor: [0, -34],
  })
}

export function FixKGMap({ markers = [], selectedId, onSelect, className = "" }: FixKGMapProps) {
  const mapNode = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Leaflet.Map | null>(null)
  const layerRef = useRef<Leaflet.LayerGroup | null>(null)

  useEffect(() => {
    if (!mapNode.current || mapRef.current) return
    let disposed = false
    import("leaflet").then(({ default: L }) => {
      if (disposed || !mapNode.current || mapRef.current) return
      const map = L.map(mapNode.current, { zoomControl: false, attributionControl: true }).setView(defaultCenter, 12)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors" }).addTo(map)
    L.control.zoom({ position: "bottomright" }).addTo(map)
    layerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map
      window.setTimeout(() => map.invalidateSize(), 100)
    })
    return () => { disposed = true; mapRef.current?.remove(); mapRef.current = null; layerRef.current = null }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) return
    import("leaflet").then(({ default: L }) => {
      layer.clearLayers()
      markers.forEach((marker) => {
      const pin = L.marker(marker.position, { icon: markerIcon(L, marker.status) })
        .bindPopup(`<strong>${marker.title}</strong><br/><span>${marker.address}</span>`)
        .on("click", () => onSelect?.(marker))
      pin.addTo(layer)
      if (marker.id === selectedId) { pin.openPopup(); map.flyTo(marker.position, 15, { duration: 0.45 }) }
    })
      if (markers.length) map.fitBounds(L.latLngBounds(markers.map((marker) => marker.position)), { padding: [30, 30], maxZoom: 13 })
    })
  }, [markers, selectedId, onSelect])

  return <div ref={mapNode} className={`fixkg-map ${className}`} aria-label="Карта обращений FixKG" />
}
