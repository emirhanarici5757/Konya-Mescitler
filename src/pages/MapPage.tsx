import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Search, MapPin, Phone, Info, Navigation } from 'lucide-react';
import { Mosque } from '../types';
import { fetchMosques, geocodeAddress } from '../services/dataService';

// Custom Marker Icon
const createCustomIcon = () => {
  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center w-10 h-10">
        <div class="absolute w-full h-full bg-[#5a5a40]/20 rounded-full animate-ping"></div>
        <div class="relative w-8 h-8 bg-[#5a5a40] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

export default function MapPage() {
  const navigate = useNavigate();
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.8749, 32.4932]); // Center of Konya

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMosques();
        const results: Mosque[] = [];
        
        for (let i = 0; i < data.length; i++) {
          const m = data[i];
          setLoadingProgress(Math.round(((i + 1) / data.length) * 100));
          
          const coords = await geocodeAddress(m.address, m.district);
          if (coords) {
            results.push({ ...m, ...coords });
          }
          if (!coords) await new Promise(r => setTimeout(r, 100)); 
        }
        
        setMosques(results);
      } catch (error) {
        console.error('Error loading mosques:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredMosques = mosques.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectMosque = (mosque: Mosque) => {
    if (mosque.lat && mosque.lng) {
      setMapCenter([mosque.lat, mosque.lng]);
      setSelectedMosque(mosque);
    }
  };

  return (
    <div className="flex h-screen bg-editorial-bg overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-96 flex flex-col bg-white border-r border-editorial-primary/10 z-20 overflow-hidden">
        <header className="p-8 border-b border-editorial-primary/5 flex-shrink-0 bg-editorial-bg">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white rounded-full transition-colors text-editorial-secondary"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-serif font-medium text-editorial-text tracking-tight">Eserler</h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-editorial-secondary" />
            <input
              type="text"
              placeholder="Arşivde ara..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-editorial-primary/10 rounded-lg text-sm focus:border-editorial-primary transition-all outline-none italic font-serif"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-editorial-bg/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="w-8 h-8 text-editorial-primary animate-spin mb-4" />
              <p className="text-xs uppercase tracking-widest text-editorial-secondary font-bold font-sans">Veriler İşleniyor</p>
              <div className="w-32 h-0.5 bg-editorial-primary/10 rounded-full mt-4 overflow-hidden">
                <div 
                  className="h-full bg-editorial-primary transition-all duration-300" 
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          ) : filteredMosques.length === 0 ? (
            <div className="py-20 text-center font-serif italic text-editorial-secondary">
              <p>Herhangi bir eser bulunamadı.</p>
            </div>
          ) : (
            filteredMosques.map((m) => (
              <motion.button
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={m.id}
                onClick={() => handleSelectMosque(m)}
                className={`w-full text-left p-6 rounded-xl transition-all border ${
                  selectedMosque?.id === m.id 
                    ? 'bg-editorial-primary border-editorial-primary text-white shadow-xl' 
                    : 'bg-white border-editorial-primary/10 hover:border-editorial-primary/30 text-editorial-text shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest font-sans ${
                    selectedMosque?.id === m.id ? 'text-white/60' : 'text-editorial-secondary'
                  }`}>
                    {m.district}
                  </span>
                </div>
                <h3 className="font-serif text-lg mb-1 leading-tight">{m.name}</h3>
                <p className={`text-xs font-sans italic opacity-70 line-clamp-1`}>
                  {m.address}
                </p>
              </motion.button>
            ))
          )}
        </div>
      </aside>

      {/* Map View */}
      <main className="flex-1 relative">
        <MapContainer 
          center={mapCenter} 
          zoom={14} 
          scrollWheelZoom={true}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />
          
          <MapController center={mapCenter} />

          {mosques.map((m) => m.lat && m.lng && (
            <Marker 
              key={m.id} 
              position={[m.lat, m.lng]} 
              icon={createCustomIcon()}
              eventHandlers={{
                click: () => setSelectedMosque(m)
              }}
            >
              <Tooltip direction="top" offset={[0, -40]} opacity={1}>
                <div className="p-2 font-serif">
                  <p className="font-bold text-lg text-editorial-text">{m.name}</p>
                  <p className="text-[10px] text-editorial-secondary font-bold uppercase tracking-widest font-sans">{m.district}</p>
                </div>
              </Tooltip>
              <Popup className="editorial-popup">
                <div className="p-5 min-w-[240px] font-serif">
                  <h3 className="text-xl font-medium text-editorial-text mb-3 border-b border-editorial-primary/10 pb-2">{m.name}</h3>
                  <div className="space-y-4 font-sans italic text-editorial-text/70">
                    <div className="flex gap-3">
                      <MapPin className="w-4 h-4 text-editorial-primary mt-1 shrink-0" />
                      <p className="text-[13px] leading-relaxed">{m.address}</p>
                    </div>
                    <div className="flex gap-3">
                      <Phone className="w-4 h-4 text-editorial-primary shrink-0" />
                      <p className="text-sm font-medium">{m.phone}</p>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Selection Details (Desktop Overlay) */}
        <AnimatePresence>
          {selectedMosque && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 right-8 z-[1000] w-80 md:w-96"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-editorial-primary/10 p-8 flex flex-col font-serif">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-editorial-paper rounded-xl">
                    <Info className="w-6 h-6 text-editorial-primary" />
                  </div>
                  <button 
                    onClick={() => setSelectedMosque(null)}
                    className="text-editorial-secondary hover:text-editorial-text transition-colors"
                  >
                    &times;
                  </button>
                </div>
                
                <div className="text-[11px] font-bold uppercase tracking-widest text-editorial-accent mb-2 font-sans">Aktif Seçim</div>
                <h3 className="text-3xl font-medium text-editorial-text mb-4 leading-tight">{selectedMosque.name}</h3>
                
                <div className="space-y-4 mb-8">
                   <div className="flex gap-3 items-start">
                     <MapPin className="w-4 h-4 text-editorial-secondary mt-1" />
                     <p className="text-sm text-editorial-text/70 italic font-serif leading-relaxed">
                       {selectedMosque.address}
                     </p>
                   </div>
                   <div className="flex gap-3 items-center">
                     <Phone className="w-4 h-4 text-editorial-secondary" />
                     <p className="text-sm text-editorial-text/70 font-sans font-medium">
                       {selectedMosque.phone}
                     </p>
                   </div>
                </div>
                
                <div className="h-px bg-editorial-primary/10 mb-6" />
                
                <button className="w-full py-4 bg-editorial-primary text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-lg">
                  Detaylı Arşiv Bilgisi &rarr;
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
