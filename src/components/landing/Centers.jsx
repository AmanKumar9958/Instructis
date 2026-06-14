import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { centerLocations } from '../../data/centers';
import L from 'leaflet';
import { MapPin, Building2, Navigation } from 'lucide-react';

/* ─── Custom pin SVG with brand purple + orange ─── */
const customIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
  <defs>
    <linearGradient id="pinG" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#8134AF"/>
    </linearGradient>
    <filter id="ds" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="rgba(129,52,175,0.35)"/>
    </filter>
  </defs>
  <path filter="url(#ds)" d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26C32 7.163 24.837 0 16 0z" fill="url(#pinG)"/>
  <circle cx="16" cy="15" r="6" fill="white" opacity="0.95"/>
  <circle cx="16" cy="15" r="3" fill="#FF6C37"/>
</svg>`;

let DefaultIcon = L.divIcon({
  className: '',
  html: customIconSvg,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42]
});
L.Marker.prototype.options.icon = DefaultIcon;

/* ─── Cluster icon with brand gradient ─── */
const createClusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  let size = 40;
  if (count > 30) size = 52;
  else if (count > 10) size = 46;

  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;
      display:flex;align-items:center;justify-content:center;
      background:linear-gradient(135deg,#8134AF,#A855F7);
      color:#fff;font-weight:800;font-size:${count > 30 ? '14px' : '13px'};
      border-radius:50%;
      border:3px solid #fff;
      box-shadow:0 3px 12px rgba(129,52,175,0.35),0 0 0 4px rgba(129,52,175,0.1);
      font-family:'Inter',system-ui,sans-serif;
    ">${count}</div>`,
    className: '',
    iconSize: L.point(size, size),
  });
};

// Sub-component to handle map flying when state changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.flyTo(center, zoom, { duration: 1.5 });
  return null;
}

