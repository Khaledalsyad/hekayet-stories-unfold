import { useLang } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Clock, Star, X, MapPin, Volume2, VolumeX, Sparkles } from "lucide-react";
import imgWadiHitan from "@/assets/places/wadi-hitan.jpg";
import imgLuxorTemple from "@/assets/places/luxor-temple.jpg";
import imgAbuHaggag from "@/assets/places/abu-haggag.jpg";
import imgHatshepsut from "@/assets/places/hatshepsut.jpg";
import imgMummification from "@/assets/places/mummification.jpg";
import imgMagicLake from "@/assets/places/magic-lake.jpg";
import imgThreePools from "@/assets/places/three-pools.jpg";
import imgWadiGenna from "@/assets/places/wadi-genna.jpg";
import imgWishwash from "@/assets/places/wishwash.jpg";
import imgKilani from "@/assets/places/kilani.jpg";

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
  highlights?: {
    titleAr: string;
    titleEn: string;
    bodyAr: string;
    bodyEn: string;
    emoji: string;
  }[];
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
    infoAr: "لما البحر يبقى صحرا — موقع تراث عالمي",
    infoEn: "When the sea becomes desert — UNESCO site",
    storyAr:
      "في قلب صحراء الفيوم، تنام حيتان عمرها 40 مليون سنة. اليونسكو اعترفت بيه سنة 2005 كأهم مكان في العالم لدراسة تطور الحيتان. متحف طبيعي مفتوح، الزمن هناك واقف.",
    storyEn:
      "In the heart of Fayoum desert rest whales 40 million years old. UNESCO recognized it in 2005 as the world's most important site for studying whale evolution. An open-air natural museum where time stands still.",
    locationAr: "الفيوم، مصر",
    locationEn: "Fayoum, Egypt",
    img: imgWadiHitan,
    mood: "mystery",
    category: "desert",
    duration: "3-4",
    rating: 4.8,
    reviewsCount: 240,
  },
  {
    id: 2,
    titleAr: "معبد الأقصر",
    titleEn: "Luxor Temple",
    infoAr: "حكاية عظمة مابتخلصش من 3 آلاف سنة",
    infoEn: "A 3,000-year tale of greatness",
    storyAr:
      "بناه أمنحتب الثالث وكمّله رمسيس الثاني. مكان مقدس فيه قدس الأقداس مسموح بس للكهنة والفرعون. فضل صامد، وبقى فيه كنيسة رومانية وفوقها مسجد أبو الحجاج، طبقات تاريخ فوق بعض.",
    storyEn:
      "Built by Amenhotep III, completed by Ramses II. A sacred site whose Holy of Holies admitted only priests and pharaoh. Layers of history: Roman church then Abu Haggag Mosque on top.",
    locationAr: "الأقصر، مصر",
    locationEn: "Luxor, Egypt",
    img: imgLuxorTemple,
    mood: "history",
    category: "ruins",
    duration: "4-5",
    rating: 4.9,
    reviewsCount: 612,
  },
  {
    id: 3,
    titleAr: "مسجد أبو الحجاج",
    titleEn: "Abu Haggag Mosque",
    infoAr: "مسجد في قلب معبد — لما التاريخ يشتبك في بعضه",
    infoEn: "A mosque inside a temple — history intertwined",
    storyAr:
      "أرض مباركة من 3 آلاف سنة. الشيخ أبو الحجاج وصل في القرن الـ13، وبعد وفاته اتبنى المسجد فوق المعبد. عبادة مستمرة من غير انقطاع، ومئذنة وسط نقوش فرعونية.",
    storyEn:
      "Sacred ground for 3,000 years. Sheikh Abu Haggag arrived in the 13th century; after his death the mosque rose atop the temple. Uninterrupted worship — a minaret amid Pharaonic carvings.",
    locationAr: "الأقصر، مصر",
    locationEn: "Luxor, Egypt",
    img: imgAbuHaggag,
    mood: "history",
    category: "ruins",
    duration: "1-2",
    rating: 4.7,
    reviewsCount: 198,
  },
  {
    id: 4,
    titleAr: "معبد حتشبسوت",
    titleEn: "Hatshepsut Temple",
    infoAr: "حكاية العظمة والخلود على الضفة الغربية",
    infoEn: "A tale of greatness on the West Bank",
    storyAr:
      "في حضن الجبل على الضفة الغربية للنيل، بناه المهندس سننموت لتخليد الملكة حتشبسوت. تصميم بثلاث مدرجات ضخمة، وبعثة تجارية لبلاد بونت سفنها محملة بالبخور والأخشاب النادرة.",
    storyEn:
      "Cradled in the cliffs of the West Bank, built by architect Senenmut to immortalize Queen Hatshepsut. A three-terrace masterpiece, with murals of the legendary expedition to the Land of Punt.",
    locationAr: "الأقصر، مصر",
    locationEn: "Luxor, Egypt",
    img: imgHatshepsut,
    mood: "history",
    category: "ruins",
    duration: "2-3",
    rating: 4.9,
    reviewsCount: 445,
  },
  {
    id: 5,
    titleAr: "متحف التحنيط",
    titleEn: "Mummification Museum",
    infoAr: "سر الخلود — رحلة عبور لعالم التاني",
    infoEn: "The secret of immortality",
    storyAr:
      "التحنيط كان كوبري بيعدي عليه المصري القديم من الفناء لحد ما يوصل للخلود. أدوات سبقت عصرها، الأواني الكانوبية الأربعة، وموميا الكاهن ماسحرتي اللي عاش أكتر من 3 آلاف سنة ولسه ملامحه واضحة.",
    storyEn:
      "Mummification was a bridge ancient Egyptians crossed from death to eternity. Tools ahead of their time, the four canopic jars, and the mummy of priest Maaserty — 3,000 years old with features still clear.",
    locationAr: "الأقصر، مصر",
    locationEn: "Luxor, Egypt",
    img: imgMummification,
    mood: "mystery",
    category: "ruins",
    duration: "1-2",
    rating: 4.6,
    reviewsCount: 156,
  },
  {
    id: 6,
    titleAr: "البحيرة السحرية",
    titleEn: "The Magic Lake",
    infoAr: "جوهرة الصحراء في وادي الريان",
    infoEn: "Desert jewel in Wadi El-Rayan",
    storyAr:
      "بحيرة مالحة هادئة محاطة برمال ذهبية. سُميت بالسحرية لتغير لون مياهها بشكل مستمر حسب زاوية الشمس — أزرق فاتح صباحاً، وذهبي وتركواز وقت الغروب. مياهها تنبثق من باطن الرمال في مشهد غامض.",
    storyEn:
      "A still salt lake circled by golden sands. Called 'magical' because its waters shift color with the sun — pale blue at dawn, gold and turquoise at sunset. Water springs mysteriously from beneath the dunes.",
    locationAr: "الفيوم، مصر",
    locationEn: "Fayoum, Egypt",
    img: imgMagicLake,
    mood: "calm",
    category: "desert",
    duration: "يوم كامل",
    rating: 4.8,
    reviewsCount: 287,
  },
  {
    id: 7,
    titleAr: "الثري بولز",
    titleEn: "Three Pools",
    infoAr: "بوابتك لعالم تاني تحت الميه في دهب",
    infoEn: "Your gateway to another underwater world",
    storyAr:
      "تلات برك مية طبيعية وسط الشعاب المرجانية، بعيد عن دهب بنص ساعة. عمق مثالي للمبتدئين، والمية مش عميقة ولا مخيفة. هتشوف شعاب مرجانية حقيقية وأسماك ملونة من غير ما تغوص لمسافات بعيدة.",
    storyEn:
      "Three natural pools amid coral reefs, half an hour from Dahab. Perfect depth for beginners — gentle waters, real reefs and colorful fish without diving deep.",
    locationAr: "دهب، جنوب سيناء",
    locationEn: "Dahab, South Sinai",
    img: imgThreePools,
    mood: "adventure",
    category: "sea",
    duration: "نصف يوم",
    rating: 4.9,
    reviewsCount: 398,
  },
  {
    id: 8,
    titleAr: "وادي جني",
    titleEn: "Wadi Genna",
    infoAr: "حكاية جبل وهدوء في قلب دهب",
    infoEn: "A mountain tale of stillness near Dahab",
    storyAr:
      "وادي جبلي طبيعي بكر، اتكوّن بين سلاسل جبال سيناء وصخوره منحوتة بفعل الرياح والزمن بألوان مختلفة. مكان مفيش فيه فنادق ولا دوشة، بس جبال وصمت يخليك تسمع صوت الطبيعة. جنة لمحبي المغامرة والهايكنج.",
    storyEn:
      "A pristine mountain valley between Sinai's ranges, its rocks carved by wind and time in shifting hues. No hotels, no noise — just mountains and silence. A paradise for adventurers and hikers.",
    locationAr: "دهب، جنوب سيناء",
    locationEn: "Dahab, South Sinai",
    img: imgWadiGenna,
    mood: "calm",
    category: "desert",
    duration: "يوم كامل",
    rating: 4.8,
    reviewsCount: 174,
  },
  {
    id: 9,
    titleAr: "وادي الوشواش",
    titleEn: "Wadi Al-Wishwash",
    infoAr: "سحر الوشوشة في جبال سيناء",
    infoEn: "The whispering wadi in Sinai's mountains",
    storyAr:
      "اتسمى الوشواش نسبة لصوت الرياح وهي 'توشوش' بين ممراته الجبلية العالية. الأمطار والسيول شكلت مجاري مياه وأحواض طبيعية داخل صخوره. بحيرات عذبة بعمق 8 أمتار في قلب الصحراء — ملاذ حقيقي للمغامرين.",
    storyEn:
      "Named for the wind that 'whispers' through its high rock corridors. Rains carved natural pools inside the stone — freshwater lakes 8 meters deep in the heart of the desert.",
    locationAr: "جنوب سيناء، مصر",
    locationEn: "South Sinai, Egypt",
    img: imgWishwash,
    mood: "adventure",
    category: "desert",
    duration: "يوم كامل",
    rating: 4.9,
    reviewsCount: 221,
    highlights: [
      {
        emoji: "⛰️",
        titleAr: "عبقرية الطبيعة في النحت",
        titleEn: "Nature's genius of carving",
        bodyAr: "شكّلت الأمطار والسيول عبر سنين طويلة مجاري مياه وأحواضاً طبيعية داخل صخور الوادي.",
        bodyEn: "Over long years, rains and floods carved natural water channels and pools inside the wadi's rocks.",
      },
      {
        emoji: "🏕️",
        titleAr: "ملاذ حقيقي للمغامرين",
        titleEn: "A true haven for adventurers",
        bodyAr: "يمثل الوادي تجربة طبيعية واقعية بعيدة عن الأماكن المصطنعة لمن يبحثون عن الجمال الخام.",
        bodyEn: "The wadi offers a raw, authentic nature experience far from artificial places — for those seeking untouched beauty.",
      },
      {
        emoji: "💧",
        titleAr: "بحيرات عذبة بعمق 8 أمتار",
        titleEn: "Freshwater pools 8 meters deep",
        bodyAr: "يضم الوادي عيون مياه صافية ونظيفة في قلب الصحراء.",
        bodyEn: "The wadi holds clear, clean springs in the heart of the desert.",
      },
      {
        emoji: "🌿",
        titleAr: "أنت ضيف في رحاب الطبيعة",
        titleEn: "You are a guest of nature",
        bodyAr: "الحفاظ على نظافة المكان واحترام هدوئه يضمن استمرار حكايته للأجيال القادمة.",
        bodyEn: "Keeping the place clean and respecting its silence ensures its story lives on for generations.",
      },
    ],
  },
  {
    id: 10,
    titleAr: "حي الكيلاني",
    titleEn: "Al-Kilani Quarter",
    infoAr: "حتة من أوروبا على أرض سيناء",
    infoEn: "A piece of Europe on Sinai's shore",
    storyAr:
      "من أكتر من 150 سنة وصلت مراكب البحارة اليونانيين لساحل الطور وبنوا حي الكيلاني. بيوت من حجر المرجان، شبابيك وبلكونات بلمسة أوروبية، ومسجد وكنيسة جيران في سلام. زمن هادي وسط الجبال والبحر.",
    storyEn:
      "150 years ago Greek sailors reached El-Tor's shore and built Al-Kilani. Coral-stone houses, European balconies, a mosque and church living side by side. A quiet age between mountains and sea.",
    locationAr: "الطور، جنوب سيناء",
    locationEn: "El-Tor, South Sinai",
    img: imgKilani,
    mood: "calm",
    category: "sea",
    duration: "نصف يوم",
    rating: 4.6,
    reviewsCount: 92,
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

// Recommendation engine: scores other places based on similarity to current.
// Designed to be extensible (later can mix user behavior signals).
interface Recommendation {
  place: Place;
  score: number;
  reasonAr: string;
  reasonEn: string;
}

const getRecommendations = (current: Place, all: Place[], limit = 3): Recommendation[] => {
  return all
    .filter((p) => p.id !== current.id)
    .map<Recommendation>((p) => {
      let score = 0;
      const reasons: { ar: string; en: string }[] = [];

      if (p.mood === current.mood) {
        score += 5;
        reasons.push({
          ar: `لأنك مهتم بـ${moodConfig[current.mood].ar}`,
          en: `Because you like ${moodConfig[current.mood].en}`,
        });
      }
      if (p.category === current.category) {
        score += 4;
        reasons.push({
          ar: `نفس نوع المكان (${categoryLabel[current.category].ar})`,
          en: `Same type (${categoryLabel[current.category].en})`,
        });
      }
      // Tiny rating boost as tie-breaker / quality signal
      score += p.rating * 0.2;

      const reason = reasons[0] ?? {
        ar: "مقترح بناءً على التقييم العالي",
        en: "Suggested based on high rating",
      };
      return { place: p, score, reasonAr: reason.ar, reasonEn: reason.en };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

const RecommendedPlaces = ({
  current,
  onSelect,
}: {
  current: Place;
  onSelect: (p: Place) => void;
}) => {
  const { t, lang } = useLang();
  const recs = useMemo(() => getRecommendations(current, places, 3), [current]);

  if (recs.length === 0) return null;

  return (
    <div className="px-6 md:px-8 pb-8 pt-2 md:col-span-2 border-t border-border">
      <div className="flex items-center gap-2 mt-6 mb-5">
        <Sparkles className="w-4 h-4 text-accent" />
        <h4 className="text-lg font-bold font-cairo">
          {t("أماكن قد تعجبك", "You may also like")}
        </h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recs.map((rec, i) => {
          const p = rec.place;
          const mood = moodConfig[p.mood];
          return (
            <motion.button
              key={p.id}
              type="button"
              onClick={() => onSelect(p)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
              className="group cinematic-card text-start flex flex-col overflow-hidden relative"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={p.img}
                  alt={t(p.titleAr, p.titleEn)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

                {/* Recommended badge */}
                <div
                  className={`absolute top-2 ${lang === "ar" ? "right-2" : "left-2"} px-2 py-0.5 rounded-full text-[10px] font-bold font-cairo bg-accent text-accent-foreground shadow-lg flex items-center gap-1`}
                >
                  <Sparkles className="w-3 h-3" />
                  {t("مقترح لك", "For you")}
                </div>

                {/* Mood badge */}
                <div
                  className={`absolute top-2 ${lang === "ar" ? "left-2" : "right-2"} px-2 py-0.5 rounded-full text-[10px] font-bold font-cairo ${mood.classes}`}
                >
                  {t(mood.ar, mood.en)}
                </div>

                {/* Reason overlay on hover */}
                <div className="absolute inset-0 bg-background/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
                  <p className="text-center text-sm font-cairo text-foreground leading-relaxed">
                    <Sparkles className="w-4 h-4 text-accent inline-block mb-1 me-1" />
                    <br />
                    {t(rec.reasonAr, rec.reasonEn)}
                  </p>
                </div>
              </div>
              <div className="p-3">
                <h5 className="font-bold font-cairo text-sm text-foreground mb-1 truncate">
                  {t(p.titleAr, p.titleEn)}
                </h5>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-cairo">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-accent" />
                    {t(p.locationAr, p.locationEn)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-accent text-accent" />
                    {p.rating}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
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

                {active.highlights && active.highlights.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {active.highlights.map((h, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                        className="p-4 rounded-xl bg-muted/40 border border-border hover:border-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl" aria-hidden>{h.emoji}</span>
                          <h4 className="font-bold font-cairo text-sm text-foreground leading-tight">
                            {t(h.titleAr, h.titleEn)}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground font-cairo leading-relaxed">
                          {t(h.bodyAr, h.bodyEn)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}

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

              <RecommendedPlaces current={active} onSelect={(p) => setActive(p)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PlacesSection;
