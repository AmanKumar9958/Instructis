import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { centerLocations } from '../../data/centers';
import L from 'leaflet';

// FIX: Leaflet marker icons often don't show up in React/Vite builds
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [20, 30],
    iconAnchor: [10, 30]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Sub-component to handle map flying when state changes
function ChangeView({ center, zoom }) {
    const map = useMap();
    map.flyTo(center, zoom, { duration: 1.5 });
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
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h2 className="text-3xl font-bold text-gray-900">Our Pan-India Presence</h2>
                    <select
                        onChange={handleStateChange}
                        className="p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-sky-500 outline-none"
                    >
                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                    <MapContainer center={mapCenter} zoom={zoom} className="h-full w-full">
                        <ChangeView center={mapCenter} zoom={zoom} />
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        <MarkerClusterGroup chunkedLoading maxClusterRadius={40} disableClusteringAtZoom={7}>
                            {filteredData.map(city => (
                                <Marker key={city.id} position={[city.lat, city.lng]}>
                                    <Popup>
                                        <div className="font-sans">
                                            <p className="font-bold text-sky-700">{city.city}</p>
                                            <p className="text-gray-500 text-xs">{city.state}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MarkerClusterGroup>
                    </MapContainer>
                </div>
            </div>
        </section>
    );
};

export default Centers;