/* ─── Inject Leaflet custom styles (popups, controls) ─── */
function MapTheme() {
  const map = useMap();
  useEffect(() => {
    const id = 'instructis-map-css';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      .leaflet-popup-content-wrapper {
        background: #fff !important;
        border-radius: 14px !important;
        box-shadow: 0 12px 40px rgba(129,52,175,0.12), 0 4px 12px rgba(0,0,0,0.08) !important;
        padding: 0 !important;
        overflow: hidden;
        border: 1px solid rgba(129,52,175,0.08) !important;
      }
      .leaflet-popup-content { margin: 0 !important; }
      .leaflet-popup-tip {
        background: #fff !important;
        box-shadow: 0 3px 8px rgba(0,0,0,0.1) !important;
      }
      .leaflet-popup-close-button {
        color: #9ca3af !important;
        font-size: 18px !important;
        top: 8px !important; right: 10px !important;
      }
      .leaflet-popup-close-button:hover { color: #8134AF !important; }
      .leaflet-control-zoom {
        border: none !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        box-shadow: 0 2px 12px rgba(0,0,0,0.1) !important;
      }
      .leaflet-control-zoom a {
        background: #fff !important;
        color: #374151 !important;
        border-bottom: 1px solid #f3f4f6 !important;
        width: 36px !important; height: 36px !important;
        line-height: 36px !important;
        font-size: 16px !important;
        transition: all 0.15s ease !important;
      }
      .leaflet-control-zoom a:hover {
        background: #F8F0FA !important;
        color: #8134AF !important;
      }
      .leaflet-control-zoom a:last-child { border-bottom: none !important; }
      .leaflet-marker-icon { transition: filter 0.2s ease !important; }
      .leaflet-marker-icon:hover { filter: brightness(1.15) drop-shadow(0 2px 6px rgba(129,52,175,0.4)) !important; }
    `;
    document.head.appendChild(s);
  }, [map]);
  return null;
}

const Centers = () => {
  const [filter, setFilter] = useState('All');
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India Center
  const [zoom, setZoom] = useState(5);

  const states = ['All', ...new Set(centerLocations.map(c => c.state))];

  const filteredData = useMemo(() => {
    return filter === 'All' ? centerLocations : centerLocations.filter(c => c.state === filter);
  }, [filter]);

  const stateCount = new Set(centerLocations.map(c => c.state)).size;

  const handleStateChange = (e) => {
    const selected = e.target.value;
    setFilter(selected);
    if (selected !== 'All') {
      const firstCity = centerLocations.find(c => c.state === selected);
      setMapCenter([firstCity.lat, firstCity.lng]);
      setZoom(7);
    } else {
      setMapCenter([20.5937, 78.9629]);
      setZoom(5);
    }
  };

  return (
    <section id="centers" className="py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Header Row ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Our Pan-India Presence
            </h2>
            <p className="text-gray-500 mt-2 max-w-2xl leading-relaxed">
              Find Instructis coaching centers near you for JEE, NEET, and Class 11–12 programs.
              Choose your state to see offline hubs, doubt sessions, and local mentor support.
            </p>
          </div>

          {/* Stats + Dropdown */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Quick stats */}
            <div className="hidden sm:flex items-center gap-4 mr-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-brand-light-purple flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-brand-purple" />
                </div>
                <div>
                  <span className="font-extrabold text-gray-900">{centerLocations.length}</span>
                  <span className="text-gray-400 text-xs ml-1">Centers</span>
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-brand-orange" />
                </div>
                <div>
                  <span className="font-extrabold text-gray-900">{stateCount}</span>
                  <span className="text-gray-400 text-xs ml-1">States</span>
                </div>
              </div>
            </div>

            {/* State Dropdown */}
            <select
              onChange={handleStateChange}
              value={filter}
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white shadow-sm
                         text-sm font-semibold text-gray-700
                         focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple
                         outline-none transition-all duration-200 cursor-pointer
                         hover:border-gray-300 hover:shadow-md"
            >
              {states.map(s => <option key={s} value={s}>{s === 'All' ? '📍 All States' : s}</option>)}
            </select>
          </div>
        </div>

        {/* ─── Active Filter Badge ─── */}
        {filter !== 'All' && (
          <div className="flex items-center gap-2 mb-4 animate-in slide-in-from-top duration-300">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-light-purple border border-brand-purple/15">
              <MapPin className="w-3.5 h-3.5 text-brand-purple" />
              <span className="text-sm font-bold text-brand-purple">{filter}</span>
              <span className="text-xs text-brand-purple/60 font-semibold">
                — {filteredData.length} center{filteredData.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={() => {
                setFilter('All');
                setMapCenter([20.5937, 78.9629]);
                setZoom(5);
                // Also reset the select element
                const sel = document.querySelector('#centers select');
                if (sel) sel.value = 'All';
              }}
              className="text-xs text-gray-400 hover:text-brand-purple font-semibold transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {/* ─── Map ─── */}
        <div className="relative rounded-2xl overflow-hidden shadow-elevated group">
          {/* Top gradient accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 z-10 bg-gradient-to-r from-brand-purple via-brand-purple-light to-brand-orange" />

          <div className="h-[500px] sm:h-[560px] md:h-[620px] border-4 border-white rounded-2xl overflow-hidden">
            <MapContainer center={mapCenter} zoom={zoom} className="h-full w-full">
              <MapTheme />
              <ChangeView center={mapCenter} zoom={zoom} />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <MarkerClusterGroup
                chunkedLoading
                maxClusterRadius={40}
                disableClusteringAtZoom={7}
                iconCreateFunction={createClusterIcon}
                spiderfyOnMaxZoom
                showCoverageOnHover={false}
                animate
              >
                {filteredData.map(city => (
                  <Marker key={city.id} position={[city.lat, city.lng]}>
                    <Popup>
                      <div className="font-sans" style={{ padding: '14px 16px', minWidth: '180px' }}>
                        {/* Top accent */}
                        <div style={{
                          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                          background: 'linear-gradient(90deg, #8134AF, #FF6C37)',
                          borderRadius: '14px 14px 0 0',
                        }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px', height: '34px', borderRadius: '10px',
                            background: '#F8F0FA',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <MapPin style={{ width: '16px', height: '16px', color: '#8134AF' }} />
                          </div>
                          <div>
                            <p style={{
                              fontWeight: 800, fontSize: '14px', color: '#111827',
                              margin: 0, lineHeight: 1.3,
                            }}>{city.city}</p>
                            <p style={{
                              fontSize: '11px', color: '#9CA3AF',
                              margin: '2px 0 0', fontWeight: 600,
                            }}>{city.state}</p>
                          </div>
                        </div>
                        <div style={{
                          marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '6px 10px', borderRadius: '8px',
                          background: '#F0FDF4', border: '1px solid #DCFCE7',
                        }}>
                          <div style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            background: '#22C55E',
                          }} />
                          <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700 }}>
                            Active Center
                          </span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          </div>
        </div>

        {/* ─── Bottom hint ─── */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span className="font-medium">
            Showing <span className="text-gray-600 font-bold">{filteredData.length}</span> of{' '}
            <span className="text-gray-600 font-bold">{centerLocations.length}</span> centers
          </span>
          <span className="hidden sm:inline">Click markers for details · Scroll to zoom · Drag to pan</span>
        </div>
      </div>
    </section>
  );
};

export default Centers;