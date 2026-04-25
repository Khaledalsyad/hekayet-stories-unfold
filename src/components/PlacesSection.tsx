import { useLang } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Clock, Star, X, MapPin, Volume2, VolumeX, Sparkles } from "lucide-react";
import place1 from "@/assets/place-1.jpg";
import place2 from "@/assets/place-2.jpg";
import place3 from "@/assets/place-3.jpg";
import place4 from "@/assets/place-4.jpg";

type Mood = "mystery" | "calm" | "adventure" | "history";
type Category = "desert" | "sea" | "ruins" | "oasis";

interface Place {
  id: number;
  titleAr: string;
  titleEn: string;
  infoAr: string;
  infoEn: string;
  storyAr: string;
  storyEn: string;
  locationAr: string;
  locationEn: string;
  img: string;
  mood: Mood;
  category: Category;
  duration: string;
  rating: number;
  reviewsCount: number;
  audio?: string;
}

const categoryLabel: Record<Category, { ar: string; en: string }> = {
  desert: { ar: "صحراء", en: "Desert" },
  sea: { ar: "بحر", en: "Sea" },
  ruins: { ar: "آثار", en: "Ruins" },
  oasis: { ar: "واحة", en: "Oasis" },
};

const moodConfig: Record<Mood, { ar: string; en: string; emoji: string; classes: string }> = {
  mystery: {
    ar: "غموض",
    en: "Mystery",
    emoji: "👻",
    classes: "bg-purple-500/90 text-white",
  },
  calm: {
    ar: "هدوء",
    en: "Calm",
    emoji: "🌿",
    classes: "bg-emerald-500/90 text-white",
  },
  adventure: {
    ar: "مغامرة",
    en: "Adventure",
    emoji: "🧭",
    classes: "bg-orange-500/90 text-white",
  },
  history: {
    ar: "تاريخ",
    en: "History",
    emoji: "🏺",
    classes: "bg-amber-600/90 text-white",
  },
};

const places: Place[] = [
  {
    id: 1,
    titleAr: "وادي الحيتان",
    titleEn: "Wadi Al-Hitan",
    infoAr: "موقع تراث عالمي في الفيوم",
    infoEn: "UNESCO World Heritage Site in Fayoum",
    storyAr:
      "في قلب صحراء الفيوم، تنام حيتان عمرها 40 مليون سنة. وادي الحيتان شاهد على تحوّل الكوكب، حيث كانت البحار تغطي ما هو الآن رمال ذهبية. كل صخرة هنا تحكي فصلاً من تاريخ الأرض.",
    storyEn:
      "In the heart of Fayoum desert, whales 40 million years old rest silently. Wadi Al-Hitan is a witness to the planet's transformation, where seas once covered today's golden sands. Every rock here tells a chapter of Earth's history.",
    locationAr: "الفيوم، مصر",
    locationEn: "Fayoum, Egypt",
    img: place1,
    mood: "mystery",
    duration: "3-4",
    rating: 4.8,
    reviewsCount: 240,
  },
  {
    id: 2,
    titleAr: "واحة سيوة",
    titleEn: "Siwa Oasis",
    infoAr: "واحة أمازيغية في الصحراء الغربية",
    infoEn: "Amazigh oasis in the Western Desert",
    storyAr:
      "بين كثبان الصحراء الغربية، تختبئ سيوة بثقافتها الأمازيغية وعيونها الفوّارة وبحيراتها المالحة. هنا، الزمن يمشي ببطء، والنخيل يحرس أسرار معبد آمون.",
    storyEn:
      "Among the western desert dunes, Siwa hides with its Amazigh culture, bubbling springs, and salt lakes. Here, time walks slowly, and palm trees guard the secrets of the Temple of Amun.",
    locationAr: "مطروح، مصر",
    locationEn: "Matrouh, Egypt",
    img: place2,
    mood: "calm",
    duration: "2-3 أيام",
    rating: 4.7,
    reviewsCount: 185,
  },
  {
    id: 3,
    titleAr: "الصحراء البيضاء",
    titleEn: "White Desert",
    infoAr: "تشكيلات طبيعية فريدة من نوعها",
    infoEn: "Unique natural rock formations",
    storyAr:
      "نحتت الرياح على مرّ آلاف السنين تماثيل من الطباشير الأبيض، فبدت الصحراء كأنها كوكب آخر. تحت ضوء القمر، تتوهج كقطع من الجليد وسط الرمال.",
    storyEn:
      "Winds carved white chalk sculptures over thousands of years, making the desert look like another planet. Under the moonlight, they glow like ice in the sand.",
    locationAr: "الوادي الجديد، مصر",
    locationEn: "New Valley, Egypt",
    img: place3,
    mood: "adventure",
    duration: "يوم كامل",
    rating: 4.9,
    reviewsCount: 312,
  },
  {
    id: 4,
    titleAr: "دهب",
    titleEn: "Dahab",
    infoAr: "جوهرة البحر الأحمر",
    infoEn: "Jewel of the Red Sea",
    storyAr:
      "حيث يلتقي الجبل بالبحر، تستلقي دهب بهدوئها البوهيمي. شعابها المرجانية تحكي للغواصين أسرار الأعماق، وشوارعها تنبض بإيقاع بدوي حر.",
    storyEn:
      "Where the mountain meets the sea, Dahab lies with its bohemian calm. Its coral reefs tell divers the secrets of the deep, and its streets pulse with a free Bedouin rhythm.",
    locationAr: "جنوب سيناء، مصر",
    locationEn: "South Sinai, Egypt",
    img: place4,
    mood: "calm",
    duration: "2-4 أيام",
    rating: 4.9,
    reviewsCount: 520,
  },
];

