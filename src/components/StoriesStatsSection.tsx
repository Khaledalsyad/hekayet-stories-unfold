import { useEffect, useMemo, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars as DreiStars } from "@react-three/drei";
import * as THREE from "three";
import { BookOpen, Users, Eye, Star, TrendingUp, Ghost, Leaf, Compass, Landmark, type LucideIcon } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

type Mood = "mystery" | "calm" | "adventure" | "history";

interface Place {
  id: string;
  name_ar: string;
  name_en: string;
  region_ar: string;
  region_en: string;
  mood: Mood;
  views: number;
  rating: number;
  reviews_count: number;
  map_x: number;
  map_y: number;
}

interface SiteStat {
  key: string;
  value: number;
}

const moodMeta: Record<Mood, { ar: string; en: string; Icon: LucideIcon; color: string; hex: string }> = {
  mystery: { ar: "غموض", en: "Mystery", Icon: Ghost, color: "bg-purple-500", hex: "#a855f7" },
  calm: { ar: "هدوء", en: "Calm", Icon: Leaf, color: "bg-emerald-500", hex: "#10b981" },
  adventure: { ar: "مغامرة", en: "Adventure", Icon: Compass, color: "bg-orange-500", hex: "#f97316" },
  history: { ar: "تاريخ", en: "History", Icon: Landmark, color: "bg-amber-600", hex: "#d97706" },
};

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
};

// Convert lat/lng-ish style (we stored x/y as % of map box) to 3D sphere coordinates
const latLngToVec3 = (mapX: number, mapY: number, radius: number) => {
  // Treat map_x as longitude offset and map_y as latitude on Egypt area (~22-32N, 25-35E)
  const lat = 32 - (mapY / 100) * 10; // 32N..22N
  const lng = 25 + (mapX / 100) * 10; // 25E..35E
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z] as [number, number, number];
};

const Globe = ({
  places,
  onSelect,
  selectedId,
}: {
  places: Place[];
  onSelect: (p: Place) => void;
  selectedId: string | null;
}) => {
  const radius = 2;
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={0.8} />
      <DreiStars radius={50} depth={50} count={2000} factor={4} fade speed={1} />

      {/* Globe */}
      <Sphere args={[radius, 64, 64]}>
        <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.1} />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere args={[radius * 1.001, 32, 32]}>
        <meshBasicMaterial color="#1e293b" wireframe transparent opacity={0.4} />
      </Sphere>

      {/* Glow atmosphere */}
      <Sphere args={[radius * 1.05, 32, 32]}>
        <meshBasicMaterial color="#5eead4" transparent opacity={0.05} side={THREE.BackSide} />
      </Sphere>

      {/* Markers */}
      {places.map((p) => {
        const pos = latLngToVec3(p.map_x, p.map_y, radius * 1.02);
        const color = moodMeta[p.mood].hex;
        const isActive = selectedId === p.id;
        return (
          <group key={p.id} position={pos}>
            <mesh onClick={() => onSelect(p)} onPointerOver={(e) => (e.stopPropagation(), (document.body.style.cursor = "pointer"))} onPointerOut={() => (document.body.style.cursor = "default")}>
              <sphereGeometry args={[isActive ? 0.08 : 0.05, 16, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>
            {/* Pulse */}
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color={color} transparent opacity={0.25} />
            </mesh>
          </group>
        );
      })}

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
    </>
  );
};

