import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
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

// Pulsing marker (ring expands & fades)
const Marker = ({
  position,
  color,
  isActive,
  onClick,
}: {
  position: [number, number, number];
  color: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  // Compute rotation so rings face outward from sphere center
  const rotation = useMemo<[number, number, number]>(() => {
    const dir = new THREE.Vector3(...position).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    const e = new THREE.Euler().setFromQuaternion(q);
    return [e.x, e.y, e.z];
  }, [position]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = (t % 2) / 2;
    if (ringRef.current) {
      const s = 0.5 + pulse * 2.5;
      ringRef.current.scale.set(s, s, s);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - pulse);
    }
    const pulse2 = ((t + 1) % 2) / 2;
    if (ring2Ref.current) {
      const s = 0.5 + pulse2 * 2.5;
      ring2Ref.current.scale.set(s, s, s);
      (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.4 * (1 - pulse2);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Outer glow halo */}
      <mesh>
        <sphereGeometry args={[isActive ? 0.13 : 0.1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
      {/* Inner core dot */}
      <mesh
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <sphereGeometry args={[isActive ? 0.06 : 0.045, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Static ring outline (already oriented via group rotation) */}
      <mesh>
        <ringGeometry args={[0.07, 0.085, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Animated pulse rings */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2Ref}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// Procedural earth-like material using noise (no external textures needed)
const EarthMaterial = () => {
  const material = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPos;

        // Simple 3D hash noise
        float hash(vec3 p) {
          p = fract(p * 0.3183099 + 0.1);
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }
        float noise(vec3 x) {
          vec3 p = floor(x);
          vec3 f = fract(x);
          f = f*f*(3.0-2.0*f);
          return mix(mix(mix(hash(p+vec3(0,0,0)), hash(p+vec3(1,0,0)), f.x),
                         mix(hash(p+vec3(0,1,0)), hash(p+vec3(1,1,0)), f.x), f.y),
                     mix(mix(hash(p+vec3(0,0,1)), hash(p+vec3(1,0,1)), f.x),
                         mix(hash(p+vec3(0,1,1)), hash(p+vec3(1,1,1)), f.x), f.y), f.z);
        }
        float fbm(vec3 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p *= 2.0;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          // Continents via fbm
          float n = fbm(vPos * 1.4);
          float land = smoothstep(0.48, 0.55, n);

          // Ocean color (deep blue)
          vec3 ocean = mix(vec3(0.02, 0.05, 0.12), vec3(0.05, 0.12, 0.22), n);
          // Land color (greenish-brown with variation)
          float detail = fbm(vPos * 6.0);
          vec3 landCol = mix(vec3(0.12, 0.18, 0.10), vec3(0.25, 0.22, 0.14), detail);

          vec3 base = mix(ocean, landCol, land);

          // Lighting
          vec3 lightDir = normalize(vec3(0.6, 0.4, 0.8));
          float diff = max(dot(vNormal, lightDir), 0.0);
          float ambient = 0.25;
          vec3 color = base * (ambient + diff * 0.9);

          // Rim light (atmosphere)
          float rim = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.5);
          color += vec3(0.2, 0.7, 0.8) * rim * 0.4;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
    return m;
  }, []);
  return <primitive object={material} attach="material" />;
};

// Atmosphere shell (Fresnel glow)
const Atmosphere = ({ radius }: { radius: number }) => {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {},
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
          gl_FragColor = vec4(0.36, 0.85, 0.95, 1.0) * intensity;
        }
      `,
    });
  }, []);
  return (
    <mesh scale={radius}>
      <sphereGeometry args={[1, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

// Auto-rotating globe group
const RotatingGlobe = ({
  places,
  onSelect,
  selectedId,
  radius,
}: {
  places: Place[];
  onSelect: (p: Place) => void;
  selectedId: string | null;
  radius: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={groupRef}>
      {/* Earth */}
      <Sphere args={[radius, 96, 96]}>
        <EarthMaterial />
      </Sphere>

      {/* Subtle wireframe grid on top */}
      <Sphere args={[radius * 1.001, 24, 24]}>
        <meshBasicMaterial color="#5eead4" wireframe transparent opacity={0.08} />
      </Sphere>

      {/* Markers */}
      {places.map((p) => {
        const pos = latLngToVec3(p.map_x, p.map_y, radius * 1.015);
        const color = moodMeta[p.mood].hex;
        return (
          <Marker
            key={p.id}
            position={pos}
            color={color}
            isActive={selectedId === p.id}
            onClick={() => onSelect(p)}
          />
        );
      })}
    </group>
  );
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
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[-5, -2, -3]} intensity={0.3} color="#5eead4" />
      <DreiStars radius={80} depth={60} count={3500} factor={4} fade speed={1} />

      <RotatingGlobe
        places={places}
        onSelect={onSelect}
        selectedId={selectedId}
        radius={radius}
      />

      {/* Atmosphere glow */}
      <Atmosphere radius={radius * 1.15} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
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
                  {(() => {
                    const M = moodMeta[selected.mood];
                    const MIcon = M.Icon;
                    return (
                      <span className={`inline-flex items-center gap-1 text-[10px] font-cairo px-2 py-0.5 rounded-full text-white ${M.color}`}>
                        <MIcon className="w-3 h-3" />
                        {t(M.ar, M.en)}
                      </span>
                    );
                  })()}
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
                {moodDistribution.map((m) => {
                  const M = moodMeta[m.mood];
                  const MIcon = M.Icon;
                  return (
                    <div key={m.mood} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: M.hex }}
                      />
                      <span className="inline-flex items-center gap-1 text-xs font-cairo text-muted-foreground">
                        <MIcon className="w-3.5 h-3.5" style={{ color: M.hex }} />
                        {t(M.ar, M.en)}
                      </span>
                      <span className="text-xs font-cairo text-foreground font-semibold ms-auto">
                        {m.pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoriesStatsSection;