const Stars = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) => {
  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sizeClass} ${
            s <= Math.round(rating) ? "fill-accent text-accent" : "text-muted-foreground/40"
          }`}
        />
      ))}
    </div>
  );
};

const PlacesSection = () => {
  const { t, lang } = useLang();
  const [active, setActive] = useState<Place | null>(null);
  const [muted, setMuted] = useState(true);

  return (
    <section id="places" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-accent text-sm tracking-[0.2em] uppercase mb-3 font-cairo">
            {t("استكشف", "Explore")}
          </p>
          <h2 className="heading-cinematic font-cairo">
            {t("أماكن تحكي", "Places That Speak")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {places.map((place, i) => {
            const mood = moodConfig[place.mood];
            return (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                onClick={() => setActive(place)}
                className="cinematic-card group cursor-pointer flex flex-col"
              >
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img
                    src={place.img}
                    alt={t(place.titleAr, place.titleEn)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    width={768}
                    height={512}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                  {/* Mood badge top */}
                  <div
                    className={`absolute top-3 ${lang === "ar" ? "right-3" : "left-3"} px-2.5 py-1 rounded-full text-[11px] font-bold font-cairo backdrop-blur-sm shadow-lg ${mood.classes}`}
                  >
                    <span className="me-1">{mood.emoji}</span>
                    {t(mood.ar, mood.en)}
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold font-cairo text-foreground mb-2">
                      {t(place.titleAr, place.titleEn)}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 font-cairo">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        <span>{place.duration} {t("ساعات", "hrs")}</span>
                      </div>
                      <div className="flex items-center gap-1 font-cairo">
                        <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                        <span className="text-foreground font-semibold">{place.rating}</span>
                        <span className="opacity-70">({place.reviewsCount})</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs font-cairo mt-2 max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                      {t(place.infoAr, place.infoEn)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Details modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full bg-card border border-border rounded-2xl overflow-hidden grid md:grid-cols-2 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 end-4 z-10 w-10 h-10 rounded-full bg-background/70 backdrop-blur flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-square md:aspect-auto md:min-h-[500px]">
                <img
                  src={active.img}
                  alt={t(active.titleAr, active.titleEn)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent md:bg-gradient-to-r" />
                <div
                  className={`absolute top-4 start-4 px-3 py-1.5 rounded-full text-xs font-bold font-cairo shadow-lg ${moodConfig[active.mood].classes}`}
                >
                  <span className="me-1">{moodConfig[active.mood].emoji}</span>
                  {t(moodConfig[active.mood].ar, moodConfig[active.mood].en)}
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-cairo mb-2">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  {t(active.locationAr, active.locationEn)}
                </div>
                <h3 className="heading-cinematic text-3xl font-cairo mb-3">
                  {t(active.titleAr, active.titleEn)}
                </h3>

                <div className="flex flex-wrap items-center gap-4 mb-5 text-sm font-cairo">
                  <div className="flex items-center gap-2">
                    <Stars rating={active.rating} size="md" />
                    <span className="font-semibold text-foreground">{active.rating}</span>
                    <span className="text-muted-foreground text-xs">
                      ({active.reviewsCount} {t("تقييم", "reviews")})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>{active.duration} {t("ساعات", "hrs")}</span>
                  </div>
                </div>

                <p className="text-foreground/80 font-cairo leading-relaxed mb-6">
                  {t(active.storyAr, active.storyEn)}
                </p>

                {/* Audio mock */}
                <div className="mt-auto p-4 rounded-lg bg-muted/50 border border-border flex items-center gap-3">
                  <button
                    onClick={() => setMuted((m) => !m)}
                    className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:scale-105 transition-transform"
                    aria-label="audio"
                  >
                    {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-cairo">
                      {t("استمع للقصة", "Listen to the story")}
                    </p>
                    <p className="text-sm text-foreground font-cairo font-semibold">
                      {t(active.titleAr, active.titleEn)} — {t("سرد صوتي", "Audio narration")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PlacesSection;
