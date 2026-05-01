import { useLang } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { useState } from "react";
import place1 from "@/assets/place-1.jpg";
import place2 from "@/assets/place-2.jpg";
import place3 from "@/assets/place-3.jpg";
import place4 from "@/assets/place-4.jpg";

const thumbs = [place1, place2, place3, place4];
const pick = (i: number) => thumbs[i % thumbs.length];

const videos = ([
  // جنوب سيناء
  {
    id: 1,
    region: "جنوب سيناء",
    regionEn: "South Sinai",
    titleAr: "البيوت اليونانية القديمة (حي الكيلاني)",
    titleEn: "Old Greek Houses (Al-Kilani District)",
    descAr: "جولة في البيوت اليونانية القديمة بحي الكيلاني في مدينة الطور.",
    descEn: "A tour of the old Greek houses in Al-Kilani district, El-Tor city.",
    fbUrl: "https://www.facebook.com/reel/2173670483450173",
  },
  {
    id: 2,
    region: "جنوب سيناء",
    regionEn: "South Sinai",
    titleAr: "حمام موسى",
    titleEn: "Hammam Musa",
    descAr: "حمام موسى التاريخي بمدينة الطور.",
    descEn: "The historic Hammam Musa in El-Tor city.",
    fbUrl: "https://www.facebook.com/reel/2228951354600322",
  },
  {
    id: 3,
    region: "جنوب سيناء",
    regionEn: "South Sinai",
    titleAr: "وادي الوشواش",
    titleEn: "Wadi Al-Wishwash",
    descAr: "رحلة إلى وادي الوشواش في نويبع.",
    descEn: "A journey to Wadi Al-Wishwash in Nuweiba.",
    fbUrl: "https://www.facebook.com/reel/936618018735807",
  },
  {
    id: 4,
    region: "جنوب سيناء",
    regionEn: "South Sinai",
    titleAr: "محمية الثري بولز",
    titleEn: "Three Pools Reserve",
    descAr: "محمية الثري بولز الساحرة في دهب.",
    descEn: "The enchanting Three Pools reserve in Dahab.",
    fbUrl: "https://www.facebook.com/reel/1224080019469117",
  },
  {
    id: 5,
    region: "جنوب سيناء",
    regionEn: "South Sinai",
    titleAr: "وادي چني",
    titleEn: "Wadi Gnai",
    descAr: "جمال وادي چني في دهب.",
    descEn: "The beauty of Wadi Gnai in Dahab.",
    fbUrl: "https://www.facebook.com/reel/1655919219076447",
  },
  {
    id: 6,
    region: "جنوب سيناء",
    regionEn: "South Sinai",
    titleAr: "قلعة صلاح الدين الأيوبي",
    titleEn: "Saladin Citadel",
    descAr: "قلعة صلاح الدين الأيوبي في طابا.",
    descEn: "Saladin Citadel in Taba.",
    fbUrl: "https://www.facebook.com/reel/1872336376787059",
  },
  {
    id: 7,
    region: "جنوب سيناء",
    regionEn: "South Sinai",
    titleAr: "خليج فيورد باي",
    titleEn: "Fjord Bay",
    descAr: "خليج فيورد باي الخلاب في طابا.",
    descEn: "The breathtaking Fjord Bay in Taba.",
  },
  {
    id: 8,
    region: "جنوب سيناء",
    regionEn: "South Sinai",
    titleAr: "جبل سانت كاترين",
    titleEn: "Mount Saint Catherine",
    descAr: "أعلى قمم مصر، جبل سانت كاترين.",
    descEn: "Egypt's highest peak, Mount Saint Catherine.",
  },
  // الفيوم
  {
    id: 9,
    region: "الفيوم",
    regionEn: "Fayoum",
    titleAr: "جبل المدورة",
    titleEn: "Al-Modawara Mountain",
    descAr: "جبل المدورة في الفيوم.",
    descEn: "Al-Modawara Mountain in Fayoum.",
  },
  {
    id: 10,
    region: "الفيوم",
    regionEn: "Fayoum",
    titleAr: "وادي الحيتان",
    titleEn: "Wadi Al-Hitan",
    descAr: "في قلب الصحراء حيث كانت الحيتان تسبح منذ ملايين السنين.",
    descEn: "In the heart of the desert where whales swam millions of years ago.",
    fbUrl: "https://www.facebook.com/reel/1501155804781824",
  },
  {
    id: 11,
    region: "الفيوم",
    regionEn: "Fayoum",
    titleAr: "البحيرة السحرية",
    titleEn: "The Magic Lake",
    descAr: "البحيرة السحرية بألوانها المتغيرة في الفيوم.",
    descEn: "The Magic Lake with its changing colors in Fayoum.",
    fbUrl: "https://www.facebook.com/reel/1226540316312330",
  },
  // الأقصر
  {
    id: 20,
    region: "الأقصر",
    regionEn: "Luxor",
    titleAr: "معبد الأقصر",
    titleEn: "Luxor Temple",
    descAr: "معبد الأقصر العريق على ضفاف النيل.",
    descEn: "The ancient Luxor Temple on the banks of the Nile.",
    fbUrl: "https://www.facebook.com/reel/1466742028268904",
  },
  {
    id: 21,
    region: "الأقصر",
    regionEn: "Luxor",
    titleAr: "معبد حتشبسوت",
    titleEn: "Hatshepsut Temple",
    descAr: "معبد الملكة حتشبسوت في الدير البحري.",
    descEn: "Queen Hatshepsut's temple at Deir el-Bahari.",
    fbUrl: "https://www.facebook.com/reel/2200034264162286",
  },
  {
    id: 22,
    region: "الأقصر",
    regionEn: "Luxor",
    titleAr: "مسجد أبو الحجاج",
    titleEn: "Abu Al-Haggag Mosque",
    descAr: "مسجد أبو الحجاج الأقصري داخل معبد الأقصر.",
    descEn: "Abu Al-Haggag Mosque inside Luxor Temple.",
    fbUrl: "https://www.facebook.com/reel/974682125015256",
  },
  {
    id: 23,
    region: "الأقصر",
    regionEn: "Luxor",
    titleAr: "متحف التحنيط",
    titleEn: "Mummification Museum",
    descAr: "متحف التحنيط بالأقصر وأسرار الفراعنة.",
    descEn: "The Mummification Museum in Luxor and the secrets of the Pharaohs.",
    fbUrl: "https://www.facebook.com/reel/986541337278800",
  },
  // القاهرة
  {
    id: 12,
    region: "القاهرة",
    regionEn: "Cairo",
    titleAr: "مجمع الأزهر بالدراسة",
    titleEn: "Al-Azhar Complex (Al-Derasa)",
    descAr: "جولة في مجمع الأزهر بمنطقة الدراسة.",
    descEn: "A tour of Al-Azhar Complex in Al-Derasa area.",
  },
  {
    id: 13,
    region: "القاهرة",
    regionEn: "Cairo",
    titleAr: "كلية اللغة العربية",
    titleEn: "Faculty of Arabic Language",
    descAr: "كلية اللغة العربية بجامعة الأزهر.",
    descEn: "Faculty of Arabic Language at Al-Azhar University.",
  },
  {
    id: 14,
    region: "القاهرة",
    regionEn: "Cairo",
    titleAr: "كلية أصول الدين",
    titleEn: "Faculty of Usul Al-Din",
    descAr: "كلية أصول الدين بجامعة الأزهر.",
    descEn: "Faculty of Usul Al-Din at Al-Azhar University.",
  },
  {
    id: 15,
    region: "القاهرة",
    regionEn: "Cairo",
    titleAr: "كلية الشريعة والقانون",
    titleEn: "Faculty of Sharia and Law",
    descAr: "كلية الشريعة والقانون بجامعة الأزهر.",
    descEn: "Faculty of Sharia and Law at Al-Azhar University.",
  },
  {
    id: 16,
    region: "القاهرة",
    regionEn: "Cairo",
    titleAr: "قاعة الإمام محمد عبده",
    titleEn: "Imam Muhammad Abduh Hall",
    descAr: "قاعة الإمام محمد عبده التاريخية.",
    descEn: "The historic Imam Muhammad Abduh Hall.",
  },
  {
    id: 17,
    region: "القاهرة",
    regionEn: "Cairo",
    titleAr: "مشيخة الأزهر القديمة",
    titleEn: "Old Al-Azhar Mashyakha",
    descAr: "مبنى مشيخة الأزهر القديم وعراقته.",
    descEn: "The old Al-Azhar Mashyakha building and its heritage.",
  },
  {
    id: 18,
    region: "القاهرة",
    regionEn: "Cairo",
    titleAr: "مسجد الأزهر",
    titleEn: "Al-Azhar Mosque",
    descAr: "مسجد الأزهر الشريف، منارة العلم.",
    descEn: "Al-Azhar Mosque, the beacon of knowledge.",
  },
  {
    id: 19,
    region: "القاهرة",
    regionEn: "Cairo",
    titleAr: "مسجد الحسين",
    titleEn: "Al-Hussein Mosque",
    descAr: "مسجد الحسين بقلب القاهرة الفاطمية.",
    descEn: "Al-Hussein Mosque in the heart of Fatimid Cairo.",
  },
] as Array<{
  id: number;
  region: string;
  regionEn: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  fbUrl?: string;
}>).map((v, i) => ({
  ...v,
  thumb: pick(i),
  videoUrl: v.fbUrl
    ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(v.fbUrl)}&show_text=false&autoplay=false`
    : "https://www.youtube.com/embed/dQw4w9WgXcQ",
}));

const VideoSection = () => {
  const { t } = useLang();
  const [activeVideo, setActiveVideo] = useState<(typeof videos)[0] | null>(null);

  return (
    <section id="videos" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-accent text-sm tracking-[0.2em] uppercase mb-3 font-cairo">
            {t("شاهد الحلقات", "Watch Episodes")}
          </p>
          <h2 className="heading-cinematic font-cairo">
            {t("حكايات من كل مكان", "Stories From Every Place")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              onClick={() => setActiveVideo(video)}
              className="cinematic-card cursor-pointer group"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={video.thumb}
                  alt={t(video.titleAr, video.titleEn)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  width={512}
                  height={288}
                />
                <div className="absolute top-2 right-2 bg-accent/90 text-accent-foreground text-[10px] font-bold px-2 py-1 rounded font-cairo">
                  {t(video.region, video.regionEn)}
                </div>
                <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-accent/90 flex items-center justify-center glow-accent">
                    <Play className="w-6 h-6 text-accent-foreground ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold font-cairo text-foreground">
                  {t(video.titleAr, video.titleEn)}
                </h3>
                <p className="text-muted-foreground text-xs mt-1 line-clamp-2 font-cairo">
                  {t(video.descAr, video.descEn)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-5xl w-full grid md:grid-cols-5 gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:col-span-3 aspect-video bg-muted rounded-lg overflow-hidden">
              <iframe
                src={activeVideo.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={t(activeVideo.titleAr, activeVideo.titleEn)}
              />
            </div>
            <div className="md:col-span-2 flex flex-col justify-center">
              <p className="text-accent text-xs tracking-widest uppercase mb-2 font-cairo">
                {t(activeVideo.region, activeVideo.regionEn)}
              </p>
              <h3 className="heading-cinematic text-2xl font-cairo mb-4">
                {t(activeVideo.titleAr, activeVideo.titleEn)}
              </h3>
              <p className="text-muted-foreground font-cairo leading-relaxed">
                {t(activeVideo.descAr, activeVideo.descEn)}
              </p>
            </div>
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default VideoSection;
