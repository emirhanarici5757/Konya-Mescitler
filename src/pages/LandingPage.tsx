import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, History, Compass } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-editorial-bg flex flex-col items-center justify-center overflow-hidden font-serif">
      {/* Background Ornaments */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-12 w-1 border-l border-editorial-primary h-full" />
        <div className="absolute top-0 right-12 w-1 border-r border-editorial-primary h-full" />
        <div className="absolute top-1/2 left-0 w-full border-t border-editorial-primary h-1" />
      </div>

      {/* Decorative Navigation Simulation */}
      <nav className="absolute top-0 w-full h-20 px-10 flex items-center justify-between border-b border-editorial-primary/10">
        <div className="text-xl font-bold uppercase tracking-[0.2em] text-editorial-primary">Mescid-i Konya</div>
        <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-editorial-secondary font-sans">
          <span className="text-editorial-primary cursor-default">Anasayfa</span>
          <span className="hover:text-editorial-primary cursor-pointer transition-colors" onClick={() => navigate('/map')}>Harita</span>
          <span className="hover:text-editorial-primary cursor-pointer transition-colors">Arşiv</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          <div className="mb-10 text-[11px] font-bold uppercase tracking-[0.3em] text-editorial-secondary font-sans border-b border-editorial-primary/20 pb-2">
            Şehir Rehberi & Arşiv
          </div>

          <h1 className="text-6xl md:text-8xl font-medium text-editorial-text tracking-tight mb-8 leading-tight">
            Konya'nın Kadim <br />
            <span className="italic text-editorial-primary font-serif">Mescitleri</span>
          </h1>

          <p className="text-lg md:text-xl text-editorial-text/70 mb-12 max-w-2xl mx-auto leading-relaxed font-sans">
            Selçuklu payitahtının sokak aralarında gizlenmiş, asırlardır sessizce tarihe tanıklık eden butik ibadethaneleri keşfedin.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate('/map')}
              className="px-10 py-5 bg-editorial-primary text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xl hover:shadow-editorial-primary/20 transform hover:-translate-y-0.5 group"
            >
              Haritayı Başlat
            </button>
            <button
              className="px-10 py-5 border border-editorial-primary/20 text-editorial-primary font-sans text-xs font-bold uppercase tracking-widest hover:bg-editorial-paper transition-all"
            >
              Koleksiyonu Gör
            </button>
          </div>
        </motion.div>

        {/* Statistics or Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-editorial-primary/10 pt-12"
        >
          <div className="text-center group">
            <div className="text-4xl text-editorial-primary mb-2 italic">142</div>
            <div className="text-[10px] uppercase tracking-widest text-editorial-secondary font-sans font-bold">Tarihi Kayıt</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl text-editorial-primary mb-2 italic">800+</div>
            <div className="text-[10px] uppercase tracking-widest text-editorial-secondary font-sans font-bold">Yıllık Miras</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl text-editorial-primary mb-2 italic">31</div>
            <div className="text-[10px] uppercase tracking-widest text-editorial-secondary font-sans font-bold">Aktif Bölge</div>
          </div>
        </motion.div>
      </main>

      <footer className="absolute bottom-8 text-[10px] uppercase tracking-[0.4em] text-editorial-secondary font-sans">
        &mdash; Mevlana Celaleddin Rumi Diyarı &mdash;
      </footer>
    </div>
  );
}
