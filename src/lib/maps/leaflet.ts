import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { ChannelPartner } from "@/types"
import {
  type GeoPoint,
  type MapService,
  type MapServiceOptions,
  PARTNER_TYPE_VISUALS,
} from "./types"

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function partnerIcon(partner: ChannelPartner, isFocused = false): L.DivIcon {
  const visual = PARTNER_TYPE_VISUALS[partner.type] || PARTNER_TYPE_VISUALS.SCA
  const highNpa = partner.npaFlag === "high"
  const color = visual.color
  const shortLabel = visual.shortLabel
  const strokeColor = highNpa ? "#dc2626" : isFocused ? "#1e1b4b" : "#ffffff"
  const strokeWidth = highNpa || isFocused ? 3 : 2
  const scale = isFocused ? 1.15 : 1

  return L.divIcon({
    className: "partner-leaflet-marker",
    html: `
      <div style="position:relative; width:32px; height:40px; cursor:pointer; transform:scale(${scale}); transform-origin:bottom center; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.35)); transition:transform 0.2s ease;">
        <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.16344 0 0 7.16344 0 16C0 26.5 16 40 16 40C16 40 32 26.5 32 16C32 7.16344 24.8366 0 16 0Z" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
          <circle cx="16" cy="15" r="9.5" fill="#ffffff"/>
          <text x="16" y="18.5" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="bold" fill="${color}" text-anchor="middle">${shortLabel}</text>
        </svg>
        ${highNpa ? `<span style="position:absolute; top:-2px; right:-2px; width:10px; height:10px; border-radius:50%; background:#dc2626; border:1.5px solid #fff;"></span>` : ""}
      </div>
    `,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -38],
  })
}

function userIcon(): L.DivIcon {
  return L.divIcon({
    className: "user-location-marker",
    html: `
      <div style="position:relative; width:28px; height:28px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; width:28px; height:28px; border-radius:50%; background:rgba(234, 88, 12, 0.35); animation:leaflet-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width:14px; height:14px; border-radius:50%; background:#ea580c; border:2.5px solid #ffffff; box-shadow:0 1px 6px rgba(234,88,12,0.6);"></div>
      </div>
      <style>
        @keyframes leaflet-ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      </style>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  })
}

function createPopupContent(p: ChannelPartner): string {
  const visual = PARTNER_TYPE_VISUALS[p.type] || PARTNER_TYPE_VISUALS.SCA
  const highNpa = p.npaFlag === "high"

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 210px; max-width: 260px; padding: 2px;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 6px; border-radius: 4px; background: ${visual.color}18; color: ${visual.color}; border: 1px solid ${visual.color}35;">
          ${escapeHtml(p.type)}
        </span>
        ${
          highNpa
            ? `<span style="font-size: 10px; font-weight: 600; color: #dc2626; background: #fee2e2; padding: 2px 6px; border-radius: 4px;">High NPA</span>`
            : ""
        }
      </div>
      <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #1e293b; line-height: 1.35;">
        ${escapeHtml(p.name)}
      </h4>
      <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b; line-height: 1.35;">
        📍 ${escapeHtml(p.address)}, ${escapeHtml(p.city)}, ${escapeHtml(p.state)}
      </p>
      <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; font-size: 11px;">
        ${
          p.phone
            ? `<a href="tel:${escapeHtml(p.phone)}" style="font-weight: 600; color: #2563eb; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                📞 ${escapeHtml(p.phone)}
              </a>`
            : `<span></span>`
        }
        <span style="color: #64748b; font-size: 10px; font-weight: 500;">
          Cap: ${p.fundUtilizationPct}%
        </span>
      </div>
    </div>
  `
}

export function createLeafletMap(): MapService {
  let map: L.Map | null = null
  let markerLayer: L.LayerGroup | null = null
  let userMarker: L.Marker | null = null
  let partnerMarkers = new Map<string, L.Marker>()
  let currentOptions: MapServiceOptions = {}

  return {
    mount(container, options = {}) {
      currentOptions = options
      map = L.map(container, {
        center: [22.9734, 78.6569],
        zoom: 5,
        scrollWheelZoom: true,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map)

      markerLayer = L.layerGroup().addTo(map)

      // Ensure proper sizing after mount
      setTimeout(() => {
        map?.invalidateSize()
      }, 100)
    },

    setMarkers(partners, focusId) {
      if (!map || !markerLayer) return
      markerLayer.clearLayers()
      partnerMarkers.clear()
      const bounds: L.LatLngExpression[] = []

      for (const p of partners) {
        const isFocused = Boolean(focusId && p.id === focusId)
        const marker = L.marker([p.geo.lat, p.geo.lng], {
          icon: partnerIcon(p, isFocused),
          title: p.name,
          zIndexOffset: isFocused ? 1000 : 0,
        })

        marker.bindPopup(createPopupContent(p), {
          closeButton: true,
          autoPan: true,
        })

        marker.on("click", () => {
          if (currentOptions.onMarkerClick) {
            currentOptions.onMarkerClick(p.id)
          }
        })

        marker.addTo(markerLayer)
        partnerMarkers.set(p.id, marker)
        bounds.push([p.geo.lat, p.geo.lng])

        if (isFocused) {
          marker.openPopup()
          map.setView([p.geo.lat, p.geo.lng], 13, { animate: true })
        }
      }

      if (bounds.length > 0 && !focusId) {
        map.fitBounds(L.latLngBounds(bounds), {
          padding: [40, 40],
          maxZoom: 12,
        })
      }
    },

    focusPartner(partner) {
      if (!map) return
      const marker = partnerMarkers.get(partner.id)
      map.setView([partner.geo.lat, partner.geo.lng], 14, { animate: true })
      if (marker) {
        marker.openPopup()
      }
    },

    setUserLocation(loc: GeoPoint) {
      if (!map) return
      userMarker?.remove()
      userMarker = L.marker([loc.lat, loc.lng], {
        icon: userIcon(),
        title: "Your Location",
        zIndexOffset: 2000,
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:system-ui;font-size:12px;font-weight:600;padding:2px;">📍 Your Current Location</div>`,
        )
      map.setView([loc.lat, loc.lng], 11, { animate: true })
    },

    invalidateSize() {
      if (map) {
        map.invalidateSize()
      }
    },

    destroy() {
      if (map) {
        map.remove()
        map = null
      }
      markerLayer = null
      userMarker = null
      partnerMarkers.clear()
    },
  }
}