const StoriesStatsSection = () => {
  const { t, lang } = useLang();
  const [places, setPlaces] = useState<Place[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: pData }, { data: sData }] = await Promise.all([
        supabase.from("story_places").select("*").order("views", { ascending: false }),
        supabase.from("site_stats").select("key,value"),
      ]);
      if (pData) setPlaces(pData as Place[]);
      if (sData) {
        const map: Record<string, number> = {};
        (sData as SiteStat[]).forEach((s) => (map[s.key] = Number(s.value)));
        setStats(map);
      }
      setLoading(false);
    };
    load();
  }, []);

  const moodDistribution = useMemo(() => {
    const counts: Record<Mood, number> = { mystery: 0, calm: 0, adventure: 0, history: 0 };
    places.forEach((p) => (counts[p.mood] += 1));
    const total = places.length || 1;
    return (Object.keys(counts) as Mood[]).map((m) => ({
      mood: m,
      count: counts[m],
      pct: Math.round((counts[m] / total) * 100),
    }));
  }, [places]);

  const topPlaces = places.slice(0, 5);
  const avgRating = stats.avg_rating ? (stats.avg_rating / 10).toFixed(1) : "0";

  const cards = [
    { icon: BookOpen, ar: "الحكايات", en: "Stories", value: formatNumber(stats.total_stories || 0), trend: "+8%" },
    { icon: Users, ar: "المستخدمون", en: "Users", value: formatNumber(stats.total_users || 0), trend: "+12%" },
    { icon: Eye, ar: "المشاهدات", en: "Views", value: formatNumber(stats.total_views || 0), trend: "+24%" },
    { icon: Star, ar: "التقييم", en: "Rating", value: `⭐ ${avgRating}`, trend: "+0.2" },
  ];

  return (
    <section id="stories-stats" className="section-padding relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="text-accent text-sm tracking-[0.2em] uppercase mb-3 font-cairo">
            {t("بيانات حية", "Live Data")}
          </p>
          <h2 className="heading-cinematic font-cairo">
            {t("إحصائيات الحكايات", "Stories Statistics")}
          </h2>
          <p className="text-muted-foreground font-cairo mt-3 max-w-2xl">
            {t(
              "تصور تفاعلي لبيانات استخدام المنصة وأكثر الأماكن استكشافًا",
              "Interactive visualization of platform usage and most-explored places"
            )}
          </p>
        </motion.div>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="cinematic-card p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <c.icon className="w-5 h-5 text-accent" />
                </div>
                <span className="text-emerald-400 text-xs font-cairo flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {c.trend}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-cairo mb-1">{t(c.ar, c.en)}</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground font-cairo">
                {loading ? "—" : c.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Main grid: Globe + side panels */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3 cinematic-card relative overflow-hidden h-[500px]"
          >
            <div className="absolute top-4 start-4 z-10">
              <p className="text-xs text-muted-foreground font-cairo uppercase tracking-wider">
                {t("خريطة الحكايات", "Stories Map")}
              </p>
              <p className="text-sm text-foreground font-cairo">
                {t("مصر من الفضاء", "Egypt from above")}
              </p>
            </div>

            <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
              <Suspense fallback={null}>
                <Globe
                  places={places}
                  onSelect={setSelected}
                  selectedId={selected?.id ?? null}
                />
              </Suspense>
            </Canvas>

            {/* Selected tooltip */}
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 start-4 end-4 md:end-auto md:max-w-xs bg-background/80 backdrop-blur-xl border border-border rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground font-cairo">
                      {t(selected.region_ar, selected.region_en)}
                    </p>
                    <h4 className="text-foreground font-bold font-cairo">
                      {t(selected.name_ar, selected.name_en)}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-cairo px-2 py-0.5 rounded-full text-white ${moodMeta[selected.mood].color}`}
                  >
                    {moodMeta[selected.mood].emoji} {t(moodMeta[selected.mood].ar, moodMeta[selected.mood].en)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-cairo">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="w-3.5 h-3.5 text-accent" />
                    {formatNumber(selected.views)}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    <span className="text-foreground font-semibold">{selected.rating}</span>
                    ({selected.reviews_count})
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Side: top places + mood distribution */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top places */}
            <motion.div
              initial={{ opacity: 0, x: lang === "ar" ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="cinematic-card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold font-cairo text-foreground">
                  {t("الأكثر مشاهدة", "Top Places")}
                </h3>
                <span className="text-xs text-muted-foreground font-cairo">Top 5</span>
              </div>
              <div className="space-y-3">
                {topPlaces.map((p, i) => {
                  const max = topPlaces[0]?.views || 1;
                  const pct = (p.views / max) * 100;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelected(p)}
                      className="cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs text-muted-foreground font-cairo w-4">
                            {i + 1}
                          </span>
                          <span className="text-sm font-cairo text-foreground group-hover:text-accent transition-colors truncate">
                            {t(p.name_ar, p.name_en)}
                          </span>
                        </div>
                        <span className="text-xs font-cairo text-muted-foreground shrink-0">
                          {formatNumber(p.views)}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: moodMeta[p.mood].hex }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Mood distribution */}
            <motion.div
              initial={{ opacity: 0, x: lang === "ar" ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="cinematic-card p-5"
            >
              <h3 className="font-bold font-cairo text-foreground mb-4">
                {t("توزيع المزاج", "Mood Distribution")}
              </h3>
              {/* Stacked bar */}
              <div className="flex h-3 rounded-full overflow-hidden mb-4">
                {moodDistribution.map((m) => (
                  <div
                    key={m.mood}
                    style={{ width: `${m.pct}%`, backgroundColor: moodMeta[m.mood].hex }}
                    title={`${moodMeta[m.mood].ar}: ${m.pct}%`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {moodDistribution.map((m) => (
                  <div key={m.mood} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: moodMeta[m.mood].hex }}
                    />
                    <span className="text-xs font-cairo text-muted-foreground">
                      {moodMeta[m.mood].emoji} {t(moodMeta[m.mood].ar, moodMeta[m.mood].en)}
                    </span>
                    <span className="text-xs font-cairo text-foreground font-semibold ms-auto">
                      {m.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoriesStatsSection;
